import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { DIST, fail, page, read } from "./lib.mjs";

const POSTS_DIR = "src/content/blog";
const GITTY = process.env.GITTY_REPO ?? "../gitty";
const SITE = "https://gitty.runs-on.dev";

function parse(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^".*"$/.test(value)) value = value.slice(1, -1).replace(/\\"/g, '"');
    else if (/^\[.*\]$/.test(value))
      value = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    else if (value === "true" || value === "false") value = value === "true";
    else if (/^\d+$/.test(value)) value = Number(value);
    data[kv[1]] = value;
  }
  return { data, body: match[2] };
}

const normalize = (text) => text.toLowerCase().replace(/[\s,]/g, "");
const prose = (body) => body.replace(/```[\s\S]*?```/g, " ");
const wordCount = (body) =>
  prose(body).trim().split(/\s+/).filter(Boolean).length;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function checkLinks() {
  const blogDir = join(DIST, "blog");
  const files = (existsSync(blogDir) ? walk(blogDir) : [])
    .filter((f) => f.endsWith(".html"))
    .concat(join(DIST, "index.html"));
  for (const file of files) {
    const html = read(file);
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)[^"]*"/g)) {
      if (href.startsWith("//") || href.startsWith("/pagefind")) continue;
      const target = /\.[a-z0-9]+$/i.test(href)
        ? join(DIST, href)
        : join(DIST, href, "index.html");
      if (!existsSync(target))
        fail(`links: ${file} points to ${href}, which does not exist`);
    }
  }
}

export function checkBlog() {
  const files = existsSync(POSTS_DIR)
    ? readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))
    : [];
  const posts = files.map((f) => ({
    id: f.replace(/\.md$/, ""),
    ...parse(readFileSync(join(POSTS_DIR, f), "utf8")),
  }));
  const published = posts.filter((p) => p.data && !p.data.draft);

  const expected = process.env.EXPECT_POSTS
    ? Number(process.env.EXPECT_POSTS)
    : null;
  if (expected !== null && published.length !== expected)
    fail(
      `blog: expected ${expected} published posts, found ${published.length}`,
    );

  const facts = ["README.md", "bench/README.md", "CHANGELOG.md"]
    .map((f) =>
      existsSync(join(GITTY, f)) ? readFileSync(join(GITTY, f), "utf8") : "",
    )
    .join("\n");
  if (!facts.trim())
    fail(`facts: could not read gitty docs from ${GITTY} (set GITTY_REPO)`);
  const factsNorm = normalize(facts);

  const index = page("blog");
  if (!index) fail("blog: dist/blog/index.html is missing");
  const sitemap = existsSync(join(DIST, "sitemap-0.xml"))
    ? read(join(DIST, "sitemap-0.xml"))
    : "";
  if (!sitemap.includes(`${SITE}/blog/`)) fail("sitemap: /blog/ is missing");
  const rss = existsSync(join(DIST, "blog/rss.xml"))
    ? read(join(DIST, "blog/rss.xml"))
    : "";
  if (!rss) fail("rss: dist/blog/rss.xml is missing");
  const items = (rss.match(/<item>/g) || []).length;
  if (items !== published.length)
    fail(`rss: ${items} items, expected ${published.length}`);
  if (
    /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/.test(
      rss.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, ""),
    )
  )
    fail("rss: contains an unescaped ampersand");

  const titles = new Set();
  for (const post of posts) {
    const where = `blog/${post.id}`;
    if (!post.data) {
      fail(`${where}: frontmatter is missing or malformed`);
      continue;
    }
    const html = page(where);
    const url = `${SITE}/blog/${post.id}/`;

    if (post.data.draft) {
      if (html) fail(`${where}: a draft was built`);
      if (sitemap.includes(url)) fail(`${where}: a draft is in the sitemap`);
      if (rss.includes(`/blog/${post.id}/`))
        fail(`${where}: a draft is in the feed`);
      if (index?.includes(`/blog/${post.id}/`))
        fail(`${where}: a draft is on the index`);
      continue;
    }

    for (const key of ["title", "description", "date", "kind"])
      if (!post.data[key]) fail(`${where}: missing ${key}`);
    if (post.data.date !== "2026-10-07")
      fail(`${where}: date must be 2026-10-07`);
    if (!html) {
      fail(`${where}: page was not built`);
      continue;
    }
    if (titles.has(post.data.title)) fail(`${where}: duplicate title`);
    titles.add(post.data.title);

    const words = wordCount(post.body);
    if (words < 600 || words > 1200)
      fail(`${where}: ${words} words, must be 600-1200`);
    if ((html.match(/<h1[\s>]/g) || []).length !== 1)
      fail(`${where}: expected exactly one <h1>`);
    if (!html.includes(`rel="canonical" href="${url}"`))
      fail(`${where}: canonical is wrong`);
    if (!html.includes('"BlogPosting"'))
      fail(`${where}: BlogPosting JSON-LD missing`);
    if (!html.includes('"BreadcrumbList"'))
      fail(`${where}: BreadcrumbList JSON-LD missing`);
    if (!html.includes('property="og:type" content="article"'))
      fail(`${where}: og:type is not article`);
    if (!sitemap.includes(url)) fail(`${where}: not in the sitemap`);
    if (!rss.includes(`/blog/${post.id}/`)) fail(`${where}: not in the feed`);
    if (!index?.includes(`href="/blog/${post.id}/"`))
      fail(`${where}: not linked from the index`);

    const byline = (
      html.match(/<p class="post-by">([\s\S]*?)<\/p>/)?.[1] ?? ""
    )
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ");
    if (!/ on [A-Z][a-z]+ \d{1,2}, \d{4}\. \d+ min read\.$/.test(byline))
      fail(`${where}: byline spacing is wrong: "${byline.trim()}"`);

    const wantRelated = Math.min(3, published.length - 1);
    const relatedLinks = [
      ...(
        html.match(/<aside class="related"[\s\S]*?<\/aside>/)?.[0] ?? ""
      ).matchAll(/href="\/blog\/([^"/]+)\/"/g),
    ].map((m) => m[1]);
    if (relatedLinks.length !== wantRelated)
      fail(
        `${where}: ${relatedLinks.length} related links, expected ${wantRelated}`,
      );
    if (relatedLinks.includes(post.id))
      fail(`${where}: lists itself as related`);

    for (const [token] of prose(post.body).matchAll(
      /\b\d+(?:\.\d+)?\s?(?:ms|µs)\b/g,
    ))
      if (!factsNorm.includes(normalize(token)))
        fail(
          `${where}: "${token}" is not in gitty's README, bench README or changelog`,
        );
  }
  checkLinks();
}

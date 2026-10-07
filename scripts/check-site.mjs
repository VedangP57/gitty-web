// Checks the built site in dist/. Usage: bun scripts/check-site.mjs <landing|blog|all>
import { existsSync } from "node:fs";
import { failures, fail, page } from "./lib.mjs";

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

function checkLanding() {
  const html = page("");
  if (!html) return fail("landing: dist/index.html is missing");
  if (!/\bgit TUI\b/.test(visibleText(html)))
    fail('landing: visible text never says "git TUI"');
  if ((html.match(/<h1[\s>]/g) || []).length !== 1)
    fail("landing: expected exactly one <h1>");
  const header = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";
  if (!header.includes('href="/blog/"'))
    fail("landing: header has no link to /blog/");
  if (!footer.includes('href="/blog/"'))
    fail("landing: footer has no link to /blog/");
  if (!footer.includes("not affiliated with GitHub"))
    fail("landing: footer lacks the non-affiliation note");
  if (!html.includes('class="skip"')) fail("landing: skip link is missing");
  if (!html.includes('"SoftwareApplication"'))
    fail("landing: SoftwareApplication JSON-LD is missing");
  if (!html.includes('rel="canonical" href="https://gitty.runs-on.dev/"'))
    fail("landing: canonical URL is wrong");
  if (!html.includes('type="application/rss+xml"'))
    fail("landing: RSS auto-discovery link is missing");
}

const mode = process.argv[2] ?? "all";
if (mode === "landing" || mode === "all") checkLanding();

if (mode === "blog" || mode === "all") {
  if (existsSync(new URL("./check-blog.mjs", import.meta.url))) {
    const { checkBlog } = await import("./check-blog.mjs");
    checkBlog();
  } else if (mode === "blog") {
    fail("blog: scripts/check-blog.mjs does not exist yet");
  }
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`check-site (${mode}): all checks passed`);

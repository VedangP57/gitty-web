import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../../lib/blog";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "gitty blog",
    description:
      "Guides, comparisons and engineering notes about gitty, a fast git TUI written in Rust.",
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: "<language>en-us</language>",
  });
}

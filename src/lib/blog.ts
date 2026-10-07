import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;
export type Kind = Post["data"]["kind"];

export const kindLabel: Record<Kind, string> = {
  howto: "How-to",
  engineering: "Engineering",
  comparison: "Comparison",
  guide: "Guide",
};

/** Published posts: newest first, then by `order`, then by id. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection("blog", ({ data }) => !data.draft);
  return all.sort(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() ||
      a.data.order - b.data.order ||
      a.id.localeCompare(b.id),
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function readingMinutes(body: string | undefined): number {
  const words = (body ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Up to `n` other posts: same kind first, then the rest, in index order. Never the post itself. */
export function related(post: Post, posts: Post[], n = 3): Post[] {
  const others = posts.filter((p) => p.id !== post.id);
  const sameKind = others.filter((p) => p.data.kind === post.data.kind);
  const rest = others.filter((p) => p.data.kind !== post.data.kind);
  return [...sameKind, ...rest].slice(0, n);
}

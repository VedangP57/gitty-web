# Blog for gitty-web — design

Date: 2026-10-07

## Goal

Bring search traffic from people looking for a git TUI, a terminal git client, a lazygit/tig/gitui
alternative, or a GitHub Desktop alternative in the terminal. Success looks like: 20 accurate posts
live at `gitty.runs-on.dev/blog`, indexed by Google, each one answering a real search.

Not a goal: ranking for "GitHub", "GitHub Desktop" or "UI". Those terms belong to GitHub's own
sites and are too broad to target.

## What the client said

- Mixed content: how-tos, engineering stories and fair comparisons.
- 20 posts in the first batch, all published at once.
- Posts are written by Claude and published under the owner's name (Vedang Patel). The owner
  reviews before anything goes live.
- Focus search intent on "TUI" (not "UI").

## Approach

Astro content collection with its own pages, styled like the landing page. Rejected: putting posts
in Starlight docs (no dates, RSS or blog index), and a community Starlight blog plugin (third-party
dependency and styling conflicts).

New dependency: `@astrojs/rss` (official).

## Components

| Piece         | File                                                  | Purpose                                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Collection    | `src/content.config.ts`                               | Add a `blog` collection (glob loader over `src/content/blog/*.md`). Schema: `title`, `description` (≤160 chars), `date`, `updated?`, `tags[]`, `kind` (`howto` / `engineering` / `comparison` / `guide`), `draft?`. |
| Posts         | `src/content/blog/*.md`                               | One Markdown file per post.                                                                                                                                                                                         |
| Index         | `src/pages/blog/index.astro`                          | Posts newest first, with title, summary, date and kind.                                                                                                                                                             |
| Post page     | `src/pages/blog/[...slug].astro`                      | Renders a post; shows date, reading time, up to 3 related posts of the same kind, and an install call to action.                                                                                                    |
| Feed          | `src/pages/blog/rss.xml.ts`                           | RSS 2.0 for all published posts.                                                                                                                                                                                    |
| Shared chrome | `src/components/SiteHeader.astro`, `SiteFooter.astro` | Extract the landing page's header and footer so the blog reuses them (Blog link added). Landing page switches to the shared components.                                                                             |
| Prose styles  | `src/styles/blog.css`                                 | Readable column (about 68ch), code blocks, tables. Uses existing tokens, both themes.                                                                                                                               |

Draft posts (`draft: true`) are excluded from the index, feed, sitemap and static paths.

## SEO per post

- Unique `<title>`, description, canonical, Open Graph and Twitter tags (reuse `og.png`).
- JSON-LD: `BlogPosting` plus `BreadcrumbList` (home → blog → post).
- `<link rel="alternate" type="application/rss+xml">` on blog pages and the landing page.
- Sitemap picks up `/blog/` and posts automatically; no `lastmod` fakery (use `updated` or `date`).
- Internal links: each post links to the relevant docs page, and to related posts.

## Landing page changes

- Make "TUI" visible in the hero: change the lede's first sentence to "A fast git TUI with the
  GitHub Desktop experience." (one use, no repetition elsewhere in the hero).
- Add "Blog" to the header and footer.
- Add the footer line: "gitty is an independent project and is not affiliated with GitHub."

## Content: the 20 posts

**Explainers and guides**

1. What is a git TUI, and when should you use one?
2. Install gitty on macOS and Linux
3. A git TUI over SSH
4. Keeping a git TUI fast on very large repositories

**Comparisons** 5. The best git TUI clients compared 6. gitty vs lazygit 7. gitty vs tig 8. gitty vs gitui 9. A GitHub Desktop alternative in the terminal

**How-tos** 10. How to stage a single line in a git TUI 11. How to browse a huge repository's history 12. How to undo your last commit safely 13. How to compare your branch with main 14. How to search commits by text, author or path 15. How to review a range of commits 16. How to change gitty's theme, or write your own

**Engineering** 17. How a Rust TUI draws its first frame in 14 ms 18. Why gitty reads the commit-graph 19. The bug that froze the UI for 350 ms 20. How we measure a terminal UI end to end

Each post: 600–1,200 words, plain sentence-case headings, one clear answer up front, dated
2026-10-07.

## Accuracy rules

- Claims about gitty come only from `gitty/README.md`, `bench/README.md`, `CHANGELOG.md`, the docs
  in this repo, or the gitty source. No invented numbers or features. If a fact can't be found, the
  sentence is cut.
- Keybindings and config keys are checked against `docs/keys` and `docs/configuration` in this repo.
- Claims about lazygit, tig, gitui and GitHub Desktop are checked against their current official
  docs/READMEs at writing time, limited to checkable facts (language, platforms, features). No
  speed or quality claims about other tools. Each comparison states what the other tool does well.
- The landing page's demo commits are sample data. Posts never present them as real history.
- Engineering posts 17–20 cite the measurement conditions given in `bench/README.md` (machine,
  repo, date).

## Testing and done criteria

- `bun run build` and `bun run check` pass with 0 errors, warnings and hints.
- `/blog` and one post pass Lighthouse (accessibility, best practices, SEO) at 100, in light and dark.
- Sitemap lists `/blog/` and all 20 posts, with no drafts. RSS validates and lists 20 items.
- No broken internal links (scripted check across built HTML).
- Every post renders in both themes; code blocks and tables don't overflow at 390px.
- The owner reads the post list and a sample of posts before the push to `main`.

## Out of scope

Comments, newsletters, tag pages, search across the blog, author pages, and images beyond the
shared social card. These can follow if the blog earns traffic.

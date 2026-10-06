# gitty-web

The website for [gitty](https://github.com/VedangP57/gitty), a fast terminal git client with the
GitHub Desktop experience. Live at https://gitty.runs-on.dev.

Built with Astro, Starlight (docs) and Solid (the interactive terminal demo).

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # static site in dist/
bun run preview  # serve dist/
bun run check    # type-check
```

## Layout

| Path                               | What it is                                                   |
| ---------------------------------- | ------------------------------------------------------------ |
| `src/pages/index.astro`            | Landing page, including its SEO tags and structured data     |
| `src/components/GittyMock.tsx`     | The clickable terminal demo (Solid island)                   |
| `src/components/Head.astro`        | Docs `<head>` additions: social tags, JSON-LD, PWA links     |
| `src/content/docs/docs/`           | Docs pages, served under `/docs/`                            |
| `src/styles/tokens.css`            | Colour, type and spacing tokens for both themes              |
| `src/pages/og.astro`, `icon.astro` | Sources for `public/og.png` and the app icons                |
| `public/`                          | Manifest, service worker, robots.txt, icons and social image |

`og.png` and the `icon-*.png` files are screenshots of `/og` and `/icon`. Regenerate them after
changing those pages.

## Configuration

`SITE_URL` sets the canonical URLs, sitemap and social cards. It defaults to
`https://gitty.runs-on.dev`.

## Deploy

Pushing to `main` deploys to Vercel. `vercel.json` sets the security and cache headers.

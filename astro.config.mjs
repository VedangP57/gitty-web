// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import starlight from '@astrojs/starlight';

// The live address drives canonical URLs, the sitemap and social cards.
// Set SITE_URL when the domain is final.
const site = process.env.SITE_URL ?? 'https://gitty.runs-on.dev';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    starlight({
      title: 'gitty',
      description: 'A fast terminal git client with the GitHub Desktop experience.',
      customCss: ['./src/styles/tokens.css', './src/styles/starlight.css'],
      components: {
        Head: './src/components/Head.astro',
      },
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        styleOverrides: { borderRadius: '0' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/VedangP57/gitty' },
      ],
      editLink: {
        baseUrl: 'https://github.com/VedangP57/gitty-web/edit/main/',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Installation', slug: 'docs/installation' },
            { label: 'Using gitty', slug: 'docs/using-gitty' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Keybindings', slug: 'docs/keys' },
            { label: 'Configuration', slug: 'docs/configuration' },
            { label: 'Themes', slug: 'docs/themes' },
          ],
        },
      ],
    }),
    solid({ include: ['**/*.tsx', '**/*.jsx'] }),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/og' && path !== '/og/' && path !== '/icon' && path !== '/icon/' && !path.includes('/404');
      },
    }),
  ],
});

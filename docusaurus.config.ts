import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { config as dotenvconfig } from "dotenv";

dotenvconfig({ path: './portfolio.config' });
dotenvconfig({ path: './pages.config' });

const blogEnabled = true

const config: Config = {
  title: process.env.TITLE ?? 'DevSecOps Unlocked',
  tagline: process.env.TAGLINE ?? 'Where DevOps meets Security.',
  favicon: 'img/favicon.svg',

  url: process.env.DEPLOYMENT_URL ?? "https://reiloe.github.io",
  baseUrl: process.env.BASE_URL ?? "/my-devsecops-portfolio/",

  organizationName: process.env.GITHUB_ORG ?? "reiloe",
  projectName: process.env.GITHUB_PROJECT ?? "my-devsecops-portfolio",

  deploymentBranch: process.env.DEPLOYMENT_BRANCH,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    legalName: process.env.LEGAL_NAME,
    legalStreet: process.env.LEGAL_STREET,
    legalCity: process.env.LEGAL_CITY,
    legalCountry: process.env.LEGAL_COUNTRY,
    legalEmail: process.env.LEGAL_EMAIL,
    legalPhone: process.env.LEGAL_PHONE,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          include: ['**/*.md', '**/*.mdx'],
          exclude: [],
          routeBasePath: '/docs',
        },
        blog: blogEnabled ?
          {
            showReadingTime: true,
            feedOptions: {
              type: ['rss', 'atom'],
              xslt: true,
            },
            onInlineTags: 'warn',
            onInlineAuthors: 'warn',
            onUntruncatedBlogPosts: 'warn',
          }
          : false,
        theme: {
          customCss: './src/css/docs.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    navbar: {
      title: 'Home',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        ...(blogEnabled ? [{ to: '/blog', label: 'Blog', position: 'left' as const }] : []),
        {
          href: 'https://github.com/reiloe/my-devsecops-portfolio',
          label: 'Github',
          position: 'right' as const,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Legal',
          items: [
            {
              label: 'Legal Information',
              to: '/legal-information',
            },
            {
              label: 'Privacy Policy',
              to: '/privacy-policy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Reik Loeber. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['powershell', 'hcl'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

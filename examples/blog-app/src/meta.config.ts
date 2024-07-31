import { type MetaConfig } from '@n2m/shared-types'

export const metaConfig = {
  index: {
    en: {
      title: 'Home - Blog',
      meta: [
        {
          name: 'description',
          content:
            'Welcome to our blog. Explore the latest articles, insights, and expert analysis on various topics including finance, news, and technology.',
        },
        {
          name: 'keywords',
          content: 'blog, articles, insights, analysis, finance, news, technology',
        },
        {
          name: 'author',
          content: 'teunlao',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:title',
          content: 'Home - Blog',
        },
        {
          property: 'og:description',
          content:
            'Welcome to our blog. Explore the latest articles, insights, and expert analysis on various topics including finance, news, and technology.',
        },
        {
          property: 'twitter:title',
          content: 'Home - Blog',
        },
        {
          property: 'twitter:description',
          content:
            'Welcome to our blog. Explore the latest articles, insights, and expert analysis on various topics including finance, news, and technology.',
        },
      ],
    },
  },
  articles: {
    en: {
      title: 'Articles - Blog',
      meta: [
        {
          name: 'description',
          content:
            'Explore the latest articles on finance, news, and technology. Stay updated with in-depth analysis and expert insights.',
        },
        {
          name: 'keywords',
          content: 'finance, news, technology, articles, insights, analysis',
        },
        {
          name: 'author',
          content: 'teunlao',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:title',
          content: 'Articles - Blog',
        },
        {
          property: 'og:description',
          content:
            'Explore the latest articles on finance, news, and technology. Stay updated with in-depth analysis and expert insights.',
        },
        {
          property: 'twitter:title',
          content: 'Articles - Blog',
        },
        {
          property: 'twitter:description',
          content:
            'Explore the latest articles on finance, news, and technology. Stay updated with in-depth analysis and expert insights.',
        },
      ],
    },
  },
} satisfies MetaConfig

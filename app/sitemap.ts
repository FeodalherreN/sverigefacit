import type { MetadataRoute } from 'next';
import { siteConfig } from './site-config';
import { seoTopics, topicPath } from './seo-topics';

export default function sitemap(): MetadataRoute.Sitemap {
  const topicPages: MetadataRoute.Sitemap = seoTopics.map((topic) => ({
    url: `${siteConfig.url}${topicPath(topic.slug)}`,
    lastModified: new Date(siteConfig.modified),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/statistik`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...topicPages,
    {
      url: `${siteConfig.url}/politik/valloften`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/metod`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/kallor`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}

import type { MetadataRoute } from 'next';
import { facts, factPath } from './fakta/facts';
import { siteConfig } from './site-config';
import { seoTopics, topicPath } from './seo-topics';

export default function sitemap(): MetadataRoute.Sitemap {
  const topicPages: MetadataRoute.Sitemap = seoTopics.map((topic) => ({
    url: `${siteConfig.url}${topicPath(topic.slug)}`,
    lastModified: new Date(siteConfig.modified),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  const factPages: MetadataRoute.Sitemap = facts.map((fact) => ({
    url: `${siteConfig.url}${factPath(fact.slug)}`,
    lastModified: new Date(siteConfig.modified),
    changeFrequency: 'weekly',
    priority: 0.86,
  }));

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/valet-2026`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/fakta`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    ...factPages,
    {
      url: `${siteConfig.url}/statistik`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...topicPages,
    {
      url: `${siteConfig.url}/datastudio`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.78,
    },
    {
      url: `${siteConfig.url}/kommun`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/analys/brott-och-migration`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
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
      url: `${siteConfig.url}/om`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.62,
    },
    {
      url: `${siteConfig.url}/rattelser`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: `${siteConfig.url}/kallor`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/integritet`,
      lastModified: new Date(siteConfig.modified),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

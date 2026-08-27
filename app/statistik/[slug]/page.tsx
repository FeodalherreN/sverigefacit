import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TopicPage } from '../../topic-page';
import { seoTopics, topicBySlug, topicPath } from '../../seo-topics';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return seoTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicBySlug[slug];
  if (!topic) return {};

  return {
    title: topic.seoTitle,
    description: topic.description,
    alternates: { canonical: topicPath(slug) },
    openGraph: {
      type: 'website',
      url: topicPath(slug),
      title: topic.seoTitle,
      description: topic.description,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: `${topic.heading} · Sverigefacit` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: topic.seoTitle,
      description: topic.description,
      images: ['/og.png'],
    },
  };
}

export default async function StatisticsTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = topicBySlug[slug];
  if (!topic) notFound();
  return <TopicPage topic={topic} />;
}

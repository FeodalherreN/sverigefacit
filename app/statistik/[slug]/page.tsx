import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClimateEnvironmentPage } from '../../climate-environment-page';
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
      images: [],
    },
    twitter: {
      card: 'summary',
      title: topic.seoTitle,
      description: topic.description,
      images: [],
    },
  };
}

export default async function StatisticsTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = topicBySlug[slug];
  if (!topic) notFound();
  if (slug === 'klimat-och-miljo') return <ClimateEnvironmentPage topic={topic} />;
  return <TopicPage topic={topic} />;
}

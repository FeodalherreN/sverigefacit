import { facts, factPath } from '../fakta/facts';
import { siteConfig } from '../site-config';

export const dynamic = 'force-static';

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export function GET() {
  const published = new Date(`${siteConfig.modified}T12:00:00Z`).toUTCString();
  const items = facts.map((fact) => {
    const url = `${siteConfig.url}${factPath(fact.slug)}`;
    const description = `${fact.answer} ${fact.limitation}`;
    return `<item>
      <title>${escapeXml(fact.question)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${published}</pubDate>
      <category>${escapeXml(fact.topic)}</category>
      <description>${escapeXml(description)}</description>
      <source url="${escapeXml(fact.sourceUrl)}">${escapeXml(fact.sourceOrganization)}</source>
    </item>`;
  }).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} – nya facit</title>
    <link>${escapeXml(`${siteConfig.url}/fakta`)}</link>
    <description>${escapeXml('Nya källbelagda svar om svensk politik, samhälle och ekonomi.')}</description>
    <language>sv-SE</language>
    <lastBuildDate>${published}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteConfig.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

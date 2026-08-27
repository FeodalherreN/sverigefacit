const key = process.env.INDEXNOW_KEY || 'd4d73a7e7ce2f13dddd54a4a45063571';
const origin = (process.env.INDEXNOW_ORIGIN || 'https://www.sverigefacit.se').replace(/\/$/, '');
const sitemapUrl = process.env.INDEXNOW_SITEMAP_URL || `${origin}/sitemap.xml`;

const sitemapResponse = await fetch(sitemapUrl);
if (!sitemapResponse.ok) throw new Error(`Kunde inte läsa sitemap (${sitemapResponse.status}).`);
const sitemap = await sitemapResponse.text();
const discoveredPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => new URL(match[1].replaceAll('&amp;', '&')).pathname);
const urlList = [...new Set(discoveredPaths.map((pathname) => `${origin}${pathname}`))];

if (!urlList.length) throw new Error('Sitemap innehöll inga URL:er.');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(origin).host,
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList,
  }),
});

if (![200, 202].includes(response.status)) {
  const details = await response.text();
  throw new Error(`IndexNow avvisade begäran (${response.status})${details ? `: ${details}` : '.'}`);
}

console.log(`IndexNow tog emot ${urlList.length} URL:er (${response.status}).`);

import { factBySlug } from '../../facts';

type RouteContext = { params: Promise<{ slug: string }> };

const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const fact = factBySlug[slug];
  if (!fact?.points) return new Response('Tidsseriedata saknas.', { status: 404 });

  const rows = [
    ['year', 'value', 'display', 'unit', 'source_url'].map(csvCell).join(','),
    ...fact.points.map((point) => [point.year, point.value, point.display, fact.unit, fact.sourceUrl].map(csvCell).join(',')),
  ];

  return new Response(`\uFEFF${rows.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sverigefacit-${slug}.csv"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Robots-Tag': 'noindex, follow',
    },
  });
}

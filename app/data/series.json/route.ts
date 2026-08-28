import { rawSeriesCatalog } from '../series-catalog';

export const dynamic = 'force-static';

export async function GET() {
  return Response.json(rawSeriesCatalog, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'Content-Disposition': 'inline; filename="sverigefacit-series.json"',
    },
  });
}

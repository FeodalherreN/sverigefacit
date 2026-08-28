type KoladaMunicipality = {
  id: string;
  title: string;
  type: string;
};

export async function GET() {
  try {
    const response = await fetch('https://api.kolada.se/v3/municipality?type=K&per_page=5000', {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Kolada svarade med ${response.status}`);
    const payload = await response.json() as { values?: KoladaMunicipality[] };
    const municipalities = (payload.values || [])
      .filter((item) => item.type === 'K' && /^\d{4}$/.test(item.id))
      .map(({ id, title }) => ({ id, title }))
      .sort((left, right) => left.title.localeCompare(right.title, 'sv-SE'));

    return Response.json(
      { municipalities, source: 'Kolada API v3' },
      { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    );
  } catch {
    return Response.json(
      { error: 'Kommunlistan kunde inte hämtas just nu.' },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    );
  }
}

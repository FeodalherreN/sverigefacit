import { factBySlug, factPath } from '../../../fakta/facts';
import { siteConfig } from '../../../site-config';

type RouteContext = { params: Promise<{ slug: string }> };

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const fact = factBySlug[slug];
  if (!fact) return new Response('Facit hittades inte.', { status: 404 });

  const target = new URL(`${siteConfig.url}${factPath(slug)}`);
  target.searchParams.set('utm_source', 'embed');
  target.searchParams.set('utm_medium', 'referral');
  target.searchParams.set('utm_campaign', 'valet_2026');
  target.searchParams.set('utm_content', slug);

  const html = `<!doctype html>
<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(fact.question)} – Sverigefacit</title><style>
*{box-sizing:border-box}html,body{height:100%;margin:0}body{padding:16px;background:#f4f2eb;color:#102238;font:14px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.card{height:100%;padding:20px;display:flex;flex-direction:column;border:1px solid #d4d5cf;border-left:5px solid ${fact.accent};border-radius:15px;background:#fffdfa;overflow:hidden}.meta{color:#647487;font-size:10px;font-weight:750;letter-spacing:.07em;text-transform:uppercase}h1{margin:10px 0 0;font-size:20px;line-height:1.12;letter-spacing:-.035em}.number{margin-top:auto;padding-top:16px;color:${fact.accent};font:500 42px/.9 Georgia,serif;letter-spacing:-.055em}.label{margin-top:6px;color:#596b7e;font-size:11px}.limit{margin:13px 0 0;color:#665f48;font-size:10px;line-height:1.45}.source{margin-top:14px;padding-top:11px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #dedfd9;color:#667587;font-size:10px}.source a{color:#1d67f2;font-weight:750;text-decoration:none;white-space:nowrap}
</style></head><body><article class="card"><div class="meta">${escapeHtml(fact.topic)} · ${escapeHtml(fact.period)}</div><h1>${escapeHtml(fact.question)}</h1><div class="number">${escapeHtml(fact.value)}</div><div class="label">${escapeHtml(fact.valueLabel)}</div><p class="limit"><strong>Begränsning:</strong> ${escapeHtml(fact.limitation)}</p><footer class="source"><span>Källa: ${escapeHtml(fact.sourceOrganization)}</span><a href="${escapeHtml(target.toString())}" target="_blank" rel="noreferrer">Öppna hela facit ↗</a></footer></article></body></html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Robots-Tag': 'noindex, follow',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors *",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}

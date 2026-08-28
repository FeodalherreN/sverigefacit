const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sverigefacit.se';
const normalizedUrl = configuredUrl.replace(/\/+$/, '');
const canonicalUrl = normalizedUrl === 'https://sverigefacit.se'
  ? 'https://www.sverigefacit.se'
  : normalizedUrl;

export const siteConfig = {
  name: 'Sverigefacit',
  title: 'Sverigefacit – svensk statistik bakom politiken',
  description:
    'Opartiskt underlag för datadriven politik: jämför officiell svensk statistik om brott, migration, trygghet, hälsa, jobb, löner, priser och välfärd.',
  url: canonicalUrl,
  locale: 'sv_SE',
  language: 'sv-SE',
  modified: '2026-08-28',
  sourceChecked: '28 aug 2026',
};

export const topicLinks = [
  { name: 'Valet 2026 i verifierbara siffror', href: '/valet-2026' },
  { name: 'Korta faktasvar med originalkällor', href: '/fakta' },
  { name: 'Svensk statistik och regeringsperioder', href: '/statistik' },
  { name: 'Datastudion – bygg och dela egna diagram', href: '/datastudio' },
  { name: 'Brottslighet i Sverige', href: '/statistik/brottslighet' },
  { name: 'Brott och migrationsbakgrund', href: '/statistik/invandring-och-brott' },
  { name: 'Pension, äldreomsorg och privatekonomi', href: '/statistik/privatekonomi' },
  { name: 'Vallöften och politiskt facit', href: '/politik/valloften' },
];

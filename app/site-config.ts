const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sverigefacit.se';

export const siteConfig = {
  name: 'Sverigefacit',
  title: 'Sverigefacit – svensk statistik bakom politiken',
  description:
    'Jämför svensk statistik om brott, migration, arbetslöshet, pension, elpriser och ekonomi med regeringar, reformer och officiella källor.',
  url: configuredUrl.replace(/\/+$/, ''),
  locale: 'sv_SE',
  language: 'sv-SE',
  modified: '2026-08-27',
  sourceChecked: '27 aug 2026',
};

export const topicLinks = [
  { name: 'Valet 2026 i verifierbara siffror', href: '/valet-2026' },
  { name: 'Korta faktasvar med originalkällor', href: '/fakta' },
  { name: 'Svensk statistik och regeringsperioder', href: '/statistik' },
  { name: 'Brottslighet i Sverige', href: '/statistik/brottslighet' },
  { name: 'Brott och migrationsbakgrund', href: '/statistik/invandring-och-brott' },
  { name: 'Pension, äldreomsorg och privatekonomi', href: '/statistik/privatekonomi' },
  { name: 'Vallöften och politiskt facit', href: '/politik/valloften' },
];

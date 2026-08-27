const fallbackUrl = 'https://sverigefacit.olsson14.chatgpt.site';

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : fallbackUrl);

export const siteConfig = {
  name: 'Sverigefacit',
  title: 'Sverigefacit – svensk statistik bakom politiken',
  description:
    'Jämför svensk statistik om brott, migration, arbetslöshet, pension, elpriser och ekonomi med regeringar, reformer och officiella källor.',
  url: configuredUrl.replace(/\/+$/, ''),
  locale: 'sv_SE',
  language: 'sv-SE',
  modified: '2026-08-27',
};

export const topicLinks = [
  { name: 'Svensk statistik och regeringsperioder', href: '/statistik' },
  { name: 'Brottslighet i Sverige', href: '/statistik/brottslighet' },
  { name: 'Brott och migrationsbakgrund', href: '/statistik/invandring-och-brott' },
  { name: 'Pension, äldreomsorg och privatekonomi', href: '/statistik/privatekonomi' },
  { name: 'Vallöften och politiskt facit', href: '/politik/valloften' },
];

export type SiteNavigationItem = {
  href: string;
  label: string;
  mobileLabel?: string;
  matches: string[];
};

export const primaryNavigation: SiteNavigationItem[] = [
  {
    href: '/valet-2026',
    label: 'Valet 2026',
    mobileLabel: 'Valet',
    matches: ['/valet-2026', '/politik/valloften'],
  },
  {
    href: '/statistik',
    label: 'Ämnen',
    matches: ['/statistik', '/fakta', '/analys'],
  },
  {
    href: '/kommun',
    label: 'Min kommun',
    mobileLabel: 'Kommun',
    matches: ['/kommun'],
  },
  {
    href: '/datastudio',
    label: 'Jämför',
    matches: ['/datastudio'],
  },
];

export function isNavigationItemActive(pathname: string, item: SiteNavigationItem) {
  return item.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

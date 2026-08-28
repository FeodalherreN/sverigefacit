export type SiteNavigationItem = {
  href: string;
  label: string;
  mobileLabel?: string;
  matches: string[];
};

export const primaryNavigation: SiteNavigationItem[] = [
  { href: '/valet-2026', label: 'Valet 2026', mobileLabel: 'Valet', matches: ['/valet-2026'] },
  { href: '/fakta', label: 'Fakta', matches: ['/fakta'] },
  { href: '/statistik', label: 'Statistik', matches: ['/statistik', '/analys'] },
  { href: '/datastudio', label: 'Jämför', matches: ['/datastudio'] },
  { href: '/politik/valloften', label: 'Vallöften', mobileLabel: 'Löften', matches: ['/politik/valloften'] },
];

export function isNavigationItemActive(pathname: string, item: SiteNavigationItem) {
  return item.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

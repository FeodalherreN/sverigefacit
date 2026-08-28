'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavigationItemActive, primaryNavigation } from './site-navigation';

type IconName = 'home' | 'vote' | 'topics' | 'municipality' | 'compare';

const iconNames: IconName[] = ['vote', 'topics', 'municipality', 'compare'];

function NavIcon({ name }: { name: IconName }) {
  if (name === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 10 8-6 8 6v9H8v-6h8v6" /></svg>;
  if (name === 'vote') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5-5 5 5-5 5Z" /><path d="M5 12H3v8h18v-8h-2M8 20v-5h8v5" /></svg>;
  if (name === 'topics') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v4H5zM5 13h6v6H5zM15 13h4v6h-4z" /></svg>;
  if (name === 'municipality') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20V8l6-4 6 4v12M9 10h1M14 10h1M9 14h1M14 14h1" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 17h14M8 4 5 7l3 3M16 14l3 3-3 3" /></svg>;
}

const items = [
  { href: '/', label: 'Hem', icon: 'home' as const, matches: ['/'] },
  ...primaryNavigation.map((item, index) => ({
    ...item,
    label: item.mobileLabel || item.label,
    icon: iconNames[index],
  })),
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobilmeny">
      {items.map((item) => {
        const active = item.href === '/'
          ? pathname === '/'
          : isNavigationItemActive(pathname, item);
        return (
          <Link
            href={item.href}
            key={item.href}
            data-active={active || undefined}
            aria-current={pathname === item.href ? 'page' : active ? 'location' : undefined}
          >
            <NavIcon name={item.icon} />
            <strong>{item.label}</strong>
          </Link>
        );
      })}
    </nav>
  );
}

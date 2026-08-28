'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavigationItemActive, primaryNavigation } from './site-navigation';

const items = [
  { href: '/', label: 'Hem', icon: '⌂', matches: ['/'] },
  ...primaryNavigation.map((item, index) => ({
    ...item,
    label: item.mobileLabel || item.label,
    icon: ['✓', '▤', '▥', '↔', '◫'][index],
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
        return <Link href={item.href} key={item.href} data-active={active || undefined} aria-current={pathname === item.href ? 'page' : undefined}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></Link>;
      })}
    </nav>
  );
}

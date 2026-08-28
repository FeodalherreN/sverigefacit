'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Hem', icon: '⌂' },
  { href: '/valet-2026', label: 'Valet', icon: '✓' },
  { href: '/fakta', label: 'Fakta', icon: '▤' },
  { href: '/datastudio', label: 'Jämför', icon: '↔' },
  { href: '/politik/valloften', label: 'Löften', icon: '◫' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobilmeny">
      {items.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return <Link href={item.href} key={item.href} aria-current={active ? 'page' : undefined}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></Link>;
      })}
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Hem', icon: '⌂', matches: ['/'] },
  { href: '/valet-2026', label: 'Valet', icon: '✓', matches: ['/valet-2026'] },
  { href: '/fakta', label: 'Fakta', icon: '▤', matches: ['/fakta', '/statistik'] },
  { href: '/datastudio', label: 'Jämför', icon: '↔', matches: ['/datastudio', '/analys'] },
  { href: '/politik/valloften', label: 'Vallöften', icon: '◫', matches: ['/politik/valloften'] },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobilmeny">
      {items.map((item) => {
        const active = item.matches.some((prefix) => prefix === '/' ? pathname === '/' : pathname === prefix || pathname.startsWith(`${prefix}/`));
        return <Link href={item.href} key={item.href} aria-current={active ? 'page' : undefined}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></Link>;
      })}
    </nav>
  );
}

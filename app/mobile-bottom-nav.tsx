import Link from 'next/link';

const items = [
  { href: '/', label: 'Hem', icon: '⌂' },
  { href: '/valet-2026', label: 'Valet', icon: '✓' },
  { href: '/fakta', label: 'Fakta', icon: '▤' },
  { href: '/datastudio', label: 'Jämför', icon: '↔' },
  { href: '/politik/valloften', label: 'Löften', icon: '◫' },
];

export function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobilmeny">
      {items.map((item) => <Link href={item.href} key={item.href}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></Link>)}
    </nav>
  );
}

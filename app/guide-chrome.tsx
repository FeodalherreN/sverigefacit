'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavigationItemActive, primaryNavigation } from './site-navigation';

export function GuideHeader() {
  const pathname = usePathname();

  return (
    <header className="guide-header">
      <a className="skip-link" href="#guide-content">Hoppa till huvudinnehållet</a>
      <Link className="brand" href="/" aria-label="Sverigefacit, startsida">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <span>Sverigefacit</span>
        <em>beta</em>
      </Link>
      <nav aria-label="Huvudmeny">
        {primaryNavigation.map((item) => (
          <Link
            href={item.href}
            aria-current={isNavigationItemActive(pathname, item) ? 'page' : undefined}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="guide-home-link" href="/metod" aria-current={pathname === '/metod' ? 'page' : undefined}>Metod <span>↗</span></Link>
    </header>
  );
}

export function GuideFooter() {
  return (
    <footer className="guide-footer">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <div><strong>Sverigefacit</strong><small>Data bakom politiken</small></div>
      </div>
          <p>Svensk offentlig statistik med originalkällor, politisk kontext och förklaringar.</p>
      <div><Link href="/metod">Metod</Link><Link href="/kallor">Källor</Link><a href="/feed.xml">RSS</a><Link href="/integritet">Integritet</Link><Link href="/">Till startsidan ↑</Link></div>
    </footer>
  );
}

import Link from 'next/link';

export type SectionNavigationItem = {
  href: string;
  label: string;
  current?: boolean;
  external?: boolean;
};

export function SectionNavigation({ label, items, className = '' }: {
  label: string;
  items: SectionNavigationItem[];
  className?: string;
}) {
  return (
    <nav className={`section-navigation ${className}`.trim()} aria-label={label}>
      {items.map((item) => item.external ? (
        <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>{item.label}<span aria-hidden="true">↗</span></a>
      ) : (
        <Link href={item.href} aria-current={item.current ? (item.href.includes('#') ? 'location' : 'page') : undefined} key={item.href}>{item.label}</Link>
      ))}
    </nav>
  );
}

import Link from 'next/link';
import { siteConfig } from './site-config';

export type BreadcrumbItem = {
  href: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbs = [{ href: '/', label: 'Start' }, ...items];
  const current = breadcrumbs[breadcrumbs.length - 1];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteConfig.url}${current.href}#breadcrumbs`,
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <nav className="breadcrumbs" aria-label="Brödsmulor">
        <ol>
          {breadcrumbs.map((item, index) => {
            const isCurrent = index === breadcrumbs.length - 1;
            return (
              <li key={item.href}>
                {isCurrent
                  ? <span aria-current="page">{item.label}</span>
                  : <Link href={item.href}>{item.label}</Link>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

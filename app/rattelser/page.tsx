import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '../breadcrumbs';
import { GuideFooter } from '../guide-chrome';

const title = 'Rättelser och ändringslogg';
const description = 'Så rapporterar och publicerar Sverigefacit sakrättelser, dataversioner och ändrade slutsatser.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/rattelser' },
  openGraph: { title, description, url: '/rattelser', images: ['/og.png'] },
};

export default function CorrectionsPage() {
  return (
    <main className="guide-page" id="page-content" tabIndex={-1}>
      <article>
        <header className="info-page-hero">
          <Breadcrumbs items={[
            { href: '/om', label: 'Om Sverigefacit' },
            { href: '/rattelser', label: 'Rättelser' },
          ]} />
          <h1>Rättelser ska synas</h1>
          <p>När en siffra, källa eller formulering ändras ska det gå att se vad som var fel, vad som korrigerades och om slutsatsen påverkades.</p>
        </header>

        <section className="correction-status" aria-labelledby="correction-log-heading">
          <div><p className="section-kicker">Publicerad logg</p><h2 id="correction-log-heading">Inga registrerade sakrättelser ännu</h2></div>
          <p>Versionshistoriken innehåller löpande innehålls- och designändringar, men ingen separat sakrättelse har hittills publicerats i den här loggen.</p>
        </section>

        <section className="source-principles">
          <div><h2>Så hanteras ett rapporterat fel</h2></div>
          <ul>
            <li><strong>1. Avgränsa felet.</strong><span>Berörd sida, uppgift, period och originalkälla identifieras.</span></li>
            <li><strong>2. Kontrollera originalet.</strong><span>Myndighetens senaste tabell, rapport och eventuella revisionsnot kontrolleras.</span></li>
            <li><strong>3. Rätta och dokumentera.</strong><span>Datum, gammal uppgift, ny uppgift och påverkan på slutsatsen läggs i denna logg.</span></li>
            <li><strong>4. Behåll spårbarheten.</strong><span>Den tekniska ändringen sparas i projektets öppna versionshistorik.</span></li>
          </ul>
        </section>

        <section className="correction-report">
          <div><p className="section-kicker">Hittat ett fel?</p><h2>Skicka sida, uppgift och originalkälla</h2></div>
          <p>Det går just nu att rapportera fel genom projektets öppna formulär. En kontaktväg utan krav på GitHub-konto behöver fortfarande läggas till.</p>
          <a href="https://github.com/FeodalherreN/sverigefacit/issues/new" target="_blank" rel="noreferrer">Rapportera ett fel ↗</a>
        </section>

        <nav className="correction-links" aria-label="Relaterad transparens">
          <Link href="/om">Om avsändaren →</Link>
          <Link href="/metod">Metod →</Link>
          <Link href="/kallor">Källor →</Link>
        </nav>
      </article>
      <GuideFooter />
    </main>
  );
}

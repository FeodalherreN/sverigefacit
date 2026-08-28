import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '../breadcrumbs';
import { GuideFooter } from '../guide-chrome';

const title = 'Om Sverigefacit – avsändare, urval och ansvar';
const description = 'Vad Sverigefacit är, hur innehåll väljs, vem som ansvarar för bearbetningen och vilka transparensuppgifter som ännu saknas.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/om' },
  openGraph: { title, description, url: '/om', images: ['/og.png'] },
};

export default function AboutPage() {
  return (
    <main className="guide-page" id="page-content" tabIndex={-1}>
      <article>
        <header className="info-page-hero">
          <Breadcrumbs items={[{ href: '/om', label: 'Om Sverigefacit' }]} />
          <h1>Offentlig statistik, förklarad utan partibetyg</h1>
          <p>Sverigefacit är ett fristående projekt som gör svensk myndighetsdata lättare att hitta och tolka. Sajten är inte en myndighet, ett parti eller ett opinionsinstitut.</p>
        </header>

        <section className="about-principles" aria-label="Sverigefacits uppdrag">
          <article><span>01</span><h2>Resultatet först</h2><p>Besökaren ska få nyckeltalet, perioden och jämförelsen innan den längre förklaringen.</p></article>
          <article><span>02</span><h2>Originalet bredvid</h2><p>Varje påstående ska gå att följa tillbaka till myndighetens tabell, rapport eller öppna data.</p></article>
          <article><span>03</span><h2>Ingen låtsad kausalitet</h2><p>Utfall, möjlig politisk påverkan och belagd samhällseffekt hålls isär.</p></article>
        </section>

        <div className="info-page-layout">
          <div className="info-main-copy">
            <section>
              <p className="section-kicker">Redaktionellt ansvar</p>
              <h2>Vad Sverigefacit ansvarar för</h2>
              <p>Sverigefacit ansvarar för urvalet av frågor, beräkningar, diagram, rubriker och förklaringar. Den publicerande myndigheten ansvarar för grunduppgifterna. Om en myndighet reviderar sin serie ska Sverigefacit uppdatera den versionsatta kopian och visa vad som ändrats.</p>
            </section>
            <section className="info-section">
              <p className="section-kicker">Urval</p>
              <h2>Innehållet är relevant – men inte fullständigt</h2>
              <p>Ämnen prioriteras när de är centrala i samhällsdebatten, kan beskrivas med kontrollerbar offentlig data och går att förklara utan att dölja viktiga metodproblem. Frånvaro på sajten betyder därför inte att en fråga är oviktig.</p>
            </section>
            <section className="info-section transparency-warning">
              <p className="section-kicker">Öppen transparenspunkt</p>
              <h2>Ägar- och kontaktuppgifter behöver kompletteras</h2>
              <p>Projektet är fortfarande märkt beta. Namn på ansvarig person eller juridisk aktör, direkt kontaktväg och uppgift om eventuell extern finansiering är ännu inte publicerade. Det är en förtroendebrist och redovisas öppet här i stället för att döljas eller fyllas med antaganden.</p>
              <p>När uppgifterna läggs till ska även annonser, sponsring och eventuella politiska eller organisatoriska kopplingar redovisas på denna sida.</p>
            </section>
          </div>
          <aside className="info-side-panel">
            <span>Kontrollera arbetet</span>
            <Link href="/metod">Metod och slutsatser <i aria-hidden="true">→</i></Link>
            <Link href="/kallor">Källor och data <i aria-hidden="true">→</i></Link>
            <Link href="/rattelser">Rättelser och ändringar <i aria-hidden="true">→</i></Link>
            <Link href="/integritet">Integritet <i aria-hidden="true">→</i></Link>
          </aside>
        </div>
      </article>
      <GuideFooter />
    </main>
  );
}

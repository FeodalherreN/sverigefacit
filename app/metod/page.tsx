import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideFooter, GuideHeader } from '../guide-chrome';

const title = 'Metod – så bedömer Sverigefacit politiska samband';
const description = 'Läs hur Sverigefacit skiljer observerad statistik, möjlig påverkan från politiska beslut och kausalt belagda effekter.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/metod' },
  openGraph: { title, description, url: '/metod', images: ['/og.png'] },
};

export default function MethodPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <article>
        <header className="info-page-hero">
          <nav className="breadcrumbs" aria-label="Brödsmulor"><Link href="/">Start</Link><span>/</span><strong>Metod</strong></nav>
          <h1>Så skiljer vi samband från orsak</h1>
          <p>Att två kurvor rör sig samtidigt är en observation. Att en reform orsakade förändringen är en mycket starkare utsaga. Vi använder ordet satslogik för den enkla kontrollen att premisserna faktiskt räcker till slutsatsen.</p>
        </header>

        <section className="method-page-steps" aria-label="Tre led i evidensbedömningen">
          <article><span>01</span><strong>Observerat utfall</strong><p>En verifierbar förändring i offentlig statistik, med definition, tidsperiod, enhet och direktlänk till originalkällan.</p><i>Hög säkerhet för det definierade måttet</i></article>
          <article><span>02</span><strong>Möjlig påverkan från beslut</strong><p>Beslutet föregår utfallet, mekanismen är trovärdig och alternativa förklaringar har identifierats.</p><i>Rimlig förklaring, men inte bevisad effekt</i></article>
          <article><span>03</span><strong>Kausalt belagd effekt</strong><p>En trovärdig kontrollgrupp, naturligt experiment eller robust effektstudie visar vad som sannolikt hänt utan insatsen.</p><i>Kräver starkare underlag</i></article>
        </section>

        <div className="info-page-layout">
          <div className="info-main-copy">
            <section>
              <p className="section-kicker">Kausal kontroll</p>
              <h2>Fem frågor före varje slutsats</h2>
              <ol className="method-question-list">
                <li><span>01</span><div><strong>Kom orsaken före utfallet?</strong><p>En reform kan inte förklara en förändring som började innan reformen genomfördes.</p></div></li>
                <li><span>02</span><div><strong>Finns en trovärdig mekanism?</strong><p>Det ska gå att beskriva hur beslutet rimligen påverkar det aktuella måttet.</p></div></li>
                <li><span>03</span><div><strong>Är storleken rimlig?</strong><p>En liten åtgärd bör inte utan särskilt stöd tillskrivas en mycket stor samhällsförändring.</p></div></li>
                <li><span>04</span><div><strong>Vad hände i en jämförbar grupp?</strong><p>Andra länder, kommuner, grupper eller tidpunkter kan ge en kontrafaktisk jämförelse.</p></div></li>
                <li><span>05</span><div><strong>Tål resultatet andra antaganden?</strong><p>Periodval, definitioner, eftersläpning och extremår ska inte ensamma bära slutsatsen.</p></div></li>
              </ol>
            </section>

            <section className="info-section">
              <p className="section-kicker">Korrelation</p>
              <h2>Vad Pearson och Spearman säger</h2>
              <div className="method-comparison">
                <article><strong>Pearson r</strong><p>Mäter styrkan i ett linjärt samband mellan två serier. Gemensamma långsiktiga trender kan skapa höga värden utan kausal koppling.</p></article>
                <article><strong>Spearman ρ</strong><p>Mäter om rangordningen rör sig åt samma håll. Det är mindre känsligt för vissa uteliggare men kontrollerar inte tredje faktorer.</p></article>
              </div>
              <p className="method-callout"><strong>Viktigast:</strong> Ett korrelationsmått beskriver samvariation i det valda intervallet. Det avgör inte riktning, mekanism eller orsak.</p>
              <p className="method-callout"><strong>Evidensetiketterna:</strong> Kvalitativa metodbedömningar — inte sannolikheter eller automatiskt beräknade poäng. En kausalt belagd effekt kräver en trovärdig kontrafaktisk jämförelse.</p>
            </section>

            <section className="info-section">
              <p className="section-kicker">Transparens</p>
              <h2>Så hålls granskningen spårbar</h2>
              <ul className="transparency-list">
                <li>Originalkälla, definition och period visas intill varje mått.</li>
                <li>Regeringsperioder och världshändelser visas som kontext, inte automatiska orsaker.</li>
                <li>Vallöften delas upp i formulering, beslut, genomförande och samhällseffekt.</li>
                <li>Historiska kohorter märks som historiska och kombineras inte med nya nämnare.</li>
                <li>Kontrolldatum visas intill underlaget. Om myndigheten senare reviderar serien gäller originalkällan tills Sverigefacit har uppdaterats.</li>
              </ul>
            </section>
          </div>

          <aside className="info-side-panel">
            <span>Snabbvägar</span>
            <Link href="/statistik">Alla statistikområden <i>↗</i></Link>
            <Link href="/politik/valloften">Metod för vallöften <i>↗</i></Link>
            <Link href="/kallor">Myndigheter och källor <i>↗</i></Link>
            <Link href="/datastudio">Testa en korrelation <i>↗</i></Link>
          </aside>
        </div>
      </article>
      <GuideFooter />
    </main>
  );
}

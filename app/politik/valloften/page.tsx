import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '../../breadcrumbs';
import { GuideFooter, GuideHeader } from '../../guide-chrome';

const title = 'Vallöften i Sverige – uppfyllda eller inte?';
const description = 'Följ svenska vallöften från formulering till beslut, genomförande och effekt. Belagda utfall med källor, utan missvisande totalbetyg.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/politik/valloften' },
  openGraph: { title, description, url: '/politik/valloften', images: ['/og.png'] },
};

const promises = [
  { year: '2014–20', owner: 'Socialdemokraterna / regeringen', title: 'EU:s lägsta arbetslöshet 2020', verdict: 'Inte uppfyllt', detail: 'Sverige låg på 8,5 procent och Tjeckien på 2,6 procent i jämförbar EU-statistik.', source: 'https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table?lang=en' },
  { year: '2016–24', owner: 'S/MP-regeringen', title: '10 000 fler polisanställda', verdict: 'Bemanningsmåttet uppfyllt', detail: 'Antalet anställda ökade med 11 426; 3 942 var poliser och 7 484 civilanställda.', source: 'https://bra.se/rapporter/arkiv/2026-03-25-utvardering-av-satsningen-pa-10-000-fler-polisanstallda' },
  { year: '2019–22', owner: 'Januariavtalet', title: 'Fast omsorgskontakt i hemtjänsten', verdict: 'Beslut helt · genomförande delvis', detail: 'Lagen trädde i kraft 1 juli 2022, men uppföljningen visar ojämn implementering.', source: 'https://www.socialstyrelsen.se/globalassets/sharepoint-dokument/artikelkatalog/ovrigt/2025-2-9459.pdf' },
  { year: '2019–22', owner: 'Januariavtalet', title: 'Språk- och samhällskunskapskrav', verdict: 'Inte infört under mandatperioden', detail: 'En statlig utredning presenterades, men kravet infördes inte före periodens slut.', source: 'https://www.regeringen.se/rattsliga-dokument/statens-offentliga-utredningar/2021/01/sou-20212/' },
  { year: '2022–25', owner: 'Tidöavtalet', title: 'Inför anonyma vittnen', verdict: 'Lagstiftningslöftet uppfyllt', detail: 'Lagen trädde i kraft 1 januari 2025. Samhällseffekten är ännu inte visad.', source: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-20241180-om-anonyma-vittnen-i-brottmal_sfs-2024-1180/' },
  { year: '2022–23', owner: 'M/KD/SD/L', title: 'Elstöd senast 1 november 2022', verdict: 'Försenat · delvis uppfyllt', detail: 'Utbetalningarna började 20 februari 2023, efter den uttryckliga tidsfristen.', source: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/granskningsbetankande_ha01ku20/html/' },
];

export default function PromisesPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <article>
        <header className="info-page-hero">
          <Breadcrumbs items={[
            { href: '/valet-2026', label: 'Valet 2026' },
            { href: '/politik/valloften', label: 'Vallöften' },
          ]} />
          <h1>Så följs vallöften upp</h1>
          <p>Ett löfte kan leda till ett beslut utan att vara fullt genomfört. En genomförd reform kan samtidigt sakna belagd samhällseffekt. Därför bedöms varje led separat.</p>
        </header>

        <section className="promise-benchmark">
          <div><span>Historisk forskningsjämförelse</span><strong>78 %</strong><p>218 av 279 löften i Alliansens gemensamma valmanifest 2010 bedömdes helt uppfyllda.</p></div>
          <p>Det är en historisk jämförelse, inte ett aktuellt regeringsbetyg. En ny total procentsats kräver ett komplett urval med urvalsregler fastställda i förväg.</p>
          <a href="https://academic.oup.com/pa/article/73/3/477/5368143" target="_blank" rel="noreferrer">Läs forskningsstudien ↗</a>
        </section>

        <section className="promise-guide-list" aria-labelledby="promise-list-heading">
          <div className="promise-guide-heading"><p className="section-kicker">Urvalet på den här sidan</p><h2 id="promise-list-heading">Sex löften, bedömda var för sig</h2></div>
          <div>
            {promises.map((promise, index) => (
              <article key={promise.title}>
                <span>{String(index + 1).padStart(2, '0')} · {promise.year}</span>
                <div><small>{promise.owner}</small><h3>{promise.title}</h3><p>{promise.detail}</p></div>
                <div className="promise-guide-verdict"><strong>{promise.verdict}</strong><a href={promise.source} target="_blank" rel="noreferrer">Källa ↗</a></div>
              </article>
            ))}
          </div>
        </section>

        <section className="promise-method-note">
          <div><h2>Varför visar vi ingen totalprocent?</h2></div>
          <p>Manifest, regeringsavtal och senare regeringsmål är olika dokument. En rättvis procentsats måste avgränsas per parti, dokument och mandatperiod, och bara innehålla bedömbara löften vars tidsfrist passerat.</p>
          <Link href="/metod">Läs hela metoden <span>↗</span></Link>
        </section>
      </article>
      <GuideFooter />
    </main>
  );
}

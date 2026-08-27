import type { Metadata } from 'next';
import { GuideFooter, GuideHeader } from '../guide-chrome';

export const metadata: Metadata = {
  title: 'Integritet och statistikcookies',
  description: 'Så använder Sverigefacit lokal lagring och Google Analytics.',
  alternates: { canonical: '/integritet' },
};

export default function PrivacyPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <article className="privacy-page">
        <p className="section-kicker">Transparens</p>
        <h1>Integritet och cookies</h1>
        <p>Sverigefacit ska gå att använda utan att acceptera statistikcookies.</p>
        <section><h2>Nödvändig lokal lagring</h2><p>Vi sparar ditt val om statistikcookies i webbläsarens lokala lagring. Det behövs för att komma ihåg om du tackat ja eller nej.</p></section>
        <section><h2>Google Analytics</h2><p>Om du aktivt godkänner statistik laddas Google Analytics med mät-id G-V1G0VLNPB3. Det hjälper oss förstå vilka sidor och funktioner som används. Skriptet laddas inte innan samtycke.</p></section>
        <section><h2>Ändra ditt val</h2><p>Knappen ”Cookie-inställningar” finns på alla sidor. Där kan du när som helst göra ett nytt val. Att tacka nej påverkar inte sajtens innehåll eller funktioner.</p></section>
        <section><h2>Delning</h2><p>När du trycker på Dela används telefonens eller webbläsarens delningsfunktion. Sverigefacit får inte veta vilken person eller app du delar länken med.</p></section>
      </article>
      <GuideFooter />
    </main>
  );
}

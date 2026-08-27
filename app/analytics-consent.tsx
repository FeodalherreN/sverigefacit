'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const analyticsId = 'G-V1G0VLNPB3';
const storageKey = 'sverigefacit-analytics-consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadAnalytics() {
  if (document.getElementById('sverigefacit-gtag')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag('js', new Date());
  window.gtag('config', analyticsId, { anonymize_ip: true });
  const script = document.createElement('script');
  script.id = 'sverigefacit-gtag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  document.head.appendChild(script);
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<'accepted' | 'declined' | null | undefined>(undefined);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    const next = stored === 'accepted' || stored === 'declined' ? stored : null;
    // Valet finns bara i webbläsarens lagring och kan därför läsas först efter montering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(next);
    if (next === 'accepted') loadAnalytics();
  }, []);

  const choose = (next: 'accepted' | 'declined') => {
    window.localStorage.setItem(storageKey, next);
    setChoice(next);
    if (next === 'accepted') loadAnalytics();
  };

  if (choice === undefined) return null;

  return (
    <>
      {choice === null && (
        <section className="consent-banner" aria-labelledby="consent-heading">
          <div><strong id="consent-heading">Hjälp oss förstå vad som används</strong><p>Vi använder Google Analytics först om du godkänner statistikcookies. Sajten fungerar lika bra om du tackar nej. <Link href="/integritet">Läs om integritet</Link>.</p></div>
          <div><button type="button" onClick={() => choose('declined')}>Endast nödvändiga</button><button type="button" onClick={() => choose('accepted')}>Godkänn statistik</button></div>
        </section>
      )}
      {choice !== null && <button className="consent-manage" type="button" onClick={() => setChoice(null)}>Cookie-inställningar</button>}
    </>
  );
}

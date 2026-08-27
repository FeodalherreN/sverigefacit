'use client';

import { useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ShareButton({ title, text, itemId }: { title: string; text: string; itemId: string }) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle');

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setStatus('shared');
        window.gtag?.('event', 'share', { method: 'web_share', content_type: 'fact', item_id: itemId });
      } else {
        await navigator.clipboard.writeText(url);
        setStatus('copied');
        window.gtag?.('event', 'share', { method: 'copy_link', content_type: 'fact', item_id: itemId });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setStatus('copied');
      } catch {
        setStatus('failed');
      }
    }
  };

  const label = status === 'shared'
    ? 'Delat ✓'
    : status === 'copied'
      ? 'Länk kopierad ✓'
      : status === 'failed'
        ? 'Kunde inte dela'
        : 'Dela facit';

  return <button className="share-fact-button" type="button" onClick={share} aria-live="polite">{label}<span aria-hidden="true">↗</span></button>;
}

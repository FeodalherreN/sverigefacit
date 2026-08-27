'use client';

import { useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ShareButton({ title, text, itemId, url }: { title: string; text: string; itemId: string; url: string }) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle');

  const share = async () => {
    const trackedUrl = new URL(url);
    trackedUrl.searchParams.set('utm_source', 'delning');
    trackedUrl.searchParams.set('utm_medium', 'referral');
    trackedUrl.searchParams.set('utm_campaign', 'valet_2026');
    trackedUrl.searchParams.set('utm_content', itemId);
    const shareUrl = trackedUrl.toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        setStatus('shared');
        window.gtag?.('event', 'share', { method: 'web_share', content_type: 'fact', item_id: itemId });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setStatus('copied');
        window.gtag?.('event', 'share', { method: 'copy_link', content_type: 'fact', item_id: itemId });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(shareUrl);
        setStatus('copied');
        window.gtag?.('event', 'share', { method: 'copy_fallback', content_type: 'fact', item_id: itemId });
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

'use client';

import { track } from '@vercel/analytics';
import { useState } from 'react';

export function EmbedButton({ embedUrl, title, itemId }: { embedUrl: string; title: string; itemId: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copyEmbed = async () => {
    const code = `<iframe src="${embedUrl}" title="${title.replaceAll('"', '&quot;')} – Sverigefacit" loading="lazy" sandbox="allow-popups allow-popups-to-escape-sandbox" style="width:100%;max-width:640px;height:330px;border:0;border-radius:16px" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
      track('share', { method: 'embed_code', content_type: 'fact', item_id: itemId });
    } catch {
      setStatus('failed');
    }
  };

  const label = status === 'copied' ? 'Kod kopierad ✓' : status === 'failed' ? 'Kunde inte kopiera' : 'Bädda in facit';
  return <button className="embed-fact-button" type="button" onClick={copyEmbed} aria-live="polite">{label}<span aria-hidden="true">&lt;/&gt;</span></button>;
}

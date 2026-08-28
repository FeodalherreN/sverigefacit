'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isNavigationItemActive, primaryNavigation } from './site-navigation';
import type { SiteSearchEntry } from './site-search-data';

const normalize = (value: string) => value
  .toLocaleLowerCase('sv-SE')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9åäö]+/g, ' ')
  .trim();

const scoreEntry = (entry: SiteSearchEntry, query: string) => {
  const title = normalize(entry.title);
  const subtitle = normalize(entry.subtitle);
  const haystack = `${title} ${subtitle} ${normalize(entry.keywords)}`;
  const words = query.split(/\s+/).filter(Boolean);
  if (!words.every((word) => haystack.includes(word))) return -1;
  let score = entry.priority;
  if (title === query) score += 100;
  else if (title.startsWith(query)) score += 60;
  else if (title.includes(query)) score += 35;
  if (subtitle.includes(query)) score += 15;
  return score;
};

export function SiteHeader({ entries }: { entries: SiteSearchEntry[] }) {
  const pathname = usePathname();
  const aboutActive = ['/om', '/metod', '/kallor', '/rattelser', '/integritet'].includes(pathname);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return [...entries].sort((a, b) => b.priority - a.priority).slice(0, 8);
    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .filter((result) => result.score >= 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'sv-SE'))
      .slice(0, 10)
      .map((result) => result.entry);
  }, [entries, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (dialog.open) {
      dialog.close();
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  const closeSearch = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <a className="skip-link" href="#page-content">Hoppa till huvudinnehållet</a>
      <header className="global-header">
        <Link className="brand" href="/" aria-label="Sverigefacit, startsida">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span>Sverigefacit</span>
          <em>beta</em>
        </Link>
        <nav className="global-primary-nav" aria-label="Huvudmeny">
          {primaryNavigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : isNavigationItemActive(pathname, item);
            return (
              <Link
                href={item.href}
                key={item.href}
                data-active={active || undefined}
                aria-current={pathname === item.href ? 'page' : active ? 'location' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="global-header-actions">
          <Link className="about-link" href="/om" aria-current={pathname === '/om' ? 'page' : aboutActive ? 'location' : undefined}>Om</Link>
          <button ref={triggerRef} className="global-search-button" type="button" onClick={() => setOpen(true)} aria-label="Sök på hela Sverigefacit">
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
            <span>Sök</span><kbd>⌘ K</kbd>
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        className="search-overlay"
        aria-labelledby="global-search-title"
        onCancel={(event) => { event.preventDefault(); closeSearch(); }}
        onClose={() => { if (open) setOpen(false); triggerRef.current?.focus(); }}
        onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch(); }}
      >
        <section className="search-dialog">
          <h2 className="sr-only" id="global-search-title">Sök på hela Sverigefacit</h2>
          <div className="search-input-wrap">
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
            <label className="sr-only" htmlFor="global-site-search">Sök fråga, ämne, mått eller källa</label>
            <input
              ref={inputRef}
              id="global-site-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök t.ex. vårdgaranti, födelseland eller matpriser…"
              autoComplete="off"
            />
            <button type="button" onClick={closeSearch} aria-label="Stäng sökningen">Esc</button>
          </div>
          <div className="search-results">
            <p aria-live="polite">{query ? `${results.length} sökresultat` : 'Vanliga ingångar'}</p>
            {results.length ? results.map((result) => (
              <Link href={result.href} key={`${result.type}-${result.href}`} onClick={closeSearch}>
                <span>{result.type}</span>
                <div><strong>{result.title}</strong><small>{result.subtitle}</small></div>
                <i aria-hidden="true">→</i>
              </Link>
            )) : (
              <div className="empty-search">
                <strong>Inga träffar</strong>
                <span>Prova ett ämne, en myndighet eller ett bredare ord.</span>
              </div>
            )}
          </div>
        </section>
      </dialog>
    </>
  );
}

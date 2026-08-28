import Link from 'next/link';

type Level = 'fact' | 'overview' | 'explore';

const levels: Array<{ id: Level; href: string; label: string }> = [
  { id: 'fact', href: '/fakta/migration-och-brott', label: 'Kort svar' },
  { id: 'overview', href: '/statistik/invandring-och-brott', label: 'Ämnesöversikt' },
  { id: 'explore', href: '/analys/brott-och-migration#brott-ursprung', label: 'Utforska data' },
];

export function CrimeMigrationLevels({ current }: { current: Level }) {
  return (
    <nav className="analysis-levels" aria-label="Fördjupningsnivå">
      {levels.map((level) => level.id === current
        ? <span aria-current="page" key={level.id}>{level.label}</span>
        : <Link href={level.href} key={level.id}>{level.label}</Link>)}
    </nav>
  );
}

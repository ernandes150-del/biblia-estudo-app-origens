import { useEffect, useState } from "react";
import { loadOccurrences, type Occurrence } from "../lib/occurrences";
import { getCuratedEntry } from "../lib/curatedDictionary";

type WordNotesViewProps = {
  wordNotes: Record<string, string>;
  navigateToVerse: (book: string, chapter: number, verse: number) => void;
};

function WordNoteRow({
  strong,
  note,
  navigateToVerse,
}: {
  strong: string;
  note: string;
  navigateToVerse: (book: string, chapter: number, verse: number) => void;
}) {
  const [firstOccurrence, setFirstOccurrence] = useState<Occurrence | null | undefined>(undefined);
  const curated = getCuratedEntry(strong);

  useEffect(() => {
    let cancelled = false;
    loadOccurrences(strong).then((list) => {
      if (!cancelled) setFirstOccurrence(list && list.length > 0 ? list[0] : null);
    });
    return () => {
      cancelled = true;
    };
  }, [strong]);

  return (
    <div className="p-4 bg-[var(--bg-elevated)]/60 border border-[var(--border)] rounded-xl">
      <div className="flex items-center justify-between mb-2 gap-3">
        <span className="font-serif font-bold text-sm text-[var(--text)]">
          {strong}
          {curated && <span className="text-[var(--accent)] font-normal ml-2 text-xs">({curated.gloss})</span>}
        </span>
        {firstOccurrence && (
          <button
            onClick={() => navigateToVerse(firstOccurrence.b, firstOccurrence.c, firstOccurrence.v)}
            className="text-[10px] bg-[var(--accent)] text-white px-2 py-0.5 rounded font-medium shrink-0"
          >
            Ver 1ª ocorrência
          </button>
        )}
      </div>
      <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border)]">
        {note}
      </p>
    </div>
  );
}

export default function WordNotesView({ wordNotes, navigateToVerse }: WordNotesViewProps) {
  const entries = Object.entries(wordNotes).filter(([, note]) => note.trim() !== "");

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[var(--text)] border-b border-[var(--border)] pb-3">
          Minhas Notas de Palavras
        </h2>
        <p className="text-xs text-[var(--text-muted)] -mt-3">
          Anotações feitas na palavra original (hebraico/grego), não em um versículo específico.
        </p>

        {entries.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">Você ainda não anotou nenhuma palavra original.</p>
        ) : (
          <div className="grid gap-3">
            {entries.map(([strong, note]) => (
              <WordNoteRow key={strong} strong={strong} note={note} navigateToVerse={navigateToVerse} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

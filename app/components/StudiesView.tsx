import type { SavedStudy } from "../types";
import { studyBlocksToPlainText, parseStudyBlocks } from "../lib/studyBlocks";

type StudiesViewProps = {
  savedStudiesList: SavedStudy[];
  navigateToVerse: (book: string, chapter: number, verse: number, openStudy?: boolean) => void;
};

export default function StudiesView({ savedStudiesList, navigateToVerse }: StudiesViewProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[var(--text)] border-b border-[var(--border)] pb-3">
          Caderno Pessoal de Estudos
        </h2>

        {savedStudiesList.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">Você ainda não salvou nenhuma anotação em versículos.</p>
        ) : (
          <div className="grid gap-4">
            {savedStudiesList.map((st) => (
              <div
                key={st.key}
                onClick={() => navigateToVerse(st.book, st.chapter, st.verse, true)}
                className="p-4 bg-[var(--bg-elevated)]/60 border border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent)]/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm text-[var(--text)]">
                    {st.book} {st.chapter}:{st.verse}
                  </span>
                  <span className="text-[10px] bg-[var(--accent)] text-white px-2 py-0.5 rounded font-medium">
                    Ver no texto
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] italic mb-2">&ldquo;{st.verseText}&rdquo;</p>
                <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border)]">
                  {studyBlocksToPlainText(parseStudyBlocks(st.study))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

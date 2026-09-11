import type { SavedStudy } from "../types";

type StudiesViewProps = {
  savedStudiesList: SavedStudy[];
  navigateToVerse: (book: string, chapter: number, verse: number, openStudy?: boolean) => void;
};

export default function StudiesView({ savedStudiesList, navigateToVerse }: StudiesViewProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#F5F5F7] border-b border-[#2C2C2E] pb-3">
          Caderno Pessoal de Estudos
        </h2>

        {savedStudiesList.length === 0 ? (
          <p className="text-xs text-[#8E8E93]">Você ainda não salvou nenhuma anotação em versículos.</p>
        ) : (
          <div className="grid gap-4">
            {savedStudiesList.map((st) => (
              <div
                key={st.key}
                onClick={() => navigateToVerse(st.book, st.chapter, st.verse, true)}
                className="p-4 bg-[#1C1C1E]/60 border border-[#2C2C2E] rounded-xl cursor-pointer hover:border-[#0A84FF]/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm text-[#F5F5F7]">
                    {st.book} {st.chapter}:{st.verse}
                  </span>
                  <span className="text-[10px] bg-[#0A84FF] text-white px-2 py-0.5 rounded font-medium">
                    Ver no texto
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] italic mb-2">&ldquo;{st.verseText}&rdquo;</p>
                <p className="text-xs text-[#D1D1D6] bg-[#1C1C1E] p-3 rounded-lg border border-[#2C2C2E]">
                  {st.study}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

import type { SavedStudy } from "../types";

type StudiesViewProps = {
  savedStudiesList: SavedStudy[];
  navigateToVerse: (book: string, chapter: number, verse: number, openStudy?: boolean) => void;
};

export default function StudiesView({ savedStudiesList, navigateToVerse }: StudiesViewProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#2D3B32] border-b border-[#E2E0D5] pb-3">
          Caderno Pessoal de Estudos
        </h2>

        {savedStudiesList.length === 0 ? (
          <p className="text-xs text-[#526356]">Você ainda não salvou nenhuma anotação em versículos.</p>
        ) : (
          <div className="grid gap-4">
            {savedStudiesList.map((st) => (
              <div
                key={st.key}
                onClick={() => navigateToVerse(st.book, st.chapter, st.verse, true)}
                className="p-4 bg-[#EAE8DD]/60 border border-[#D8D5C5] rounded-xl cursor-pointer hover:border-[#2D3B32] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm text-[#2D3B32]">
                    {st.book} {st.chapter}:{st.verse}
                  </span>
                  <span className="text-[10px] bg-[#2D3B32] text-[#F6F5F0] px-2 py-0.5 rounded font-medium">
                    Ver no texto
                  </span>
                </div>
                <p className="text-xs text-[#526356] italic mb-2">&ldquo;{st.verseText}&rdquo;</p>
                <p className="text-xs text-[#1F2923] bg-[#F6F5F0] p-3 rounded-lg border border-[#D8D5C5]">
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

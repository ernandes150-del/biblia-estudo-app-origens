import type { UserData, BibleData, HighlightColor } from "../types";

type HighlightsViewProps = {
  userData: UserData;
  bibleData: BibleData;
  navigateToVerse: (book: string, chapter: number, verse: number) => void;
};

const COLOR_LABEL: Record<HighlightColor, string> = {
  yellow: "Amarelo",
  green: "Verde",
  red: "Vermelho",
  blue: "Azul",
};

const COLOR_DOT: Record<HighlightColor, string> = {
  yellow: "#E0B94D",
  green: "#2F6B45",
  red: "#8A2F2A",
  blue: "#2A6B8A",
};

export default function HighlightsView({ userData, bibleData, navigateToVerse }: HighlightsViewProps) {
  const highlighted = Object.entries(userData)
    .filter(([, v]) => v.highlightColor)
    .map(([key, v]) => {
      const [book, chapter, verse] = key.split("-");
      return {
        key,
        book,
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        color: v.highlightColor as HighlightColor,
        verseText: bibleData.books[book]?.chapterData[chapter]?.[verse] || "",
      };
    });

  const groups: Record<HighlightColor, typeof highlighted> = { yellow: [], green: [], red: [], blue: [] };
  for (const h of highlighted) groups[h.color].push(h);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[var(--text)] border-b border-[var(--border)] pb-3">
          Passagens Destacadas
        </h2>

        {highlighted.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">Você ainda não destacou nenhum versículo.</p>
        ) : (
          (Object.keys(groups) as HighlightColor[])
            .filter((color) => groups[color].length > 0)
            .map((color) => (
              <div key={color} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_DOT[color] }} />
                  <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
                    {COLOR_LABEL[color]} ({groups[color].length})
                  </h3>
                </div>
                <div className="grid gap-3">
                  {groups[color].map((h) => (
                    <div
                      key={h.key}
                      onClick={() => navigateToVerse(h.book, h.chapter, h.verse)}
                      className="p-4 bg-[var(--bg-elevated)]/60 border border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent)]/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-sm text-[var(--text)]">
                          {h.book} {h.chapter}:{h.verse}
                        </span>
                        <span className="text-[10px] bg-[var(--accent)] text-white px-2 py-0.5 rounded font-medium">
                          Ver no texto
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] italic">&ldquo;{h.verseText}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </main>
  );
}

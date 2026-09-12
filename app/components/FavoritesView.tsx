import type { UserData, BibleData } from "../types";

type FavoritesViewProps = {
  userData: UserData;
  bibleData: BibleData;
  navigateToVerse: (book: string, chapter: number, verse: number) => void;
};

export default function FavoritesView({ userData, bibleData, navigateToVerse }: FavoritesViewProps) {
  const favorites = Object.entries(userData)
    .filter(([, v]) => v.favorite)
    .map(([key]) => {
      const [book, chapter, verse] = key.split("-");
      return {
        key,
        book,
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        verseText: bibleData.books[book]?.chapterData[chapter]?.[verse] || "",
      };
    });

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[var(--text)] border-b border-[var(--border)] pb-3">
          Versículos Favoritos
        </h2>

        {favorites.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">Você ainda não favoritou nenhum versículo.</p>
        ) : (
          <div className="grid gap-3">
            {favorites.map((f) => (
              <div
                key={f.key}
                onClick={() => navigateToVerse(f.book, f.chapter, f.verse)}
                className="p-4 bg-[var(--bg-elevated)]/60 border border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent)]/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm text-[var(--text)]">
                    {f.book} {f.chapter}:{f.verse}
                  </span>
                  <span className="text-[10px] bg-[var(--accent)] text-white px-2 py-0.5 rounded font-medium">
                    Ver no texto
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] italic">&ldquo;{f.verseText}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

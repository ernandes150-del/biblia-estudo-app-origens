import type { SearchResult } from "../types";

type SearchViewProps = {
  searchTerm: string;
  handleSearch: (term: string) => void;
  searchResults: SearchResult[];
  navigateToVerse: (book: string, chapter: number, verse: number, openStudy?: boolean) => void;
};

export default function SearchView({ searchTerm, handleSearch, searchResults, navigateToVerse }: SearchViewProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[var(--text)] border-b border-[var(--border)] pb-3">
          Pesquisa no Texto Bíblico
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Digite uma palavra ou termo (ex: 'princípio', 'amor')..."
            className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="space-y-3">
          {searchResults.map((res, i) => (
            <div
              key={i}
              onClick={() => navigateToVerse(res.bookKey, parseInt(res.chapter), parseInt(res.verse))}
              className="p-3.5 bg-[var(--bg-elevated)]/60 border border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent)]/60 transition-colors"
            >
              <div className="font-serif font-bold text-xs text-[var(--accent)] mb-1">
                {res.bookName} {res.chapter}:{res.verse}
              </div>
              <p className="text-xs text-[var(--text-muted)]">{res.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

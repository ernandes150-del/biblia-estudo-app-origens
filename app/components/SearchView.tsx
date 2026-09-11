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
        <h2 className="text-2xl font-serif font-bold text-[#F1EBD9] border-b border-[#2A2A2C] pb-3">
          Pesquisa no Texto Bíblico
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Digite uma palavra ou termo (ex: 'princípio', 'amor')..."
            className="flex-1 bg-[#161617] border border-[#2A2A2C] rounded-xl px-4 py-2.5 text-xs text-[#DCD6C6] focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        <div className="space-y-3">
          {searchResults.map((res, i) => (
            <div
              key={i}
              onClick={() => navigateToVerse(res.bookKey, parseInt(res.chapter), parseInt(res.verse))}
              className="p-3.5 bg-[#1B1B1D]/60 border border-[#2A2A2C] rounded-xl cursor-pointer hover:border-[#C9A227]/60 transition-colors"
            >
              <div className="font-serif font-bold text-xs text-[#C9A227] mb-1">
                {res.bookName} {res.chapter}:{res.verse}
              </div>
              <p className="text-xs text-[#8A8378]">{res.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

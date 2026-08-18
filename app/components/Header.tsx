import type { ActiveTab, TranslationVersion, User } from "../types";
import { AcademicCapIcon, BookOpenIcon, OliveTreeLogo, SearchIcon } from "../lib/icons";

type HeaderProps = {
  user: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedStudiesCount: number;
  handleLogout: () => void;
  menuMobileAberto: boolean;
  setMenuMobileAberto: (v: boolean) => void;
  selectedVersion: TranslationVersion;
  setSelectedVersion: (v: TranslationVersion) => void;
  selectedBook: string;
  setSelectedBook: (b: string) => void;
  selectedChapter: number;
  setSelectedChapter: (c: number) => void;
  bookNames: string[];
  totalChapters: number;
  onSetSelectedVerse: (v: number) => void;
};

export default function Header({
  user,
  activeTab,
  setActiveTab,
  savedStudiesCount,
  handleLogout,
  menuMobileAberto,
  setMenuMobileAberto,
  selectedVersion,
  setSelectedVersion,
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter,
  bookNames,
  totalChapters,
  onSetSelectedVerse,
}: HeaderProps) {
  const changeBook = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    onSetSelectedVerse(1);
  };

  const changeChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    onSetSelectedVerse(1);
  };

  return (
    <header className="border-b border-[#E2E0D5] bg-[#F6F5F0]/95 backdrop-blur-md px-4 md:px-6 py-3 shrink-0 z-20">
      <div className="flex items-center justify-between">
        <div onClick={() => { setActiveTab("home"); setMenuMobileAberto(false); }} className="flex items-center gap-3 cursor-pointer">
          <OliveTreeLogo />
          <span className="font-serif text-lg font-bold tracking-tight text-[#2D3B32]">
            Bíblia Origens
          </span>
        </div>

        {/* BOTÃO HAMBÚRGUER PARA CELULAR */}
        <button
          onClick={() => setMenuMobileAberto(!menuMobileAberto)}
          className="md:hidden p-2 rounded-lg bg-[#EAE8DD] border border-[#D8D5C5] text-[#2D3B32] text-sm font-bold flex items-center gap-1.5"
          aria-label="Abrir Menu"
        >
          {menuMobileAberto ? "✕" : "☰"}
        </button>

        {/* MENU DESKTOP (Sempre visível em telas médias/grandes) */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-6">
          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "home" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setActiveTab("read")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "read" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
              }`}
            >
              <BookOpenIcon /> Leitura
            </button>
            {user && (
              <button
                onClick={() => setActiveTab("studies")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "studies" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
                }`}
              >
                <AcademicCapIcon /> Meus Estudos ({savedStudiesCount})
              </button>
            )}
            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "search" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
              }`}
            >
              <SearchIcon /> Pesquisa
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#526356]">Olá, <strong className="text-[#2D3B32]">{user.name}</strong></span>
                <button onClick={handleLogout} className="text-xs font-semibold text-rose-700 hover:underline">Sair</button>
              </div>
            ) : (
              <button onClick={() => setActiveTab("home")} className="text-xs bg-[#2D3B32] text-[#F6F5F0] px-3 py-1.5 rounded-lg font-medium">
                Entrar / Criar Conta
              </button>
            )}

            {activeTab === "read" && (
              <div className="flex items-center gap-2 ml-2">
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value as TranslationVersion)}
                  className="bg-[#2D3B32] text-[#F6F5F0] text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="ORIGINAL">Interlinear (Original)</option>
                  <option value="CONTINUOUS">Leitura Corrida</option>
                </select>

                <select
                  value={selectedBook}
                  onChange={(e) => changeBook(e.target.value)}
                  className="bg-[#EAE8DD] border border-[#D8D5C5] text-[#1F2923] text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {bookNames.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  value={selectedChapter}
                  onChange={(e) => changeChapter(Number(e.target.value))}
                  className="bg-[#EAE8DD] border border-[#D8D5C5] text-[#1F2923] text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTAINER DO MENU MOBILE (Abre quando pressionado no celular) */}
      {menuMobileAberto && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#E2E0D5] flex flex-col gap-3">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab("home"); setMenuMobileAberto(false); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${
                activeTab === "home" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] bg-[#EAE8DD]"
              }`}
            >
              Início
            </button>
            <button
              onClick={() => { setActiveTab("read"); setMenuMobileAberto(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                activeTab === "read" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] bg-[#EAE8DD]"
              }`}
            >
              <BookOpenIcon /> Leitura
            </button>
            {user && (
              <button
                onClick={() => { setActiveTab("studies"); setMenuMobileAberto(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  activeTab === "studies" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] bg-[#EAE8DD]"
                }`}
              >
                <AcademicCapIcon /> Meus Estudos ({savedStudiesCount})
              </button>
            )}
            <button
              onClick={() => { setActiveTab("search"); setMenuMobileAberto(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                activeTab === "search" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] bg-[#EAE8DD]"
              }`}
            >
              <SearchIcon /> Pesquisa
            </button>
          </nav>

          {/* SELETORES DE BÍBLIA NO MENU MOBILE */}
          {activeTab === "read" && (
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E0D5]">
              <label className="text-[10px] font-bold text-[#526356] uppercase">Modo, Livro e Capítulo:</label>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value as TranslationVersion)}
                className="bg-[#2D3B32] text-[#F6F5F0] text-xs font-bold rounded-lg p-2 focus:outline-none"
              >
                <option value="ORIGINAL">Interlinear (Original)</option>
                <option value="CONTINUOUS">Leitura Corrida</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedBook}
                  onChange={(e) => changeBook(e.target.value)}
                  className="bg-[#EAE8DD] border border-[#D8D5C5] text-[#1F2923] text-xs font-medium rounded-lg p-2 focus:outline-none"
                >
                  {bookNames.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  value={selectedChapter}
                  onChange={(e) => changeChapter(Number(e.target.value))}
                  className="bg-[#EAE8DD] border border-[#D8D5C5] text-[#1F2923] text-xs font-medium rounded-lg p-2 focus:outline-none"
                >
                  {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                    <option key={ch} value={ch}>Capítulo {ch}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* USER LOGOUT MOBILE */}
          <div className="pt-2 border-t border-[#E2E0D5] flex items-center justify-between">
            {user ? (
              <>
                <span className="text-xs text-[#526356]">Olá, <strong className="text-[#2D3B32]">{user.name}</strong></span>
                <button onClick={handleLogout} className="text-xs font-semibold text-rose-700">Sair</button>
              </>
            ) : (
              <button onClick={() => { setActiveTab("home"); setMenuMobileAberto(false); }} className="w-full text-xs bg-[#2D3B32] text-[#F6F5F0] p-2 rounded-lg font-medium text-center">
                Entrar / Criar Conta
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

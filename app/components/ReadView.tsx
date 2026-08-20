import type {
  ActiveSidePanel,
  ContextInfo,
  InterlinearWord,
  ReferenceItem,
  TranslationVersion,
  UserData,
  VerseNote,
} from "../types";
import { getInterlinearWords } from "../lib/lexicon";
import { LinkIcon, StarIcon } from "../lib/icons";

type ReadViewProps = {
  selectedBook: string;
  selectedChapter: number;
  selectedVerse: number | null;
  setSelectedVerse: (v: number) => void;
  currentLanguage: string;
  currentChapterVerses: Record<string, string>;
  userData: UserData;
  selectedVersion: TranslationVersion;
  activeSidePanel: ActiveSidePanel;
  setActiveSidePanel: (p: ActiveSidePanel) => void;
  toggleFavorite: (verseNum: number) => void;
  toggleHighlight: (verseNum: number) => void;
  setSelectedWord: (w: InterlinearWord | null) => void;
  typedContextData: Record<string, ContextInfo>;
  currentVerseKey: string | null;
  currentVerseNote: VerseNote | null;
  saveStudyText: (text: string) => void;
  currentReferences: ReferenceItem[];
  // Incrementado pelo componente pai sempre que o léxico interlinear de um
  // livro termina de carregar. Não é lido diretamente aqui — sua única função
  // é forçar este componente a re-renderizar e reconsultar getInterlinearWords.
  lexiconVersion: number;
};

export default function ReadView({
  selectedBook,
  selectedChapter,
  selectedVerse,
  setSelectedVerse,
  currentLanguage,
  currentChapterVerses,
  userData,
  selectedVersion,
  activeSidePanel,
  setActiveSidePanel,
  toggleFavorite,
  toggleHighlight,
  setSelectedWord,
  typedContextData,
  currentVerseKey,
  currentVerseNote,
  saveStudyText,
  currentReferences,
  lexiconVersion,
}: ReadViewProps) {
  const renderVerseContent = (vKey: string, vText: string) => {
    const words = getInterlinearWords(vKey);

    if (!words) {
      const lexiconStillLoading = lexiconVersion === 0;
      return (
        <div>
          <p className="text-sm leading-relaxed font-serif">{vText}</p>
          <p className="text-[10px] text-[#526356] mt-1 italic">
            {lexiconStillLoading
              ? "Carregando léxico interlinear do livro..."
              : "Análise interlinear ainda não cadastrada para este versículo."}
          </p>
        </div>
      );
    }

    if (selectedVersion === "ORIGINAL") {
      return (
        <div className="flex flex-wrap gap-y-4 gap-x-3 justify-start">
          {words.map((word, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWord(word);
              }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-[#D8D5C5]/50 cursor-pointer border border-transparent hover:border-[#D8D5C5]"
            >
              <span className={`text-sm font-semibold mb-0.5 ${word.isJesusWords ? "text-[#B91C1C]" : "text-[#1F2923]"}`}>
                {word.translation}
              </span>
              <span className={`text-base font-serif font-bold ${word.isJesusWords ? "text-[#B91C1C]" : "text-[#2D3B32]"}`}>
                {word.original}
              </span>
              <span className="text-[10px] italic text-[#526356] mt-0.5">
                ({word.translit})
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-sm leading-relaxed font-serif">
        {words.map((word, idx) => (
          <span key={idx} className={word.isJesusWords ? "text-[#B91C1C] font-semibold" : "text-[#1F2923]"}>
            {word.translation}{" "}
          </span>
        ))}
      </p>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* PAINEL DE VERSÍCULOS */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E0D5] pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2D3B32]">
              {selectedBook} {selectedChapter}
            </h2>
            <p className="text-xs text-[#526356] mt-0.5">
              Idioma original: <span className="font-semibold">{currentLanguage}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "context" ? "none" : "context")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                activeSidePanel === "context"
                  ? "bg-[#2D3B32] text-[#F6F5F0] border-[#2D3B32]"
                  : "bg-[#EAE8DD] text-[#2D3B32] border-[#D8D5C5]"
              }`}
            >
              Contexto do Livro
            </button>
            {selectedVerse && (
              <button
                onClick={() => setActiveSidePanel(activeSidePanel === "references" ? "none" : "references")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  activeSidePanel === "references"
                    ? "bg-[#2D3B32] text-[#F6F5F0] border-[#2D3B32]"
                    : "bg-[#EAE8DD] text-[#2D3B32] border-[#D8D5C5]"
                }`}
              >
                Referências
              </button>
            )}
          </div>
        </div>

        {/* LISTA DE VERSÍCULOS */}
        <div className="space-y-3">
          {Object.entries(currentChapterVerses).map(([vNumStr, vText]) => {
            const vNum = parseInt(vNumStr);
            const verseKey = `${selectedBook}-${selectedChapter}-${vNum}`;
            const isSelected = selectedVerse === vNum;
            const vNote = userData[verseKey];

            return (
              <div
                key={vNum}
                onClick={() => setSelectedVerse(vNum)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#2D3B32] bg-[#EAE8DD]/80 shadow-sm"
                    : "border-[#E2E0D5] bg-[#F6F5F0] hover:border-[#D8D5C5]"
                } ${vNote?.highlighted ? "bg-amber-100/60 border-amber-300" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-bold text-xs text-[#425447] bg-[#D8D5C5] px-2 py-0.5 rounded-md">
                    {vNum}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(vNum); }}
                      className="p-1 hover:bg-[#D8D5C5] rounded"
                      title="Favoritar"
                    >
                      <StarIcon filled={vNote?.favorite} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleHighlight(vNum); }}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        vNote?.highlighted
                          ? "bg-amber-300 border-amber-400 text-stone-900 font-bold"
                          : "border-[#D8D5C5] text-[#526356]"
                      }`}
                    >
                      Destacar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVerse(vNum);
                        setActiveSidePanel("study");
                      }}
                      className="text-xs bg-[#2D3B32] text-[#F6F5F0] px-2.5 py-0.5 rounded font-medium"
                    >
                      Estudar
                    </button>
                  </div>
                </div>

                {renderVerseContent(verseKey, vText)}

                {vNote?.study && (
                  <div className="mt-3 pt-2 border-t border-[#D8D5C5] text-xs text-[#425447] italic bg-[#EAE8DD]/50 p-2 rounded">
                    <strong>Anotação de estudo:</strong> {vNote.study}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* PAINEL LATERAL DE DETALHES / ANÁLISE */}
      {activeSidePanel !== "none" && (
        <aside className="w-80 md:w-96 border-l border-[#E2E0D5] bg-[#EAE8DD]/40 p-4 overflow-y-auto shrink-0 hidden md:block">
          <div className="flex items-center justify-between mb-4 border-b border-[#D8D5C5] pb-2">
            <h3 className="font-serif font-bold text-sm text-[#2D3B32] uppercase tracking-wide">
              {activeSidePanel === "context" && "Contexto do Livro"}
              {activeSidePanel === "study" && `Caderno de Estudo - ${selectedBook} ${selectedChapter}:${selectedVerse}`}
              {activeSidePanel === "references" && `Referências de ${selectedBook} ${selectedChapter}:${selectedVerse}`}
            </h3>
            <button onClick={() => setActiveSidePanel("none")} className="text-xs font-bold text-[#526356] hover:text-[#1F2923]">
              ✕ Fechar
            </button>
          </div>

          {/* PAINEL DE CONTEXTO */}
          {activeSidePanel === "context" && (
            <div className="space-y-4 text-xs text-[#1F2923]">
              {typedContextData[selectedBook] ? (
                <>
                  <p><strong>Autor:</strong> {typedContextData[selectedBook].author}</p>
                  <p><strong>Data aproximada:</strong> {typedContextData[selectedBook].date}</p>
                  <p><strong>Tema principal:</strong> {typedContextData[selectedBook].theme}</p>
                  <div className="pt-2 border-t border-[#D8D5C5]">
                    <strong className="block mb-1">Introdução:</strong>
                    <p className="leading-relaxed text-[#526356]">{typedContextData[selectedBook].introduction}</p>
                  </div>
                  <div className="pt-2 border-t border-[#D8D5C5]">
                    <strong className="block mb-1">Contexto Histórico:</strong>
                    <p className="leading-relaxed text-[#526356]">{typedContextData[selectedBook].historicalContext}</p>
                  </div>
                </>
              ) : (
                <p className="text-[#526356]">Informações contextuais detalhadas para {selectedBook} em catalogação exegética.</p>
              )}
            </div>
          )}

          {/* PAINEL DE ESTUDO DO VERSÍCULO */}
          {activeSidePanel === "study" && (
            <div className="space-y-4">
              <p className="text-xs text-[#526356] italic border-b border-[#D8D5C5] pb-2">
                &ldquo;{currentVerseKey && currentChapterVerses[selectedVerse || 1]}&rdquo;
              </p>
              <div>
                <label className="text-xs font-bold text-[#2D3B32] block mb-1">Sua Anotação Exegética:</label>
                <textarea
                  rows={8}
                  value={currentVerseNote?.study || ""}
                  onChange={(e) => saveStudyText(e.target.value)}
                  placeholder="Escreva suas observações de estudo sobre o versículo..."
                  className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#2D3B32]"
                />
              </div>
            </div>
          )}

          {/* PAINEL DE REFERÊNCIAS CRUZADAS */}
          {activeSidePanel === "references" && (
            <div className="space-y-3">
              {currentReferences.map((ref, i) => (
                <div key={i} className="p-3 bg-[#F6F5F0] border border-[#D8D5C5] rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#2D3B32]">
                    <LinkIcon /> {ref.passage}
                  </div>
                  <p className="text-[#526356] italic">{ref.text}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

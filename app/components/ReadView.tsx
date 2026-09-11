import { useEffect, useRef, useState } from "react";
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
import { decodeMorphology } from "../lib/morphology";
import { translateGloss } from "../lib/glossTranslation";
import { loadOccurrences, type Occurrence } from "../lib/occurrences";
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
  selectedWord: InterlinearWord | null;
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

function refLabel(o: Occurrence): string {
  return `${o.b} ${o.c}:${o.v}`;
}

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
  selectedWord,
  typedContextData,
  currentVerseKey,
  currentVerseNote,
  saveStudyText,
  currentReferences,
  lexiconVersion,
}: ReadViewProps) {
  const [wordTab, setWordTab] = useState<"definicao" | "ocorrencias">("definicao");
  const [occurrences, setOccurrences] = useState<Occurrence[] | null>(null);
  const fetchingStrongRef = useRef<string | null>(null);

  // Sempre que uma nova palavra é selecionada, volta pra aba Definição e
  // reseta as ocorrências carregadas (evita mostrar as da palavra anterior).
  // Ajuste de estado feito durante a renderização (não num efeito) seguindo
  // o padrão recomendado pelo React para "resetar estado quando uma prop muda".
  const [trackedWord, setTrackedWord] = useState(selectedWord);
  if (trackedWord !== selectedWord) {
    setTrackedWord(selectedWord);
    setWordTab("definicao");
    setOccurrences(null);
  }

  useEffect(() => {
    if (wordTab !== "ocorrencias" || !selectedWord?.strong || occurrences) return;
    if (fetchingStrongRef.current === selectedWord.strong) return;
    fetchingStrongRef.current = selectedWord.strong;
    let cancelled = false;
    loadOccurrences(selectedWord.strong).then((data) => {
      if (!cancelled) setOccurrences(data ?? []);
      fetchingStrongRef.current = null;
    });
    return () => {
      cancelled = true;
    };
  }, [wordTab, selectedWord?.strong, occurrences]);

  const openWord = (word: InterlinearWord) => {
    setSelectedWord(word);
    setActiveSidePanel("word");
  };

  const renderVerseContent = (vKey: string, vText: string) => {
    const words = getInterlinearWords(vKey);

    if (!words) {
      const lexiconStillLoading = lexiconVersion === 0;
      return (
        <div>
          <p className="text-sm leading-relaxed font-serif text-[#DCD6C6]">{vText}</p>
          <p className="text-[10px] text-[#8A8378] mt-1 italic">
            {lexiconStillLoading
              ? "Carregando léxico interlinear do livro..."
              : "Análise interlinear ainda não cadastrada para este versículo."}
          </p>
        </div>
      );
    }

    if (selectedVersion === "ORIGINAL") {
      return (
        <div>
          <p className="text-xs text-[#8A8378] italic mb-2 leading-snug">{vText}</p>
          <div className="flex flex-wrap gap-y-3 gap-x-2 justify-start" dir={currentLanguage === "Hebraico" ? "rtl" : "ltr"}>
            {words.map((word, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  openWord(word);
                }}
                className={`flex flex-col items-center px-2 py-1.5 rounded-lg border transition-colors ${
                  selectedWord === word
                    ? "bg-[#C9A227]/15 border-[#C9A227]"
                    : "border-transparent hover:bg-[#2A2A2C] hover:border-[#3A3A3C]"
                }`}
              >
                <span className={`text-base font-serif font-bold ${word.isJesusWords ? "text-[#C0392B]" : "text-[#F1EBD9]"}`}>
                  {word.original}
                </span>
                <span className="text-[10px] italic text-[#8A8378] mt-0.5">({word.translit})</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-sm leading-relaxed font-serif text-[#DCD6C6]">{vText}</p>;
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0F0F10]">
      {/* PAINEL DE VERSÍCULOS */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2C] pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#F1EBD9]">
              {selectedBook} {selectedChapter}
            </h2>
            <p className="text-xs text-[#8A8378] mt-0.5">
              Idioma original: <span className="font-semibold text-[#C9A227]">{currentLanguage}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "context" ? "none" : "context")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeSidePanel === "context"
                  ? "bg-[#C9A227] text-[#0F0F10] border-[#C9A227]"
                  : "bg-[#1B1B1D] text-[#DCD6C6] border-[#2A2A2C] hover:border-[#C9A227]/50"
              }`}
            >
              Contexto do Livro
            </button>
            {selectedVerse && (
              <button
                onClick={() => setActiveSidePanel(activeSidePanel === "references" ? "none" : "references")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeSidePanel === "references"
                    ? "bg-[#C9A227] text-[#0F0F10] border-[#C9A227]"
                    : "bg-[#1B1B1D] text-[#DCD6C6] border-[#2A2A2C] hover:border-[#C9A227]/50"
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
                    ? "border-[#C9A227]/60 bg-[#1B1B1D] shadow-[0_0_0_1px_rgba(201,162,39,0.15)]"
                    : "border-[#232325] bg-[#161617] hover:border-[#2A2A2C]"
                } ${vNote?.highlighted ? "bg-[#2B2312] border-[#8A6D1F]" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-bold text-xs text-[#0F0F10] bg-[#C9A227] px-2 py-0.5 rounded-md">
                    {vNum}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(vNum); }}
                      className="p-1 hover:bg-[#2A2A2C] rounded"
                      title="Favoritar"
                    >
                      <StarIcon filled={vNote?.favorite} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleHighlight(vNum); }}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        vNote?.highlighted
                          ? "bg-[#8A6D1F] border-[#C9A227] text-[#0F0F10] font-bold"
                          : "border-[#2A2A2C] text-[#8A8378]"
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
                      className="text-xs bg-[#C9A227] text-[#0F0F10] px-2.5 py-0.5 rounded font-medium"
                    >
                      Estudar
                    </button>
                  </div>
                </div>

                {renderVerseContent(verseKey, vText)}

                {vNote?.study && (
                  <div className="mt-3 pt-2 border-t border-[#2A2A2C] text-xs text-[#DCD6C6] italic bg-[#1B1B1D] p-2 rounded">
                    <strong className="text-[#C9A227] not-italic">Anotação de estudo:</strong> {vNote.study}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* PAINEL LATERAL DE DETALHES / ANÁLISE */}
      {activeSidePanel !== "none" && (
        <aside className="w-80 md:w-96 border-l border-[#2A2A2C] bg-[#141415] p-4 overflow-y-auto shrink-0 hidden md:block">
          <div className="flex items-center justify-between mb-4 border-b border-[#2A2A2C] pb-2">
            <h3 className="font-serif font-bold text-sm text-[#F1EBD9] uppercase tracking-wide">
              {activeSidePanel === "context" && "Contexto do Livro"}
              {activeSidePanel === "study" && `Caderno de Estudo - ${selectedBook} ${selectedChapter}:${selectedVerse}`}
              {activeSidePanel === "references" && `Referências de ${selectedBook} ${selectedChapter}:${selectedVerse}`}
              {activeSidePanel === "word" && "Palavra Original"}
            </h3>
            <button onClick={() => setActiveSidePanel("none")} className="text-xs font-bold text-[#8A8378] hover:text-[#F1EBD9]">
              ✕ Fechar
            </button>
          </div>

          {/* PAINEL DE CONTEXTO */}
          {activeSidePanel === "context" && (
            <div className="space-y-4 text-xs text-[#DCD6C6]">
              {typedContextData[selectedBook] ? (
                <>
                  <p><strong className="text-[#C9A227]">Autor:</strong> {typedContextData[selectedBook].author}</p>
                  <p><strong className="text-[#C9A227]">Data aproximada:</strong> {typedContextData[selectedBook].date}</p>
                  <p><strong className="text-[#C9A227]">Tema principal:</strong> {typedContextData[selectedBook].theme}</p>
                  <div className="pt-2 border-t border-[#2A2A2C]">
                    <strong className="block mb-1 text-[#C9A227]">Introdução:</strong>
                    <p className="leading-relaxed text-[#8A8378]">{typedContextData[selectedBook].introduction}</p>
                  </div>
                  <div className="pt-2 border-t border-[#2A2A2C]">
                    <strong className="block mb-1 text-[#C9A227]">Contexto Histórico:</strong>
                    <p className="leading-relaxed text-[#8A8378]">{typedContextData[selectedBook].historicalContext}</p>
                  </div>
                </>
              ) : (
                <p className="text-[#8A8378]">Informações contextuais detalhadas para {selectedBook} em catalogação exegética.</p>
              )}
            </div>
          )}

          {/* PAINEL DE ESTUDO DO VERSÍCULO */}
          {activeSidePanel === "study" && (
            <div className="space-y-4">
              <p className="text-xs text-[#8A8378] italic border-b border-[#2A2A2C] pb-2">
                &ldquo;{currentVerseKey && currentChapterVerses[selectedVerse || 1]}&rdquo;
              </p>
              <div>
                <label className="text-xs font-bold text-[#C9A227] block mb-1">Sua Anotação Exegética:</label>
                <textarea
                  rows={8}
                  value={currentVerseNote?.study || ""}
                  onChange={(e) => saveStudyText(e.target.value)}
                  placeholder="Escreva suas observações de estudo sobre o versículo..."
                  className="w-full bg-[#1B1B1D] border border-[#2A2A2C] rounded-xl p-3 text-xs leading-relaxed text-[#DCD6C6] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          )}

          {/* PAINEL DE REFERÊNCIAS CRUZADAS */}
          {activeSidePanel === "references" && (
            <div className="space-y-3">
              {currentReferences.map((ref, i) => (
                <div key={i} className="p-3 bg-[#1B1B1D] border border-[#2A2A2C] rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#C9A227]">
                    <LinkIcon /> {ref.passage}
                  </div>
                  <p className="text-[#8A8378] italic">{ref.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* PAINEL DE PALAVRA ORIGINAL (Definição / Ocorrências) */}
          {activeSidePanel === "word" && selectedWord && (
            <div>
              <div className="text-center pb-4 border-b border-[#2A2A2C] mb-3">
                <div className={`text-4xl font-serif font-bold mb-1 ${selectedWord.isJesusWords ? "text-[#C0392B]" : "text-[#F1EBD9]"}`}>
                  {selectedWord.original}
                </div>
                <div className="text-xs text-[#8A8378] italic">
                  {selectedWord.translit}
                  {selectedWord.strong && (
                    <span className="ml-2 text-[10px] font-mono bg-[#2A2A2C] text-[#C9A227] px-1.5 py-0.5 rounded">
                      {selectedWord.strong}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1 mb-4 border-b border-[#2A2A2C]">
                <button
                  onClick={() => setWordTab("definicao")}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px ${
                    wordTab === "definicao" ? "border-[#C9A227] text-[#C9A227]" : "border-transparent text-[#8A8378]"
                  }`}
                >
                  Definição
                </button>
                <button
                  onClick={() => setWordTab("ocorrencias")}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px ${
                    wordTab === "ocorrencias" ? "border-[#C9A227] text-[#C9A227]" : "border-transparent text-[#8A8378]"
                  }`}
                >
                  Ocorrências{occurrences ? ` (${occurrences.length})` : ""}
                </button>
              </div>

              {wordTab === "definicao" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-[#8A8378] uppercase tracking-wide mb-1">
                      Sentido neste versículo
                    </p>
                    <p className="text-[#F1EBD9] text-sm">{translateGloss(selectedWord.translation)}</p>
                  </div>

                  {selectedWord.morphology && (
                    <div className="pt-3 border-t border-[#2A2A2C]">
                      <p className="text-[10px] font-bold text-[#8A8378] uppercase tracking-wide mb-1">
                        Como esta forma é construída
                      </p>
                      <p className="text-[#DCD6C6] leading-relaxed">
                        {decodeMorphology(selectedWord.morphology, selectedWord.strong?.startsWith("H") ? "hebrew" : "greek")}
                      </p>
                    </div>
                  )}

                  {selectedWord.meaning && (
                    <div className="pt-3 border-t border-[#2A2A2C]">
                      <p className="text-[10px] font-bold text-[#8A8378] uppercase tracking-wide mb-1">
                        Forma de dicionário
                      </p>
                      <p className="text-[#DCD6C6] leading-relaxed">{translateGloss(selectedWord.meaning)}</p>
                    </div>
                  )}

                  <p className="text-[10px] text-[#5A564F] pt-2 border-t border-[#2A2A2C]">
                    Fonte lexical: STEPBible-Data (CC BY 4.0) — glosa traduzida automaticamente a partir de um
                    dicionário fechado de termos comuns; termos fora dele aparecem em inglês.
                  </p>
                </div>
              )}

              {wordTab === "ocorrencias" && (
                <div className="space-y-1.5">
                  {occurrences === null && <p className="text-xs text-[#8A8378]">Carregando ocorrências...</p>}
                  {occurrences !== null && occurrences.length === 0 && (
                    <p className="text-xs text-[#8A8378]">Nenhuma outra ocorrência encontrada.</p>
                  )}
                  {occurrences?.map((o, i) => (
                    <div key={i} className="flex items-baseline justify-between text-xs px-2 py-1.5 rounded hover:bg-[#1B1B1D]">
                      <span className="text-[#8A8378]">{refLabel(o)}</span>
                      <span className="font-serif text-[#F1EBD9]">{o.o}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

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
  navigateToVerse: (book: string, chapter: number, verse: number, openStudy?: boolean) => void;
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
  navigateToVerse,
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
          <p className="text-sm leading-relaxed font-serif text-[var(--text-secondary)]">{vText}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
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
          <p className="text-xs text-[var(--text-muted)] italic mb-2 leading-snug">{vText}</p>
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
                    ? "bg-[var(--accent)]/15 border-[var(--accent)]"
                    : "border-transparent hover:bg-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <span className={`text-base font-serif font-bold ${word.isJesusWords ? "text-[var(--danger)]" : "text-[var(--text)]"}`}>
                  {word.original}
                </span>
                <span className="text-[10px] italic text-[var(--text-muted)] mt-0.5">({word.translit})</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-sm leading-relaxed font-serif text-[var(--text-secondary)]">{vText}</p>;
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[var(--bg)]">
      {/* PAINEL DE VERSÍCULOS */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--text)]">
              {selectedBook} {selectedChapter}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Idioma original: <span className="font-semibold text-[var(--accent)]">{currentLanguage}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "context" ? "none" : "context")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeSidePanel === "context"
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]/50"
              }`}
            >
              Contexto do Livro
            </button>
            {selectedVerse && (
              <button
                onClick={() => setActiveSidePanel(activeSidePanel === "references" ? "none" : "references")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeSidePanel === "references"
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]/50"
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
                className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent)]/60 bg-[var(--bg-elevated)]/80 shadow-[0_0_0_1px_rgba(10,132,255,0.15)]"
                    : "border-[var(--bg-elevated-2)] bg-[var(--bg-elevated)]/60 hover:border-[var(--border)]"
                } ${vNote?.highlighted ? "bg-[var(--highlight-bg)] border-[var(--highlight-border)]" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-bold text-xs text-white bg-[var(--accent)] px-2 py-0.5 rounded-md">
                    {vNum}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(vNum); }}
                      className="p-1 hover:bg-[var(--border)] rounded"
                      title="Favoritar"
                    >
                      <StarIcon filled={vNote?.favorite} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleHighlight(vNum); }}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        vNote?.highlighted
                          ? "bg-[var(--highlight-border)] border-[var(--accent)] text-white font-bold"
                          : "border-[var(--border)] text-[var(--text-muted)]"
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
                      className="text-xs bg-[var(--accent)] text-white px-2.5 py-0.5 rounded font-medium"
                    >
                      Estudar
                    </button>
                  </div>
                </div>

                {renderVerseContent(verseKey, vText)}

                {vNote?.study && (
                  <div className="mt-3 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] italic bg-[var(--bg-elevated)] p-2 rounded">
                    <strong className="text-[var(--accent)] not-italic">Anotação de estudo:</strong> {vNote.study}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* PAINEL LATERAL DE DETALHES / ANÁLISE — painel fixo no desktop, tela cheia deslizante no celular */}
      {activeSidePanel !== "none" && (
        <>
          {/* Fundo escurecido no celular, fecha o painel ao tocar fora */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setActiveSidePanel("none")}
          />
          <aside className="fixed md:static inset-x-0 bottom-0 md:inset-auto top-16 md:top-auto z-50 md:z-auto w-full md:w-80 lg:w-96 max-h-[85vh] md:max-h-none border-t md:border-t-0 md:border-l border-[var(--border)] bg-[var(--bg-panel)]/80 backdrop-blur-2xl p-4 pb-8 md:pb-4 overflow-y-auto shrink-0 rounded-t-2xl md:rounded-none shadow-2xl md:shadow-none">
            <div className="md:hidden w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-2">
            <h3 className="font-serif font-bold text-sm text-[var(--text)] uppercase tracking-wide">
              {activeSidePanel === "context" && "Contexto do Livro"}
              {activeSidePanel === "study" && `Caderno de Estudo - ${selectedBook} ${selectedChapter}:${selectedVerse}`}
              {activeSidePanel === "references" && `Referências de ${selectedBook} ${selectedChapter}:${selectedVerse}`}
              {activeSidePanel === "word" && "Palavra Original"}
            </h3>
            <button onClick={() => setActiveSidePanel("none")} className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]">
              ✕ Fechar
            </button>
          </div>

          {/* PAINEL DE CONTEXTO */}
          {activeSidePanel === "context" && (
            <div className="space-y-4 text-xs text-[var(--text-secondary)]">
              {typedContextData[selectedBook] ? (
                <>
                  <p><strong className="text-[var(--accent)]">Autor:</strong> {typedContextData[selectedBook].author}</p>
                  <p><strong className="text-[var(--accent)]">Data aproximada:</strong> {typedContextData[selectedBook].date}</p>
                  <p><strong className="text-[var(--accent)]">Tema principal:</strong> {typedContextData[selectedBook].theme}</p>
                  <div className="pt-2 border-t border-[var(--border)]">
                    <strong className="block mb-1 text-[var(--accent)]">Introdução:</strong>
                    <p className="leading-relaxed text-[var(--text-muted)]">{typedContextData[selectedBook].introduction}</p>
                  </div>
                  <div className="pt-2 border-t border-[var(--border)]">
                    <strong className="block mb-1 text-[var(--accent)]">Contexto Histórico:</strong>
                    <p className="leading-relaxed text-[var(--text-muted)]">{typedContextData[selectedBook].historicalContext}</p>
                  </div>
                </>
              ) : (
                <p className="text-[var(--text-muted)]">Informações contextuais detalhadas para {selectedBook} em catalogação exegética.</p>
              )}
            </div>
          )}

          {/* PAINEL DE ESTUDO DO VERSÍCULO */}
          {activeSidePanel === "study" && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-muted)] italic border-b border-[var(--border)] pb-2">
                &ldquo;{currentVerseKey && currentChapterVerses[selectedVerse || 1]}&rdquo;
              </p>
              <div>
                <label className="text-xs font-bold text-[var(--accent)] block mb-1">Sua Anotação Exegética:</label>
                <textarea
                  rows={8}
                  value={currentVerseNote?.study || ""}
                  onChange={(e) => saveStudyText(e.target.value)}
                  placeholder="Escreva suas observações de estudo sobre o versículo..."
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-xs leading-relaxed text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          )}

          {/* PAINEL DE REFERÊNCIAS CRUZADAS */}
          {activeSidePanel === "references" && (
            <div className="space-y-3">
              {currentReferences.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">
                  Nenhuma referência cruzada cadastrada para este versículo ainda.
                </p>
              ) : (
                currentReferences.map((ref, i) => (
                  <div key={i} className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--accent)]">
                      <LinkIcon /> {ref.passage}
                    </div>
                    <p className="text-[var(--text-muted)] italic">{ref.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PAINEL DE PALAVRA ORIGINAL (Definição / Ocorrências) */}
          {activeSidePanel === "word" && selectedWord && (
            <div>
              <div className="relative text-center pb-4 border-b border-[var(--border)] mb-3 -mx-4 px-4 pt-2 overflow-hidden">
                <div
                  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 opacity-25 blur-3xl"
                  style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
                />
                <div className={`relative text-4xl font-serif font-bold mb-1 ${selectedWord.isJesusWords ? "text-[var(--danger)]" : "text-[var(--text)]"}`}>
                  {selectedWord.original}
                </div>
                <div className="relative text-xs text-[var(--text-muted)] italic">
                  {selectedWord.translit}
                  {selectedWord.strong && (
                    <span className="ml-2 text-[10px] font-mono bg-[var(--border)] text-[var(--accent)] px-1.5 py-0.5 rounded">
                      {selectedWord.strong}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1 mb-4 border-b border-[var(--border)]">
                <button
                  onClick={() => setWordTab("definicao")}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px ${
                    wordTab === "definicao" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--text-muted)]"
                  }`}
                >
                  Definição
                </button>
                <button
                  onClick={() => setWordTab("ocorrencias")}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px ${
                    wordTab === "ocorrencias" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--text-muted)]"
                  }`}
                >
                  Ocorrências{occurrences ? ` (${occurrences.length})` : ""}
                </button>
              </div>

              {wordTab === "definicao" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                      Sentido neste versículo
                    </p>
                    {(() => {
                      const g = translateGloss(selectedWord.translation);
                      return (
                        <p className="text-[var(--text)] text-sm">
                          {g.text}
                          {!g.translated && (
                            <span className="ml-1.5 text-[9px] font-bold text-[var(--text-muted)] align-middle border border-[var(--border)] rounded px-1 py-0.5">
                              EN
                            </span>
                          )}
                        </p>
                      );
                    })()}
                  </div>

                  {selectedWord.morphology && (
                    <div className="pt-3 border-t border-[var(--border)]">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                        Como esta forma é construída
                      </p>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {decodeMorphology(selectedWord.morphology, selectedWord.strong?.startsWith("H") ? "hebrew" : "greek")}
                      </p>
                    </div>
                  )}

                  {selectedWord.meaning && (
                    <div className="pt-3 border-t border-[var(--border)]">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                        Forma de dicionário
                      </p>
                      {(() => {
                        const m = translateGloss(selectedWord.meaning);
                        return (
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {m.text}
                            {!m.translated && (
                              <span className="ml-1.5 text-[9px] font-bold text-[var(--text-muted)] align-middle border border-[var(--border)] rounded px-1 py-0.5">
                                EN
                              </span>
                            )}
                          </p>
                        );
                      })()}
                    </div>
                  )}

                  <p className="text-[10px] text-[var(--text-dim)] pt-2 border-t border-[var(--border)]">
                    Fonte lexical: STEPBible-Data (CC BY 4.0). O selo <span className="font-bold">EN</span> indica
                    que essa glosa específica ainda não está no dicionário de tradução (~88% de cobertura) e
                    aparece no original em inglês, em vez de uma mistura de idiomas.
                  </p>
                </div>
              )}

              {wordTab === "ocorrencias" && (
                <div className="space-y-1.5">
                  {occurrences === null && <p className="text-xs text-[var(--text-muted)]">Carregando ocorrências...</p>}
                  {occurrences !== null && occurrences.length === 0 && (
                    <p className="text-xs text-[var(--text-muted)]">Nenhuma outra ocorrência encontrada.</p>
                  )}
                  {occurrences?.map((o, i) => (
                    <button
                      key={i}
                      onClick={() => navigateToVerse(o.b, o.c, o.v)}
                      className="w-full flex items-baseline justify-between text-xs px-2 py-1.5 rounded hover:bg-[var(--bg-elevated)] text-left transition-colors"
                    >
                      <span className="text-[var(--text-muted)]">{refLabel(o)}</span>
                      <span className="font-serif text-[var(--text)]">{o.o}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
        </>
      )}
    </div>
  );
}

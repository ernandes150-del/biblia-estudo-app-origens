"use client";

import { useEffect, useState } from "react";

type CrossReference = {
  reference: string;
  description: string;
};

type StudyContext = {
  description: string;
  themes: string[];
};

type StudyPanelProps = {
  bookName: string;
  chapter: number;
  verse: string;
  verseText: string;
  references?: CrossReference[];
  context?: StudyContext;
  onOpenReference?: (reference: string) => void;
};

const STUDY_COMMENTS_KEY = "biblia-estudo-study-comments-v1";

export default function StudyPanel({
  bookName,
  chapter,
  verse,
  verseText,
  references = [],
  context,
  onOpenReference,
}: StudyPanelProps) {
  const verseId = `${bookName}-${chapter}-${verse}`;

  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "references" | "context" | "comment"
  >("references");

  /*
   * ==========================================================
   * CARREGAR COMENTÁRIO DE ESTUDO
   * ==========================================================
   */

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        STUDY_COMMENTS_KEY
      );

      if (!stored) {
        setComment("");
        return;
      }

      const parsed = JSON.parse(stored);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        setComment(parsed[verseId] || "");
      }
    } catch (error) {
      console.error(
        "Erro ao carregar comentário de estudo:",
        error
      );
    }
  }, [verseId]);

  /*
   * ==========================================================
   * SALVAR COMENTÁRIO
   * ==========================================================
   */

  function saveComment() {
    try {
      const stored = window.localStorage.getItem(
        STUDY_COMMENTS_KEY
      );

      let comments: Record<string, string> = {};

      if (stored) {
        const parsed = JSON.parse(stored);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          comments = parsed;
        }
      }

      comments[verseId] = comment;

      window.localStorage.setItem(
        STUDY_COMMENTS_KEY,
        JSON.stringify(comments)
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Erro ao salvar comentário de estudo:",
        error
      );
    }
  }

  /*
   * ==========================================================
   * ABRIR REFERÊNCIA
   * ==========================================================
   */

  function handleReferenceClick(
    reference: string
  ) {
    if (onOpenReference) {
      onOpenReference(reference);
    }
  }

  return (
    <div className="mt-4 rounded-3xl border border-stone-200 bg-white shadow-sm">
      {/* ======================================================
          CABEÇALHO
      ======================================================= */}

      <div className="border-b border-stone-200 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-xl">
            📚
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Estudo do versículo
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              {bookName} {chapter}:{verse}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          VERSÍCULO
      ======================================================= */}

      <div className="border-b border-stone-200 bg-stone-50 p-5">
        <p className="text-sm leading-7 text-stone-700">
          <span className="mr-2 font-bold text-stone-500">
            {verse}.
          </span>

          {verseText}
        </p>
      </div>

      {/* ======================================================
          ABAS
      ======================================================= */}

      <div className="flex overflow-x-auto border-b border-stone-200">
        <button
          onClick={() => setActiveTab("references")}
          className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
            activeTab === "references"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          🔗 Referências
        </button>

        <button
          onClick={() => setActiveTab("context")}
          className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
            activeTab === "context"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          📖 Contexto
        </button>

        <button
          onClick={() => setActiveTab("comment")}
          className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
            activeTab === "comment"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          💡 Meu estudo
        </button>
      </div>

      {/* ======================================================
          REFERÊNCIAS CRUZADAS
      ======================================================= */}

      {activeTab === "references" && (
        <div className="p-5">
          <div className="mb-4">
            <h4 className="font-bold">
              Referências cruzadas
            </h4>

            <p className="mt-1 text-sm text-stone-500">
              Outros textos relacionados a este versículo.
            </p>
          </div>

          {references.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
              <div className="text-3xl">🔗</div>

              <p className="mt-3 font-semibold text-stone-700">
                Nenhuma referência cadastrada
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Novas referências poderão ser adicionadas
                futuramente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {references.map((item, index) => (
                <button
                  key={`${item.reference}-${index}`}
                  onClick={() =>
                    handleReferenceClick(item.reference)
                  }
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-stone-400 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-stone-900">
                      {item.reference}
                    </span>

                    <span className="text-xs text-stone-400">
                      Abrir →
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================
          CONTEXTO
      ======================================================= */}

      {activeTab === "context" && (
        <div className="p-5">
          <div className="mb-4">
            <h4 className="font-bold">
              Contexto
            </h4>

            <p className="mt-1 text-sm text-stone-500">
              Informações gerais para auxiliar no estudo.
            </p>
          </div>

          {!context ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
              <div className="text-3xl">📖</div>

              <p className="mt-3 font-semibold text-stone-700">
                Contexto ainda não cadastrado
              </p>
            </div>
          ) : (
            <div>
              <div className="rounded-2xl bg-stone-50 p-5">
                <p className="leading-7 text-stone-700">
                  {context.description}
                </p>
              </div>

              {context.themes &&
                context.themes.length > 0 && (
                  <div className="mt-5">
                    <h5 className="mb-3 text-sm font-bold uppercase tracking-wide text-stone-400">
                      Temas
                    </h5>

                    <div className="flex flex-wrap gap-2">
                      {context.themes.map(
                        (theme, index) => (
                          <span
                            key={`${theme}-${index}`}
                            className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700"
                          >
                            🏷️ {theme}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================
          MEU ESTUDO
      ======================================================= */}

      {activeTab === "comment" && (
        <div className="p-5">
          <div className="mb-4">
            <h4 className="font-bold">
              Meu estudo
            </h4>

            <p className="mt-1 text-sm text-stone-500">
              Registre pensamentos, interpretações e observações
              sobre este versículo.
            </p>
          </div>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            rows={7}
            placeholder="Escreva aqui seus pensamentos sobre este versículo..."
            className="w-full resize-y rounded-2xl border border-stone-300 bg-white p-4 leading-7 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-stone-400">
              Seu estudo é salvo neste navegador.
            </span>

            <button
              onClick={saveComment}
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700"
            >
              {saved ? "✓ Salvo" : "💾 Salvar estudo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
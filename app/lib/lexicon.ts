import type { InterlinearWord } from "../types";

// --- LÉXICO INTERLINEAR REAL (Fase 2) ---
// Dados de Strong's, gramática e morfologia de TODOS os 66 livros, gerados a
// partir do STEPBible-Data (Tyndale House Cambridge / STEPBible.org), CC BY 4.0:
// https://github.com/STEPBible/STEPBible-Data
// - TAGNT (Translators Amalgamated Greek NT) para o Novo Testamento
// - TAHOT (Translators Amalgamated Hebrew OT) para o Antigo Testamento
// Cada livro é servido sob demanda de /public/lexicon/{Livro}.json e mantido em
// cache em memória. Não fabricamos análise: um versículo sem entrada no arquivo
// do livro simplesmente não tem interlinear (ver getInterlinearWords).
//
// Observação: a glosa de tradução de cada palavra (campo "translation") vem em
// inglês, como fornecida pela fonte. Não a substituímos por uma tradução
// palavra-por-palavra em português para não fabricar alinhamento que a fonte não
// garante — a tradução em português de referência é a do próprio versículo
// (Bíblia Livre), já exibida no restante do app.

type BookLexicon = Record<string, InterlinearWord[]>; // "capitulo-versiculo" -> palavras

const bookCache = new Map<string, BookLexicon>();
const loadingPromises = new Map<string, Promise<BookLexicon | null>>();

// Dispara (ou reaproveita) o carregamento do léxico de um livro. Chame isso a
// partir de um useEffect quando o livro selecionado mudar; depois disso,
// getInterlinearWords passa a enxergar os dados em cache de forma síncrona.
export function loadBookLexicon(bookName: string): Promise<BookLexicon | null> {
  const cached = bookCache.get(bookName);
  if (cached) return Promise.resolve(cached);

  const inFlight = loadingPromises.get(bookName);
  if (inFlight) return inFlight;

  const promise = fetch(`/lexicon/${encodeURIComponent(bookName)}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<BookLexicon>) : null))
    .then((data) => {
      if (data) bookCache.set(bookName, data);
      loadingPromises.delete(bookName);
      return data;
    })
    .catch(() => {
      loadingPromises.delete(bookName);
      return null;
    });

  loadingPromises.set(bookName, promise);
  return promise;
}

export function isBookLexiconLoaded(bookName: string): boolean {
  return bookCache.has(bookName);
}

// Retorna a análise palavra-por-palavra para "Livro-Capítulo-Versículo" (ex.:
// "1 Samuel-3-1") a partir do que já estiver em cache. Retorna null se o léxico
// do livro ainda não foi carregado (chame loadBookLexicon antes) ou se o
// versículo não tiver dado real cadastrado na fonte.
export const getInterlinearWords = (verseKey: string): InterlinearWord[] | null => {
  const lastDash = verseKey.lastIndexOf("-");
  const midDash = verseKey.lastIndexOf("-", lastDash - 1);
  if (midDash === -1) return null;

  const bookName = verseKey.slice(0, midDash);
  const chapVers = verseKey.slice(midDash + 1);

  const book = bookCache.get(bookName);
  return book?.[chapVers] || null;
};

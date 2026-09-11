// Comentário bíblico clássico de Matthew Henry (1662-1714), domínio
// público, obtido via Free Use Bible API (bible.helloao.org / projeto
// HelloAOLab, licença MIT / CC Public Domain Mark). Cobre 65 dos 66 livros
// — a fonte não inclui comentário para Cânticos dos Cânticos.
//
// Cada bloco de comentário cobre um intervalo de versículos (s = início,
// e = fim), não um versículo isolado — assim como no original de Matthew
// Henry, que comentava passagens inteiras de uma vez.

export type CommentaryBlock = { s: number; e: number; t: string };

type CommentaryBook = {
  intro: string;
  chapters: Record<string, CommentaryBlock[]>;
};

const cache = new Map<string, CommentaryBook | null>();
const loading = new Map<string, Promise<CommentaryBook | null>>();

// Carrega (ou reaproveita do cache) o comentário de um livro a partir de
// /public/commentary/matthew-henry/{Livro}.json. Retorna null se o livro
// não tiver comentário nesta fonte (só Cânticos, atualmente).
export function loadCommentaryBook(bookName: string): Promise<CommentaryBook | null> {
  if (cache.has(bookName)) return Promise.resolve(cache.get(bookName)!);

  const inFlight = loading.get(bookName);
  if (inFlight) return inFlight;

  const promise = fetch(`/commentary/matthew-henry/${encodeURIComponent(bookName)}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<CommentaryBook>) : null))
    .then((data) => {
      cache.set(bookName, data ?? null);
      loading.delete(bookName);
      return data ?? null;
    })
    .catch(() => {
      cache.set(bookName, null);
      loading.delete(bookName);
      return null;
    });

  loading.set(bookName, promise);
  return promise;
}

// Retorna o bloco de comentário (já carregado) que cobre um versículo
// específico, ou null se o livro/capítulo não tiver comentário cadastrado
// ou ainda não tiver sido carregado.
export function getCommentaryForVerse(
  bookName: string,
  chapter: number,
  verse: number
): CommentaryBlock | null {
  const book = cache.get(bookName);
  if (!book) return null;
  const blocks = book.chapters[String(chapter)];
  if (!blocks) return null;
  return blocks.find((b) => verse >= b.s && verse <= b.e) ?? null;
}

export function getCommentaryIntro(bookName: string): string | null {
  return cache.get(bookName)?.intro || null;
}

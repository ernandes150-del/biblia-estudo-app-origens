export type CrossRefTarget = { b: string; c: number; v: number };

type BookCrossRefs = Record<string, CrossRefTarget[]>; // "capitulo-versiculo" -> alvos

const cache = new Map<string, BookCrossRefs>();
const loading = new Map<string, Promise<BookCrossRefs | null>>();

// Carrega (ou reaproveita do cache) as referências cruzadas de um livro a
// partir de /public/cross-references/{Livro}.json. Fonte: Treasury of
// Scripture Knowledge, via o projeto KJV Study (kennethreitz/kjvstudy.org),
// que por sua vez usa os dados do OpenBible.info (CC BY).
export function loadCrossReferences(bookName: string): Promise<BookCrossRefs | null> {
  const cached = cache.get(bookName);
  if (cached) return Promise.resolve(cached);

  const inFlight = loading.get(bookName);
  if (inFlight) return inFlight;

  const promise = fetch(`/cross-references/${encodeURIComponent(bookName)}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<BookCrossRefs>) : null))
    .then((data) => {
      if (data) cache.set(bookName, data);
      loading.delete(bookName);
      return data;
    })
    .catch(() => {
      loading.delete(bookName);
      return null;
    });

  loading.set(bookName, promise);
  return promise;
}

// Retorna as referências cruzadas já carregadas para "cap-vers" de um livro
// específico. Retorna null se o livro ainda não foi carregado ou o
// versículo não tiver referência cadastrada.
export function getCrossReferences(bookName: string, chapVersKey: string): CrossRefTarget[] | null {
  const book = cache.get(bookName);
  return book?.[chapVersKey] || null;
}

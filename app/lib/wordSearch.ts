// Busca por número de Strong (ex: "H2617", "g26") ou pela transliteração da
// palavra original (ex: "chesed", "logos", "agape") — usando o índice gerado
// a partir do próprio léxico da Fase 2 (não é um serviço externo).

type TranslitIndex = Record<string, string[]>; // translit normalizado -> Strongs

let indexCache: TranslitIndex | null = null;
let indexPromise: Promise<TranslitIndex | null> | null = null;

function loadTranslitIndex(): Promise<TranslitIndex | null> {
  if (indexCache) return Promise.resolve(indexCache);
  if (indexPromise) return indexPromise;

  indexPromise = fetch("/search-index/translit-index.json")
    .then((res) => (res.ok ? (res.json() as Promise<TranslitIndex>) : null))
    .then((data) => {
      if (data) indexCache = data;
      return data;
    })
    .catch(() => null);

  return indexPromise;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const STRONG_RE = /^[hg]\d{1,4}[a-z]?$/i;

// Dado o texto digitado na busca, decide se é uma busca por palavra
// original: retorna a lista de Strongs correspondentes, ou null se o texto
// não parece uma busca desse tipo (cai para a busca normal em português).
export async function resolveWordSearch(query: string): Promise<string[] | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // Número de Strong digitado diretamente (ex: "H2617")
  if (STRONG_RE.test(trimmed)) {
    return [trimmed[0].toUpperCase() + trimmed.slice(1).toUpperCase()];
  }

  // Transliteração (ex: "chesed") — só ativa a busca por palavra se o termo
  // tiver letras (não dígitos) e pelo menos 3 caracteres, pra evitar
  // confundir com busca comum em português.
  const norm = normalize(trimmed);
  if (norm.length < 3 || /^\d+$/.test(norm)) return null;

  const index = await loadTranslitIndex();
  if (!index) return null;

  if (index[norm]) return index[norm];

  // Fallback: começa com o termo digitado (ajuda quem não lembra a grafia exata)
  const startsWith = Object.keys(index)
    .filter((k) => k.startsWith(norm))
    .slice(0, 5);
  if (startsWith.length === 0) return null;

  const strongs = new Set<string>();
  for (const k of startsWith) index[k].forEach((s) => strongs.add(s));
  return [...strongs];
}

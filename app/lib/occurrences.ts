export type Occurrence = {
  b: string; // livro
  c: number; // capítulo
  v: number; // versículo
  o: string; // palavra original (hebraico/grego)
  t: string; // transliteração
};

const cache = new Map<string, Occurrence[]>();
const loading = new Map<string, Promise<Occurrence[] | null>>();

// Carrega (ou reaproveita do cache) todas as ocorrências de um Strong
// específico a partir de /public/occurrences/{Strong}.json.
export function loadOccurrences(strong: string): Promise<Occurrence[] | null> {
  const cached = cache.get(strong);
  if (cached) return Promise.resolve(cached);

  const inFlight = loading.get(strong);
  if (inFlight) return inFlight;

  const promise = fetch(`/occurrences/${encodeURIComponent(strong)}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<Occurrence[]>) : null))
    .then((data) => {
      if (data) cache.set(strong, data);
      loading.delete(strong);
      return data;
    })
    .catch(() => {
      loading.delete(strong);
      return null;
    });

  loading.set(strong, promise);
  return promise;
}

// Agrega as ocorrências de todas as variantes de Strong estendido que
// compartilham o mesmo Strong clássico (ex: H7225 reúne H7225G, H7225G_A,
// H7225G_B e H7225H) — assim a contagem bate com o padrão clássico usado
// pela maioria das ferramentas de estudo bíblico, em vez de mostrar só um
// sentido específico do STEPBible como se fosse a palavra inteira.
export async function loadOccurrencesForClassic(strongs: string[]): Promise<Occurrence[]> {
  const lists = await Promise.all(strongs.map((s) => loadOccurrences(s)));
  const merged: Occurrence[] = [];
  for (const list of lists) if (list) merged.push(...list);
  return merged;
}

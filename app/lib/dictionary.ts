// Dicionário completo por Strong estendido — extraído dos léxicos de
// referência do STEPBible-Data (TBESH para hebraico, baseado no BDB; TBESG
// para grego, baseado no léxico de Abbott-Smith), CC BY 4.0. Cada entrada
// tem a palavra de dicionário real (headword), transliteração limpa,
// classe gramatical breve, glosa curta e a definição longa e numerada
// (com HTML já removido na geração).

export type DictionaryEntry = {
  classic: string; // Strong clássico (ex: "H7225", sem sufixo de sentido)
  headword: string; // palavra original tal como aparece no dicionário
  translit: string; // transliteração limpa da forma de dicionário
  pos: string; // classe gramatical breve (ex: "H:N-F")
  gloss: string; // glosa curta em inglês
  def: string; // definição longa em inglês, com HTML já removido
};

type DictionaryFile = Record<string, DictionaryEntry>;

const cache: { hebrew?: DictionaryFile; greek?: DictionaryFile } = {};
const loading: { hebrew?: Promise<DictionaryFile | null>; greek?: Promise<DictionaryFile | null> } = {};

function loadFile(lang: "hebrew" | "greek"): Promise<DictionaryFile | null> {
  if (cache[lang]) return Promise.resolve(cache[lang]!);
  if (loading[lang]) return loading[lang]!;

  const promise = fetch(`/dictionary/${lang}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<DictionaryFile>) : null))
    .then((data) => {
      if (data) cache[lang] = data;
      return data;
    })
    .catch(() => null);

  loading[lang] = promise;
  return promise;
}

// Deriva o Strong clássico (sem sufixo de sentido/instância) a partir do
// Strong estendido usado nos dados da Fase 2. Ex: "H7225G_A" -> "H7225".
export function classicStrongOf(strong: string): string {
  const m = strong.match(/^([HG]\d+)[A-Z]?(_[A-Za-z0-9]+)?$/);
  return m ? m[1] : strong;
}

export async function loadDictionaryEntry(strong: string): Promise<DictionaryEntry | null> {
  const lang = strong.startsWith("H") ? "hebrew" : "greek";
  const file = await loadFile(lang);
  if (!file) return null;
  return file[strong] ?? null;
}

let groupsCache: Record<string, string[]> | null = null;
let groupsPromise: Promise<Record<string, string[]> | null> | null = null;

// Todas as variantes de Strong estendido que compartilham o mesmo Strong
// clássico (ex: H7225 -> ["H7225G", "H7225G_A", "H7225G_B", "H7225H"]) — usado
// pra agregar a contagem/lista de ocorrências no padrão clássico, o mesmo
// que a maioria das ferramentas de estudo bíblico usa.
export function loadClassicGroups(): Promise<Record<string, string[]> | null> {
  if (groupsCache) return Promise.resolve(groupsCache);
  if (groupsPromise) return groupsPromise;

  groupsPromise = fetch("/dictionary/classic-groups.json")
    .then((res) => (res.ok ? (res.json() as Promise<Record<string, string[]>>) : null))
    .then((data) => {
      if (data) groupsCache = data;
      return data;
    })
    .catch(() => null);

  return groupsPromise;
}

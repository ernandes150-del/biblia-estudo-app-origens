// Curadoria manual de um pequeno número de termos centrais, em português.
// Diferente da tradução automática do resto do app, este arquivo é escrito
// à mão, palavra por palavra, só para termos onde a tradução teológica em
// português é padrão e incontroversa (não há ambiguidade de sentido).
// Chave = Strong estendido exato do STEPBible-Data (não o clássico), pra
// não haver erro de correspondência. Cada entrada foi conferida contra o
// dado real do dicionário (public/dictionary/) antes de ser escrita — não
// é tradução automática nem "achismo".
//
// Se uma palavra não está aqui, o app mostra o dicionário original em
// inglês (STEPBible/BDB/Abbott-Smith) — nunca um texto em português
// inventado.

export type CuratedEntry = {
  gloss: string; // sentido curto em português
  note: string; // explicação breve (1-3 frases), fiel ao sentido bíblico do termo
};

const curated: Record<string, CuratedEntry> = {
  H0430G: {
    gloss: "Deus",
    note: "Elohim — forma plural em hebraico usada para o Deus único de Israel (plural de majestade, não de número). Também pode se referir a deuses pagãos ou a seres poderosos, dependendo do contexto.",
  },
  H3068G: {
    gloss: "SENHOR",
    note: "YHWH (o Tetragrama) — o nome próprio do Deus de Israel. Por reverência, a tradição judaica evita pronunciá-lo, lendo em seu lugar 'Adonai' (Senhor); por isso as traduções costumam grafar 'SENHOR' em versalete.",
  },
  H2617A: {
    gloss: "benignidade, lealdade, amor leal",
    note: "Chesed — bondade fiel dentro de uma relação de aliança; mistura amor, lealdade e misericórdia de um jeito que não tem um equivalente único em português.",
  },
  H0157G: {
    gloss: "amar",
    note: "Verbo comum para amor no hebraico bíblico — usado tanto para afeto humano (família, amizade) quanto para o amor de Deus por Israel.",
  },
  H7965G: {
    gloss: "paz",
    note: "Shalom — mais do que ausência de guerra: bem-estar, plenitude, integridade nas relações e na vida.",
  },
  H8451: {
    gloss: "instrução, lei",
    note: "Torá — o termo cobre tanto 'instrução/ensino' quanto 'lei' no sentido jurídico; refere-se tanto aos cinco primeiros livros da Bíblia quanto a mandamentos específicos.",
  },
  H1285: {
    gloss: "aliança, pacto",
    note: "Berit — acordo solene entre duas partes; usado tanto para alianças humanas quanto para as alianças que Deus fez com Israel.",
  },
  H6664G: {
    gloss: "justiça, retidão",
    note: "Tsedeq — o que é correto e justo, seja no julgamento, na conduta ou na relação com Deus.",
  },
  H7225G: {
    gloss: "princípio, começo",
    note: "Reshit — o início ou a parte mais importante de algo; vem da mesma raiz de 'rosh' (cabeça). Em Gênesis 1:1, marca o início de tudo.",
  },
  G0026: {
    gloss: "amor",
    note: "Ágape — o termo grego do Novo Testamento pro amor que se doa, sem depender do mérito de quem é amado; usado especialmente pro amor de Deus e o amor cristão entre irmãos.",
  },
  G3056: {
    gloss: "palavra, verbo",
    note: "Logos — 'palavra' no sentido de pensamento expresso, mensagem ou razão. Em João 1:1, é usado como título para Jesus: o Verbo (a Palavra) que estava com Deus e era Deus.",
  },
  G4102G: {
    gloss: "fé",
    note: "Pistis — confiança, convicção; no Novo Testamento, quase sempre no sentido de fé religiosa em Deus ou em Cristo.",
  },
  G5485: {
    gloss: "graça",
    note: "Charis — favor imerecido; no Novo Testamento, o favor gratuito de Deus para com os seres humanos, sem depender do mérito de quem o recebe.",
  },
  G4991: {
    gloss: "salvação",
    note: "Sotéria — livramento, resgate; no Novo Testamento, usado especialmente para a salvação messiânica e espiritual trazida por Cristo.",
  },
  G4151G: {
    gloss: "espírito",
    note: "Pneuma — também pode significar 'vento' ou 'fôlego'; no Novo Testamento, o sentido mais comum é o espírito humano ou o Espírito Santo.",
  },
  G2222: {
    gloss: "vida",
    note: "Zoé — vida no sentido pleno, distinta de 'bios' (a existência biológica); no Novo Testamento, é usada especialmente para a vida eterna, a vida do Reino de Deus.",
  },
};

export function getCuratedEntry(strong: string | undefined): CuratedEntry | null {
  if (!strong) return null;
  return curated[strong] ?? null;
}

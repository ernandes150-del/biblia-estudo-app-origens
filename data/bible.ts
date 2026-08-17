export type BibleVerse = {
  number: number;
  text: string;
};

export type BibleChapter = {
  number: number;
  verses: BibleVerse[];
};

export type BibleBook = {
  name: string;
  chapters: number;
  testament: "Antigo Testamento" | "Novo Testamento";
  category: string;
  chapterData?: BibleChapter[];
};

export const bibleBooks: BibleBook[] = [
  // =========================
  // ANTIGO TESTAMENTO
  // =========================

  { name: "Gênesis", chapters: 50, testament: "Antigo Testamento", category: "Pentateuco" },
  { name: "Êxodo", chapters: 40, testament: "Antigo Testamento", category: "Pentateuco" },
  { name: "Levítico", chapters: 27, testament: "Antigo Testamento", category: "Pentateuco" },
  { name: "Números", chapters: 36, testament: "Antigo Testamento", category: "Pentateuco" },
  { name: "Deuteronômio", chapters: 34, testament: "Antigo Testamento", category: "Pentateuco" },

  { name: "Josué", chapters: 24, testament: "Antigo Testamento", category: "Históricos" },
  { name: "Juízes", chapters: 21, testament: "Antigo Testamento", category: "Históricos" },
  { name: "Rute", chapters: 4, testament: "Antigo Testamento", category: "Históricos" },
  { name: "1 Samuel", chapters: 31, testament: "Antigo Testamento", category: "Históricos" },
  { name: "2 Samuel", chapters: 24, testament: "Antigo Testamento", category: "Históricos" },
  { name: "1 Reis", chapters: 22, testament: "Antigo Testamento", category: "Históricos" },
  { name: "2 Reis", chapters: 25, testament: "Antigo Testamento", category: "Históricos" },
  { name: "1 Crônicas", chapters: 29, testament: "Antigo Testamento", category: "Históricos" },
  { name: "2 Crônicas", chapters: 36, testament: "Antigo Testamento", category: "Históricos" },
  { name: "Esdras", chapters: 10, testament: "Antigo Testamento", category: "Históricos" },
  { name: "Neemias", chapters: 13, testament: "Antigo Testamento", category: "Históricos" },
  { name: "Ester", chapters: 10, testament: "Antigo Testamento", category: "Históricos" },

  { name: "Jó", chapters: 42, testament: "Antigo Testamento", category: "Poéticos" },
  { name: "Salmos", chapters: 150, testament: "Antigo Testamento", category: "Poéticos" },
  { name: "Provérbios", chapters: 31, testament: "Antigo Testamento", category: "Poéticos" },
  { name: "Eclesiastes", chapters: 12, testament: "Antigo Testamento", category: "Poéticos" },
  { name: "Cânticos", chapters: 8, testament: "Antigo Testamento", category: "Poéticos" },

  { name: "Isaías", chapters: 66, testament: "Antigo Testamento", category: "Profetas Maiores" },
  { name: "Jeremias", chapters: 52, testament: "Antigo Testamento", category: "Profetas Maiores" },
  { name: "Lamentações", chapters: 5, testament: "Antigo Testamento", category: "Profetas Maiores" },
  { name: "Ezequiel", chapters: 48, testament: "Antigo Testamento", category: "Profetas Maiores" },
  { name: "Daniel", chapters: 12, testament: "Antigo Testamento", category: "Profetas Maiores" },

  { name: "Oséias", chapters: 14, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Joel", chapters: 3, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Amós", chapters: 9, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Obadias", chapters: 1, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Jonas", chapters: 4, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Miquéias", chapters: 7, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Naum", chapters: 3, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Habacuque", chapters: 3, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Sofonias", chapters: 3, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Ageu", chapters: 2, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Zacarias", chapters: 14, testament: "Antigo Testamento", category: "Profetas Menores" },
  { name: "Malaquias", chapters: 4, testament: "Antigo Testamento", category: "Profetas Menores" },

  // =========================
  // NOVO TESTAMENTO
  // =========================

  { name: "Mateus", chapters: 28, testament: "Novo Testamento", category: "Evangelhos" },
  { name: "Marcos", chapters: 16, testament: "Novo Testamento", category: "Evangelhos" },
  { name: "Lucas", chapters: 24, testament: "Novo Testamento", category: "Evangelhos" },

  {
    name: "João",
    chapters: 21,
    testament: "Novo Testamento",
    category: "Evangelhos",

    chapterData: [
      {
        number: 1,
        verses: [
          {
            number: 1,
            text: "No princípio era a Palavra, e a Palavra estava com Deus, e a Palavra era Deus.",
          },
          {
            number: 2,
            text: "Ela estava no princípio com Deus.",
          },
          {
            number: 3,
            text: "Todas as coisas foram feitas por meio dela, e sem ela nada do que foi feito se fez.",
          },
          {
            number: 4,
            text: "Nela estava a vida, e a vida era a luz dos homens.",
          },
          {
            number: 5,
            text: "A luz resplandece nas trevas, e as trevas não prevaleceram contra ela.",
          },
          {
            number: 6,
            text: "Houve um homem enviado por Deus, chamado João.",
          },
          {
            number: 7,
            text: "Ele veio como testemunha, para dar testemunho da luz, a fim de que todos cressem por meio dele.",
          },
          {
            number: 8,
            text: "Ele não era a luz, mas veio para dar testemunho da luz.",
          },
          {
            number: 9,
            text: "A verdadeira luz, que ilumina todo ser humano, estava vindo ao mundo.",
          },
        ],
      },
    ],
  },

  { name: "Atos", chapters: 28, testament: "Novo Testamento", category: "Histórico" },

  { name: "Romanos", chapters: 16, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "1 Coríntios", chapters: 16, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "2 Coríntios", chapters: 13, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "Gálatas", chapters: 6, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "Efésios", chapters: 6, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "Filipenses", chapters: 4, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "Colossenses", chapters: 4, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "1 Tessalonicenses", chapters: 5, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "2 Tessalonicenses", chapters: 3, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "1 Timóteo", chapters: 6, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "2 Timóteo", chapters: 4, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "Tito", chapters: 3, testament: "Novo Testamento", category: "Cartas de Paulo" },
  { name: "Filemom", chapters: 1, testament: "Novo Testamento", category: "Cartas de Paulo" },

  { name: "Hebreus", chapters: 13, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "Tiago", chapters: 5, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "1 Pedro", chapters: 5, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "2 Pedro", chapters: 3, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "1 João", chapters: 5, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "2 João", chapters: 1, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "3 João", chapters: 1, testament: "Novo Testamento", category: "Cartas Gerais" },
  { name: "Judas", chapters: 1, testament: "Novo Testamento", category: "Cartas Gerais" },

  { name: "Apocalipse", chapters: 22, testament: "Novo Testamento", category: "Profético" },
];

export function getBook(bookName: string) {
  return bibleBooks.find((book) => book.name === bookName);
}

export function getChapter(bookName: string, chapterNumber: number) {
  const book = getBook(bookName);

  return book?.chapterData?.find(
    (chapter) => chapter.number === chapterNumber
  );
}
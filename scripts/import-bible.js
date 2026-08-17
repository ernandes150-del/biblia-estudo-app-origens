const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(
  process.cwd(),
  "data",
  "bible",
  "fonte"
);

const OUTPUT_FILE = path.join(
  process.cwd(),
  "data",
  "bible",
  "bible.json"
);

// ============================================================
// MAPA DOS 66 LIVROS
// ============================================================

const books = {
  GEN: {
    name: "Gênesis",
    testament: "Antigo Testamento",
    category: "Pentateuco",
    chapters: 50,
  },
  EXO: {
    name: "Êxodo",
    testament: "Antigo Testamento",
    category: "Pentateuco",
    chapters: 40,
  },
  LEV: {
    name: "Levítico",
    testament: "Antigo Testamento",
    category: "Pentateuco",
    chapters: 27,
  },
  NUM: {
    name: "Números",
    testament: "Antigo Testamento",
    category: "Pentateuco",
    chapters: 36,
  },
  DEU: {
    name: "Deuteronômio",
    testament: "Antigo Testamento",
    category: "Pentateuco",
    chapters: 34,
  },

  JOS: {
    name: "Josué",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 24,
  },
  JDG: {
    name: "Juízes",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 21,
  },
  RUT: {
    name: "Rute",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 4,
  },
  "1SA": {
    name: "1 Samuel",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 31,
  },
  "2SA": {
    name: "2 Samuel",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 24,
  },
  "1KI": {
    name: "1 Reis",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 22,
  },
  "2KI": {
    name: "2 Reis",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 25,
  },
  "1CH": {
    name: "1 Crônicas",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 29,
  },
  "2CH": {
    name: "2 Crônicas",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 36,
  },
  EZR: {
    name: "Esdras",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 10,
  },
  NEH: {
    name: "Neemias",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 13,
  },
  EST: {
    name: "Ester",
    testament: "Antigo Testamento",
    category: "Históricos",
    chapters: 10,
  },

  JOB: {
    name: "Jó",
    testament: "Antigo Testamento",
    category: "Poéticos",
    chapters: 42,
  },
  PSA: {
    name: "Salmos",
    testament: "Antigo Testamento",
    category: "Poéticos",
    chapters: 150,
  },
  PRO: {
    name: "Provérbios",
    testament: "Antigo Testamento",
    category: "Poéticos",
    chapters: 31,
  },
  ECC: {
    name: "Eclesiastes",
    testament: "Antigo Testamento",
    category: "Poéticos",
    chapters: 12,
  },
  SNG: {
    name: "Cânticos",
    testament: "Antigo Testamento",
    category: "Poéticos",
    chapters: 8,
  },

  ISA: {
    name: "Isaías",
    testament: "Antigo Testamento",
    category: "Profetas Maiores",
    chapters: 66,
  },
  JER: {
    name: "Jeremias",
    testament: "Antigo Testamento",
    category: "Profetas Maiores",
    chapters: 52,
  },
  LAM: {
    name: "Lamentações",
    testament: "Antigo Testamento",
    category: "Profetas Maiores",
    chapters: 5,
  },
  EZK: {
    name: "Ezequiel",
    testament: "Antigo Testamento",
    category: "Profetas Maiores",
    chapters: 48,
  },
  DAN: {
    name: "Daniel",
    testament: "Antigo Testamento",
    category: "Profetas Maiores",
    chapters: 12,
  },

  HOS: {
    name: "Oséias",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 14,
  },
  JOL: {
    name: "Joel",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 3,
  },
  AMO: {
    name: "Amós",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 9,
  },
  OBA: {
    name: "Obadias",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 1,
  },
  JON: {
    name: "Jonas",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 4,
  },
  MIC: {
    name: "Miquéias",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 7,
  },
  NAM: {
    name: "Naum",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 3,
  },
  HAB: {
    name: "Habacuque",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 3,
  },
  ZEP: {
    name: "Sofonias",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 3,
  },
  HAG: {
    name: "Ageu",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 2,
  },
  ZEC: {
    name: "Zacarias",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 14,
  },
  MAL: {
    name: "Malaquias",
    testament: "Antigo Testamento",
    category: "Profetas Menores",
    chapters: 4,
  },

  MAT: {
    name: "Mateus",
    testament: "Novo Testamento",
    category: "Evangelhos",
    chapters: 28,
  },
  MRK: {
    name: "Marcos",
    testament: "Novo Testamento",
    category: "Evangelhos",
    chapters: 16,
  },
  LUK: {
    name: "Lucas",
    testament: "Novo Testamento",
    category: "Evangelhos",
    chapters: 24,
  },
  JHN: {
    name: "João",
    testament: "Novo Testamento",
    category: "Evangelhos",
    chapters: 21,
  },

  ACT: {
    name: "Atos",
    testament: "Novo Testamento",
    category: "Histórico",
    chapters: 28,
  },

  ROM: {
    name: "Romanos",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 16,
  },
  "1CO": {
    name: "1 Coríntios",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 16,
  },
  "2CO": {
    name: "2 Coríntios",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 13,
  },
  GAL: {
    name: "Gálatas",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 6,
  },
  EPH: {
    name: "Efésios",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 6,
  },
  PHP: {
    name: "Filipenses",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 4,
  },
  COL: {
    name: "Colossenses",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 4,
  },
  "1TH": {
    name: "1 Tessalonicenses",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 5,
  },
  "2TH": {
    name: "2 Tessalonicenses",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 3,
  },
  "1TI": {
    name: "1 Timóteo",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 6,
  },
  "2TI": {
    name: "2 Timóteo",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 4,
  },
  TIT: {
    name: "Tito",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 3,
  },
  PHM: {
    name: "Filemom",
    testament: "Novo Testamento",
    category: "Cartas de Paulo",
    chapters: 1,
  },

  HEB: {
    name: "Hebreus",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 13,
  },
  JAS: {
    name: "Tiago",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 5,
  },
  "1PE": {
    name: "1 Pedro",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 5,
  },
  "2PE": {
    name: "2 Pedro",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 3,
  },
  "1JN": {
    name: "1 João",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 5,
  },
  "2JN": {
    name: "2 João",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 1,
  },
  "3JN": {
    name: "3 João",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 1,
  },
  JUD: {
    name: "Judas",
    testament: "Novo Testamento",
    category: "Cartas Gerais",
    chapters: 1,
  },

  REV: {
    name: "Apocalipse",
    testament: "Novo Testamento",
    category: "Profético",
    chapters: 22,
  },
};

// ============================================================
// LIMPEZA DO TEXTO USFM
// ============================================================

function cleanText(text) {
  let result = text;

  // Remove notas de rodapé
  result = result.replace(/\\f\s.*?\\f\*/gs, "");

  // Remove referências cruzadas
  result = result.replace(/\\x\s.*?\\x\*/gs, "");

  // Remove marcadores de palavras/estilos
  result = result.replace(/\\add\s+/g, "");
  result = result.replace(/\\add\*/g, "");

  result = result.replace(/\\nd\s+/g, "");
  result = result.replace(/\\nd\*/g, "");

  result = result.replace(/\\wj\s+/g, "");
  result = result.replace(/\\wj\*/g, "");

  result = result.replace(/\\qt\s+/g, "");
  result = result.replace(/\\qt\*/g, "");

  result = result.replace(/\\sc\s+/g, "");
  result = result.replace(/\\sc\*/g, "");

  result = result.replace(/\\em\s+/g, "");
  result = result.replace(/\\em\*/g, "");

  result = result.replace(/\\bd\s+/g, "");
  result = result.replace(/\\bd\*/g, "");

  result = result.replace(/\\it\s+/g, "");
  result = result.replace(/\\it\*/g, "");

  // Remove marcadores USFM restantes
  result = result.replace(/\\[a-z0-9]+\*?/gi, "");

  // Remove chaves e caracteres de controle
  result = result.replace(/[{}]/g, "");

  // Corrige espaços
  result = result.replace(/\s+/g, " ");

  return result.trim();
}

// ============================================================
// CONVERTER UM ARQUIVO USFM
// ============================================================

function parseUSFM(filePath, bookInfo) {
  const content = fs.readFileSync(filePath, "utf8");

  const chapters = {};

  let currentChapter = null;
  let currentVerse = null;

  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    // Capítulo
    const chapterMatch = trimmed.match(/^\\c\s+(\d+)/);

    if (chapterMatch) {
      currentChapter = Number(chapterMatch[1]);

      if (!chapters[currentChapter]) {
        chapters[currentChapter] = {};
      }

      currentVerse = null;
      continue;
    }

    // Versículo
    const verseMatch = trimmed.match(/^\\v\s+(\d+)(?:-\d+)?\s+(.*)$/);

    if (verseMatch) {
      if (currentChapter === null) {
        continue;
      }

      currentVerse = Number(verseMatch[1]);

      const text = cleanText(verseMatch[2]);

      chapters[currentChapter][currentVerse] = text;

      continue;
    }

    // Continuação de um versículo
    if (
      currentChapter !== null &&
      currentVerse !== null &&
      !trimmed.startsWith("\\")
    ) {
      const continuation = cleanText(trimmed);

      if (continuation) {
        chapters[currentChapter][currentVerse] +=
          " " + continuation;
      }
    }
  }

  return {
    name: bookInfo.name,
    testament: bookInfo.testament,
    category: bookInfo.category,
    chapters: bookInfo.chapters,
    chapterData: chapters,
  };
}

// ============================================================
// EXECUÇÃO
// ============================================================

console.log("");
console.log("==============================================");
console.log(" BÍBLIA LIVRE → JSON");
console.log("==============================================");
console.log("");

if (!fs.existsSync(SOURCE_DIR)) {
  console.error("Pasta fonte não encontrada:");
  console.error(SOURCE_DIR);
  process.exit(1);
}

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((file) => file.toLowerCase().endsWith(".usfm"));

console.log(`Arquivos USFM encontrados: ${files.length}`);
console.log("");

const result = {
  translation: {
    name: "Bíblia Livre",
    abbreviation: "BL",
    language: "pt-BR",
    year: 2018,
    license: "CC BY 4.0",
    source: "eBible.org",
  },
  books: {},
};

let processed = 0;

for (const file of files) {
  const match = file.match(/^\d+-([A-Z0-9]+)porbr2018\.usfm$/i);

  if (!match) {
    console.log(`Ignorando arquivo: ${file}`);
    continue;
  }

  const code = match[1].toUpperCase();

  const bookInfo = books[code];

  if (!bookInfo) {
    console.log(`Livro não mapeado: ${code}`);
    continue;
  }

  const filePath = path.join(SOURCE_DIR, file);

  console.log(`Convertendo: ${bookInfo.name}`);

  result.books[bookInfo.name] = parseUSFM(
    filePath,
    bookInfo
  );

  processed++;
}

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log("");
console.log("==============================================");
console.log(" CONVERSÃO CONCLUÍDA");
console.log("==============================================");
console.log("");
console.log(`Livros convertidos: ${processed}`);
console.log(`Arquivo criado: ${OUTPUT_FILE}`);
console.log("");
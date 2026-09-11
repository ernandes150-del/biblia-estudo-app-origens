import greekCodes from "../data/morph-greek-en.json";
import hebrewCodes from "../data/morph-hebrew-en.json";
import terms from "../data/morph-terms-pt.json";

// Decodifica os códigos gramaticais que já vêm nos dados do léxico (Fase 2)
// para frases legíveis em português. As tabelas em app/data/morph-*-en.json
// foram extraídas dos arquivos oficiais de referência do STEPBible-Data
// (TEGMC e TEHMC, CC BY 4.0) — não são inventadas. A tradução para português
// é feita palavra a palavra a partir de um dicionário fechado de ~150 termos
// gramaticais (app/data/morph-terms-pt.json); um termo sem tradução
// cadastrada aparece em inglês, nunca é omitido silenciosamente.

const greekMap: Record<string, string> = greekCodes;
const hebrewMap: Record<string, string> = hebrewCodes;
const dict: Record<string, string> = terms;

function translatePhrase(phrase: string): string {
  // Substitui cada palavra (mesmo dentro de parênteses/vírgulas, e formas
  // como "3rd"/"1st") pela tradução conhecida; o que não está no
  // dicionário permanece em inglês.
  return phrase.replace(/[A-Za-zÀ-ÿ]+[0-9]*|[0-9]+[A-Za-zÀ-ÿ]+/g, (word) => dict[word] ?? word);
}

// Recebe o código de morfologia como vem no léxico (ex: "N-NSF" para grego,
// "HTd/Ncmsa" para hebraico) e devolve uma descrição em português.
// O idioma deve ser informado pelo chamador sempre que souber (ex: a partir
// do prefixo do Strong, "H" ou "G") — a heurística abaixo é só um fallback.
export function decodeMorphology(morph: string | undefined, language?: "hebrew" | "greek"): string {
  if (!morph) return "";

  // Nenhum código grego (Robinson) começa com "H"; isso é suficiente como
  // fallback quando o idioma não é informado explicitamente pelo chamador.
  const isHebrew = language === "hebrew" || (language !== "greek" && morph.startsWith("H"));

  if (!isHebrew) {
    const phrase = greekMap[morph];
    return phrase ? translatePhrase(phrase) : morph;
  }

  // Hebraico/aramaico: código composto separado por "/", só o primeiro
  // segmento carrega o prefixo de idioma (H ou A); os demais reaproveitam
  // o mesmo prefixo do primeiro para a busca na tabela.
  const segments = morph.split("/").filter(Boolean);
  if (segments.length === 0) return morph;

  const langPrefix = segments[0][0]; // "H" ou "A"
  const parts: string[] = [];
  for (const seg of segments) {
    const key = /^[HA]/.test(seg) ? seg : `${langPrefix}${seg}`;
    const phrase = hebrewMap[key];
    parts.push(phrase ? translatePhrase(phrase) : seg);
  }
  return parts.join(" + ");
}

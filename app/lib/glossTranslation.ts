import dict from "../data/gloss-dict-pt.json";

// Traduz a glosa contextual (o sentido daquela palavra específica naquele
// versículo, como vem do STEPBible-Data) usando um dicionário fechado de
// ~800 termos ingleses mais frequentes no corpus (cobre ~88% das instâncias).
//
// Importante: a tradução é tudo-ou-nada por frase. Traduzir só as palavras
// conhecidas e deixar o resto em inglês produzia frases misturadas
// (ex: "e/ ele disse") que pareciam bug, não tradução parcial legítima.
// Se alguma palavra da glosa não está no dicionário, devolvemos a glosa
// original inteira em inglês (marcada como tal pelo chamador) em vez de
// uma mistura de idiomas.
const D: Record<string, string> = dict;

export type GlossTranslation = { text: string; translated: boolean };

// Separa uma glosa composta (prefixo hebraico + palavra núcleo, como vem do
// STEPBible: "in/ beginning") no sentido do núcleo e no sentido do prefixo.
// Quando não há "/", a glosa inteira é o núcleo.
export function splitCompoundGloss(gloss: string): { core: string; prefix?: string } {
  const idx = gloss.lastIndexOf("/");
  if (idx === -1) return { core: gloss };
  return { prefix: gloss.slice(0, idx).trim(), core: gloss.slice(idx + 1).trim() };
}

export function translateGloss(gloss: string | undefined): GlossTranslation {
  if (!gloss) return { text: "", translated: true };

  let allKnown = true;
  const text = gloss.replace(/[A-Za-z']+/g, (word) => {
    const lower = word.toLowerCase();
    const pt = D[lower];
    if (!pt) {
      allKnown = false;
      return word;
    }
    if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
      return pt.charAt(0).toUpperCase() + pt.slice(1);
    }
    return pt;
  });

  return allKnown ? { text, translated: true } : { text: gloss, translated: false };
}


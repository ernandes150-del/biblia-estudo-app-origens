import dict from "../data/gloss-dict-pt.json";

// Traduz a glosa contextual (o sentido daquela palavra específica naquele
// versículo, como vem do STEPBible-Data) usando um dicionário fechado de
// ~800 termos ingleses mais frequentes no corpus (cobre ~88% das instâncias).
// Uma palavra fora do dicionário permanece em inglês — preferimos isso a
// arriscar uma tradução inventada num app de estudo sério.
const D: Record<string, string> = dict;

export function translateGloss(gloss: string | undefined): string {
  if (!gloss) return "";
  return gloss.replace(/[A-Za-z']+/g, (word) => {
    const lower = word.toLowerCase();
    const pt = D[lower];
    if (!pt) return word;
    // Preserva capitalização inicial quando o original começava maiúsculo.
    if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
      return pt.charAt(0).toUpperCase() + pt.slice(1);
    }
    return pt;
  });
}

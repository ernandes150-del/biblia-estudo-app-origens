// Limpa a transliteração bruta do STEPBible-Data para exibição.
// O formato da fonte usa "." para separar sílabas, "/" para separar
// morfemas (prefixo do radical) e maiúscula na sílaba tônica — útil como
// dado linguístico bruto, mas ilegível como texto de interface (ex:
// "be./re.Shit"). Convertemos tudo para minúsculas com "·" separando
// sílabas, no mesmo estilo usado por referências bíblicas em português.
export function formatTranslit(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/[./]+/g, "·")
    .replace(/^·+|·+$/g, "")
    .toLowerCase();
}

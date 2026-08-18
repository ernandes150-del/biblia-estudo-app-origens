import type { InterlinearWord } from "../types";

// --- MOTORES DE TRANSLITERAÇÃO ---
// Usados hoje apenas para gerar a transliteração de novas entradas de REAL_LEXICON
// manualmente (ver histórico). Mantidos aqui para reaproveitamento quando o
// léxico real for expandido (Fase 2).
export const transliterateHebrew = (text: string): string => {
  const map: Record<string, string> = {
    'א': "'", 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
    'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
    'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'p',
    'צ': 'tz', 'ץ': 'tz', 'ק': 'q', 'ר': 'r', 'ש': 'sh', 'ת': 't',
    'ָ': 'a', 'ַ': 'a', 'ֶ': 'e', 'ֵ': 'e', 'ִ': 'i', 'ֹ': 'o', 'ֻ': 'u', 'ְ': 'e'
  };
  return text.split('').map(char => map[char] || '').join('') || "dabar";
};

export const transliterateGreek = (text: string): string => {
  const map: Record<string, string> = {
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'ē',
    'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x',
    'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y',
    'φ': 'ph', 'χ': 'ch', 'ψ': 'ps', 'ω': 'ō'
  };
  return text.split('').map(char => map[char] || char).join('') || "logos";
};

// --- BASE DE DADOS LÉXICA REAL ---
// Cada chave é "Livro-Capítulo-Versículo". Só versículos cadastrados aqui recebem
// análise interlinear (Strong's, gramática, morfologia). Não inventamos análise
// para versículos fora desta lista — ver getInterlinearWords em app/page.tsx.
export const REAL_LEXICON: Record<string, InterlinearWord[]> = {
  "Gênesis-1-1": [
    { translation: "No princípio", original: "בְּרֵאשִׁית", translit: "Bereshit", strong: "H7225", grammar: "Substantivo + Preposição", morphology: "Prep. בְּ (em) + Subst. fem. sing. constructo", meaning: "No início, no começo, a primeira parte de uma série temporal ou criação." },
    { translation: "criou", original: "בָּרָא", translit: "Bara", strong: "H1254", grammar: "Verbo (Qal Perf. 3ms)", morphology: "Qal Perfeito, 3ª pessoa masc. singular", meaning: "Criar, moldar, fazer (criação divina ex nihilo)." },
    { translation: "Deus", original: "אֱלֹהִים", translit: "Elohim", strong: "H430", grammar: "Substantivo Masculino Plural", morphology: "Subst. masc. plural majestático", meaning: "Deus Supremo, Criador e Juiz de toda a terra." },
    { translation: "os", original: "אֵת", translit: "'Et", strong: "H853", grammar: "Partícula de Acusativo", morphology: "Sinal de objeto direto definido", meaning: "Marcador gramatical de objeto direto sem tradução literal." },
    { translation: "céus", original: "הַשָּׁמַיִם", translit: "Hashamayim", strong: "H8064", grammar: "Substantivo Dual/Plural com Artigo", morphology: "Artigo הַ + Subst. masc. dual/plural", meaning: "Céus, firmamento, abóbada celeste e espaço." },
    { translation: "e a", original: "וְאֵת", translit: "Ve'et", strong: "H853", grammar: "Conjunção + Acusativo", morphology: "Conj. וְ (e) + Marcador de acusativo", meaning: "E (conjunção aditiva com marcador de objeto)." },
    { translation: "terra.", original: "הָאָרֶץ", translit: "Ha'aretz", strong: "H776", grammar: "Substantivo Feminino com Artigo", morphology: "Artigo הָ + Subst. fem. singular", meaning: "Terra, solo, mundo habitável, criação terrestre." }
  ],
  "João-1-1": [
    { translation: "No", original: "Ἐν", translit: "En", strong: "G1722", grammar: "Preposição", morphology: "Prep. com caso Dativo", meaning: "Em, dentro de, no tempo de." },
    { translation: "princípio", original: "ἀρχῇ", translit: "Archē", strong: "G746", grammar: "Substantivo Feminino Dativo", morphology: "Subst. fem. sing. dativo", meaning: "Princípio, origem, causa primária, a base do tempo." },
    { translation: "era", original: "ἦν", translit: "ēn", strong: "G2258", grammar: "Verbo (Imperfeito Ativo)", morphology: "Imperfeito indicativo 3ª sing. (Eimi)", meaning: "Existia continuamente, permanência preexistente." },
    { translation: "o", original: "ὁ", translit: "ho", strong: "G3588", grammar: "Artigo Definido", morphology: "Artigo masc. sing. nominativo", meaning: "O." },
    { translation: "Verbo,", original: "Λόγος", translit: "Logos", strong: "G3056", grammar: "Substantivo Masculino Nominativo", morphology: "Subst. masc. sing. nominativo", meaning: "Palavra, expressão, revelação divinamente encarnada." },
    { translation: "e", original: "καὶ", translit: "kai", strong: "G2532", grammar: "Conjunção", morphology: "Conjunção aditiva", meaning: "E, também, da mesma forma." },
    { translation: "o", original: "ὁ", translit: "ho", strong: "G3588", grammar: "Artigo Definido", morphology: "Artigo masc. sing. nominativo", meaning: "O." },
    { translation: "Verbo", original: "Λόγος", translit: "Logos", strong: "G3056", grammar: "Substantivo Masculino", morphology: "Subst. masc. sing. nominativo", meaning: "O Verbo, a segunda pessoa da Trindade." },
    { translation: "estava", original: "ἦν", translit: "ēn", strong: "G2258", grammar: "Verbo", morphology: "Imperfeito indicativo 3ª sing.", meaning: "Estava em comunhão íntima com." },
    { translation: "com", original: "πρὸς", translit: "pros", strong: "G4314", grammar: "Preposição Acusativo", morphology: "Prep. indicando orientação face a face", meaning: "Com, em direção a, face a face com." },
    { translation: "Deus,", original: "τὸν Θεόν", translit: "ton Theon", strong: "G2316", grammar: "Substantivo Acusativo", morphology: "Artigo + Subst. masc. sing. acusativo", meaning: "Deus, o Pai." },
    { translation: "e", original: "καὶ", translit: "kai", strong: "G2532", grammar: "Conjunção", morphology: "Conjunção", meaning: "E." },
    { translation: "Deus", original: "Θεὸς", translit: "Theos", strong: "G2316", grammar: "Substantivo Nominativo Predicativo", morphology: "Subst. masc. sing. nominativo", meaning: "Deus em sua essência e natureza divina." },
    { translation: "era", original: "ἦν", translit: "ēn", strong: "G2258", grammar: "Verbo", morphology: "Imperfeito indicativo 3ª sing.", meaning: "Era." },
    { translation: "o", original: "ὁ", translit: "ho", strong: "G3588", grammar: "Artigo Definido", morphology: "Artigo", meaning: "O." },
    { translation: "Verbo.", original: "Λόγος", translit: "Logos", strong: "G3056", grammar: "Substantivo Masculino", morphology: "Subst. masc. sing. nominativo", meaning: "O Verbo." }
  ],
  "Mateus-3-15": [
    { translation: "Jesus,", original: "Ἰησοῦς", translit: "Iēsous", strong: "G2424", grammar: "Substantivo", morphology: "Subst. masc. sing.", meaning: "Jesus, o Salvador." },
    { translation: "porém,", original: "δὲ", translit: "de", strong: "G1161", grammar: "Conjunção", morphology: "Conj. adversativa", meaning: "Mas, porém." },
    { translation: "respondeu-lhe:", original: "ἀποκριθεὶς", translit: "apokritheis", strong: "G611", grammar: "Verbo Particípio", morphology: "Aoristo passivo nominativo", meaning: "Respondendo." },
    { translation: "Deixa", original: "Ἄφες", translit: "Aphes", strong: "G863", grammar: "Verbo Imperativo", morphology: "Aoristo ativo 2ª sing.", meaning: "Permita, deixa agora.", isJesusWords: true },
    { translation: "por", original: "ἄρτι", translit: "arti", strong: "G737", grammar: "Advérbio", morphology: "Adv. de tempo", meaning: "Agora, neste momento.", isJesusWords: true },
    { translation: "enquanto,", original: "οὕτω", translit: "houtō", strong: "G3779", grammar: "Advérbio", morphology: "Adv. modo", meaning: "Assim.", isJesusWords: true },
    { translation: "porque", original: "γὰρ", translit: "gar", strong: "G1063", grammar: "Conjunção", morphology: "Conj. explicativa", meaning: "Pois, porque.", isJesusWords: true },
    { translation: "assim", original: "πρέπον", translit: "prepon", strong: "G4241", grammar: "Verbo Particípio", morphology: "Presente ativo neutro", meaning: "É conveniente, apropriado.", isJesusWords: true },
    { translation: "nos", original: "ἡμῖν", translit: "hēmin", strong: "G2254", grammar: "Pronome Pessoal", morphology: "Dativo plural 1ª pessoa", meaning: "A nós.", isJesusWords: true },
    { translation: "convém", original: "ἐστὶν", translit: "estin", strong: "G2076", grammar: "Verbo Indicativo", morphology: "Presente ativo 3ª sing.", meaning: "É.", isJesusWords: true },
    { translation: "cumprir", original: "πληρῶσαι", translit: "plērōsai", strong: "G4137", grammar: "Verbo Infinitivo", morphology: "Aoristo ativo", meaning: "Preencher, cumprir plenamente.", isJesusWords: true },
    { translation: "toda", original: "πᾶσαν", translit: "pasan", strong: "G3956", grammar: "Adjetivo", morphology: "Acusativo fem. sing.", meaning: "Toda a.", isJesusWords: true },
    { translation: "a", original: "τὴν", translit: "tēn", strong: "G3588", grammar: "Artigo", morphology: "Acusativo fem. sing.", meaning: "A.", isJesusWords: true },
    { translation: "justiça.", original: "δικαιοσύνην", translit: "dikaiosynēn", strong: "G1343", grammar: "Substantivo", morphology: "Acusativo fem. sing.", meaning: "Justiça, retidão divina.", isJesusWords: true }
  ]
};

// Retorna a análise palavra-por-palavra APENAS quando existe léxico real cadastrado
// para o versículo. Não fabricamos números de Strong, gramática ou morfologia para
// versículos sem dado real — isso induziria o usuário a erro num app de estudo exegético.
export const getInterlinearWords = (verseKey: string): InterlinearWord[] | null => {
  return REAL_LEXICON[verseKey] || null;
};

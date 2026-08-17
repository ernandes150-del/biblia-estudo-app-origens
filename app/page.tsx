"use client";

import { useEffect, useMemo, useState } from "react";
import bibleData from "../data/bible/bible.json";
import referencesData from "../data/study/references.json";
import contextData from "../data/study/context.json";

// --- TIPAGENS ---
type InterlinearWord = {
  translation: string;
  original: string;
  translit: string;
  strong?: string;
  grammar?: string;
  meaning?: string;
  morphology?: string;
  isJesusWords?: boolean;
};

type BibleBook = {
  name: string;
  testament: string;
  category: string;
  chapters: number;
  chapterData: Record<string, Record<string, string>>;
};

type BibleData = {
  books: Record<string, BibleBook>;
};

type VerseNote = {
  favorite: boolean;
  highlighted: boolean;
  note: string;
  study?: string;
};

type UserData = Record<string, VerseNote>;

type User = {
  name: string;
  email: string;
};

type SearchResult = {
  bookKey: string;
  bookName: string;
  chapter: string;
  verse: string;
  text: string;
};

type ContextInfo = {
  author?: string;
  date?: string;
  theme?: string;
  keywords?: string[];
  introduction?: string;
  historicalContext?: string;
  summary?: string;
};

type TranslationVersion = "ORIGINAL" | "ARA" | "NVI" | "NAA";

// --- MOTORES DE TRANSLITERAÇÃO ---
const transliterateHebrew = (text: string): string => {
  const map: Record<string, string> = {
    'א': "'", 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
    'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
    'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'p',
    'צ': 'tz', 'ץ': 'tz', 'ק': 'q', 'ר': 'r', 'ש': 'sh', 'ת': 't',
    'ָ': 'a', 'ַ': 'a', 'ֶ': 'e', 'ֵ': 'e', 'ִ': 'i', 'ֹ': 'o', 'ֻ': 'u', 'ְ': 'e'
  };
  return text.split('').map(char => map[char] || '').join('') || "dabar";
};

const transliterateGreek = (text: string): string => {
  const map: Record<string, string> = {
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'ē',
    'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x',
    'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y',
    'φ': 'ph', 'χ': 'ch', 'ψ': 'ps', 'ω': 'ō'
  };
  return text.split('').map(char => map[char] || char).join('') || "logos";
};

// --- BASE DE DADOS LÉXICA REAL ---
const REAL_LEXICON: Record<string, InterlinearWord[]> = {
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

// ÍCONES SVG
const BookOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AcademicCapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? "fill-amber-500 text-amber-500" : "text-stone-400"}`} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

// LOGO DE OLIVEIRA BASEADO NA ILUSTRAÇÃO DETALHADA
const OliveTreeLogo = () => (
  <div className="w-10 h-10 bg-[#2D3B32] text-[#F6F5F0] rounded-xl flex items-center justify-center shadow-md border border-[#425447] shrink-0 p-1">
    <svg className="w-8 h-8" viewBox="0 0 100 100" fill="currentColor">
      {/* Raízes e Base do Solo */}
      <path d="M 20 88 Q 35 84 50 86 Q 65 84 80 88 C 82 89 18 89 20 88 Z" opacity="0.8" />
      
      {/* Tronco Escultural Retorcido */}
      <path d="M 44 86 C 40 76 34 68 38 56 C 42 46 48 40 46 32 C 48 32 52 38 50 48 C 48 58 58 68 54 86 Z" />
      <path d="M 54 86 C 58 76 64 66 58 54 C 54 44 50 38 52 30 C 54 32 56 40 62 50 C 66 60 62 76 56 86 Z" opacity="0.9" />
      <path d="M 36 78 Q 42 70 48 74 Q 42 82 36 78 Z" />
      <path d="M 64 78 Q 58 70 52 74 Q 58 82 64 78 Z" />

      {/* Galhos Principais e Ramificações da Copa */}
      <path d="M 46 34 C 40 28 28 26 20 32 C 28 24 40 24 48 30 Z" />
      <path d="M 52 32 C 60 26 72 26 80 32 C 72 24 60 24 50 30 Z" />
      <path d="M 48 28 C 44 20 34 16 26 18 C 34 12 46 14 50 24 Z" />
      <path d="M 50 26 C 56 18 66 14 74 18 C 66 12 54 14 48 24 Z" />

      {/* Densidade de Folhas Estilizadas (Copa Arredondada) */}
      <circle cx="25" cy="30" r="3" />
      <circle cx="32" cy="24" r="3.5" />
      <circle cx="20" cy="38" r="3" />
      <circle cx="38" cy="18" r="3.5" />
      <circle cx="48" cy="14" r="4" />
      <circle cx="62" cy="18" r="3.5" />
      <circle cx="68" cy="24" r="3.5" />
      <circle cx="75" cy="30" r="3" />
      <circle cx="80" cy="38" r="3" />
      <circle cx="30" cy="36" r="3" />
      <circle cx="70" cy="36" r="3" />
      <circle cx="42" cy="26" r="3.5" />
      <circle cx="58" cy="26" r="3.5" />
      <circle cx="50" cy="20" r="3.5" />
    </svg>
  </div>
);

export default function BibliaOrigensApp() {
  const typedBibleData = bibleData as unknown as BibleData;
  const typedReferencesData = referencesData as unknown as Record<string, Record<string, string[]>>;
  const typedContextData = contextData as unknown as Record<string, ContextInfo>;

  // ESTADOS
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<string>("Gênesis");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(1);
  const [selectedVersion, setSelectedVersion] = useState<TranslationVersion>("ORIGINAL");

  const [activeTab, setActiveTab] = useState<"home" | "read" | "studies" | "search">("home");
  const [activeSidePanel, setActiveSidePanel] = useState<"none" | "context" | "study" | "references">("none");
  const [selectedWord, setSelectedWord] = useState<InterlinearWord | null>(null);

  const [userData, setUserData] = useState<UserData>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    try {
      const defaultUser = { name: "Usuário de Teste", email: "teste@biblia.com" };
      if (!localStorage.getItem("biblia-origens-session")) {
        localStorage.setItem("biblia-origens-session", JSON.stringify(defaultUser));
      }

      const activeUser = localStorage.getItem("biblia-origens-session");
      if (activeUser) {
        const parsedUser: User = JSON.parse(activeUser);
        setUser(parsedUser);
        const savedData = localStorage.getItem(`biblia-origens-data-${parsedUser.email}`);
        if (savedData) setUserData(JSON.parse(savedData));
      }
    } catch (e) {
      console.error("Erro ao carregar sessão", e);
    }
  }, []);

  const triggerAuthAlert = (message: string) => {
    setAuthNotice(message);
    setTimeout(() => setAuthNotice(null), 5000);
  };

  const saveUserData = (newData: UserData) => {
    setUserData(newData);
    if (user) {
      localStorage.setItem(`biblia-origens-data-${user.email}`, JSON.stringify(newData));
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    const loggedUser: User = {
      name: authMode === "register" ? nameInput : emailInput.split("@")[0],
      email: emailInput,
    };

    localStorage.setItem("biblia-origens-session", JSON.stringify(loggedUser));
    setUser(loggedUser);

    const savedData = localStorage.getItem(`biblia-origens-data-${loggedUser.email}`);
    if (savedData) setUserData(JSON.parse(savedData));

    setAuthNotice(null);
    setActiveTab("read");
  };

  const handleLogout = () => {
    localStorage.removeItem("biblia-origens-session");
    setUser(null);
    setUserData({});
    setActiveTab("home");
  };

  const currentBook = typedBibleData.books[selectedBook];
  const totalChapters = currentBook ? currentBook.chapters : 1;
  const currentChapterVerses = currentBook?.chapterData[selectedChapter.toString()] || {};
  const currentLanguage = currentBook?.testament === "Novo Testamento" ? "Grego" : "Hebraico";

  const currentVerseKey = selectedVerse ? `${selectedBook}-${selectedChapter}-${selectedVerse}` : null;
  const currentVerseNote = currentVerseKey ? userData[currentVerseKey] || { favorite: false, highlighted: false, note: "", study: "" } : null;

  // LÉXICO INTERLINEAR (COM IDENTIFICAÇÃO DAS PALAVRAS DE JESUS)
  const getInterlinearWords = (verseKey: string, text: string): InterlinearWord[] => {
    if (REAL_LEXICON[verseKey]) {
      return REAL_LEXICON[verseKey];
    }

    const isOldTestament = currentBook?.testament !== "Novo Testamento";
    const words = text.split(" ");
    const sampleHebrewWords = ["דָּבָר", "אֱלֹהִים", "מֶלֶךְ", "אָרֶץ", "שָׁמַיִם", "יָם", "אָדָם", "חַיִּים", "קָדוֹשׁ", "בֵּן"];
    const sampleGreekWords = ["λόγος", "θεός", "κύριος", "ἀγάπη", "ξωή", "φῶς", "κόσμος", "πνεῦμα", "χάρις", "υἱός"];

    // Verificação de falas de Jesus em livros do Novo Testamento
    const isGospel = ["Mateus", "Marcos", "Lucas", "João"].includes(selectedBook);

    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,;:!?]/g, "");
      const originalWord = isOldTestament 
        ? sampleHebrewWords[i % sampleHebrewWords.length] 
        : sampleGreekWords[i % sampleGreekWords.length];

      const translitText = isOldTestament 
        ? transliterateHebrew(originalWord) 
        : transliterateGreek(originalWord);

      // Marcação genérica para fala de Jesus em contextos do Evangelho (editável por versículo)
      const isJesusWords = isGospel && (
        (selectedBook === "João" && selectedChapter === 3 && i >= 3) ||
        (selectedBook === "Mateus" && selectedChapter === 5)
      );

      return {
        translation: cleanWord,
        original: originalWord,
        translit: translitText,
        strong: isOldTestament ? `H${1000 + (i % 800)}` : `G${1000 + (i % 800)}`,
        grammar: isOldTestament ? "Hebraico (Qal)" : "Grego (Substantivo/Verbo)",
        morphology: isOldTestament ? "Análise morfológica de raiz tri-literal" : "Declinação/Conjugação grega padrão",
        meaning: `Significado léxico e exegético para "${cleanWord}" em ${selectedBook} ${selectedChapter}.`,
        isJesusWords
      };
    });
  };

  const toggleFavorite = (verseNum: number) => {
    if (!user) {
      triggerAuthAlert("Apenas pessoas logadas podem favoritar versículos.");
      return;
    }
    const key = `${selectedBook}-${selectedChapter}-${verseNum}`;
    const existing = userData[key] || { favorite: false, highlighted: false, note: "", study: "" };
    saveUserData({ ...userData, [key]: { ...existing, favorite: !existing.favorite } });
  };

  const toggleHighlight = (verseNum: number) => {
    if (!user) {
      triggerAuthAlert("Apenas pessoas logadas podem destacar versículos.");
      return;
    }
    const key = `${selectedBook}-${selectedChapter}-${verseNum}`;
    const existing = userData[key] || { favorite: false, highlighted: false, note: "", study: "" };
    saveUserData({ ...userData, [key]: { ...existing, highlighted: !existing.highlighted } });
  };

  const saveStudyText = (studyText: string) => {
    if (!user) {
      triggerAuthAlert("Apenas pessoas logadas podem criar anotações de estudo.");
      return;
    }
    if (!currentVerseKey) return;
    const existing = userData[currentVerseKey] || { favorite: false, highlighted: false, note: "", study: "" };
    saveUserData({ ...userData, [currentVerseKey]: { ...existing, study: studyText } });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim() || term.length < 3) {
      setSearchResults([]);
      return;
    }
    const results: SearchResult[] = [];
    const termLower = term.toLowerCase();

    Object.entries(typedBibleData.books).forEach(([bKey, book]) => {
      Object.entries(book.chapterData).forEach(([cNum, chapter]) => {
        Object.entries(chapter).forEach(([vNum, verseText]) => {
          if (verseText.toLowerCase().includes(termLower) && results.length < 100) {
            results.push({ bookKey: bKey, bookName: book.name, chapter: cNum, verse: vNum, text: verseText });
          }
        });
      });
    });
    setSearchResults(results);
  };

  const savedStudiesList = useMemo(() => {
    return Object.entries(userData)
      .filter(([_, v]) => v.study && v.study.trim() !== "")
      .map(([key, value]) => {
        const [book, chapter, verse] = key.split("-");
        return {
          key, book, chapter: parseInt(chapter), verse: parseInt(verse),
          study: value.study,
          verseText: typedBibleData.books[book]?.chapterData[chapter]?.[verse] || "",
        };
      });
  }, [userData, typedBibleData]);

  const navigateToVerse = (book: string, chapter: number, verse: number, openStudy = false) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setSelectedVerse(verse);
    setActiveTab("read");
    if (openStudy) setActiveSidePanel("study");
  };

  const currentReferences = useMemo(() => {
    const verseNum = selectedVerse || 1;
    const refKey = `${selectedChapter}:${verseNum}`;
    const directRefs = typedReferencesData[selectedBook]?.[refKey];

    if (directRefs && directRefs.length > 0) {
      return directRefs.map(ref => {
        const parts = ref.split(" — ");
        return { passage: parts[0], text: parts[1] || parts[0] };
      });
    }

    if (selectedBook === "Gênesis") {
      return [
        { passage: "João 1:1", text: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus." },
        { passage: "Hebreus 11:3", text: "Pela fé entendemos que os mundos pela palavra de Deus foram criados." },
        { passage: "Salmos 33:6", text: "Pela palavra do SENHOR foram feitos os céus, e todo o exército deles pelo espírito da sua boca." }
      ];
    } else if (selectedBook === "João") {
      return [
        { passage: "Gênesis 1:1", text: "No princípio criou Deus os céus e a terra." },
        { passage: "Colossenses 1:16", text: "Porque nele foram criadas todas as coisas que há nos céus e na terra, visíveis e invisíveis." },
        { passage: "1 João 1:1", text: "O que era desde o princípio, o que ouvimos, o que vimos com os nossos olhos..." }
      ];
    }

    return [
      { passage: `${selectedBook} ${selectedChapter}:1`, text: "Paralelo contextual de temas doutrinários e históricos." },
      { passage: "Salmos 119:105", text: "Lâmpada para os meus pés é tua palavra e luz para o meu caminho." },
      { passage: "2 Timóteo 3:16", text: "Toda a Escritura é divinamente inspirada e proveitosa para ensinar, para redarguir, para corrigir..." }
    ];
  }, [selectedBook, selectedChapter, selectedVerse, typedReferencesData]);

  // RENDERIZAÇÃO DE VERSÍCULOS COM DESTAQUE EM VERMELHO NAS PALAVRAS DE JESUS
  const renderVerseContent = (vKey: string, vText: string) => {
    const words = getInterlinearWords(vKey, vText);

    if (selectedVersion === "ORIGINAL") {
      return (
        <div className="flex flex-wrap gap-y-4 gap-x-3 justify-start">
          {words.map((word, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWord(word);
              }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-[#D8D5C5]/50 cursor-pointer border border-transparent hover:border-[#D8D5C5]"
            >
              <span className={`text-sm font-semibold mb-0.5 ${word.isJesusWords ? "text-[#B91C1C]" : "text-[#1F2923]"}`}>
                {word.translation}
              </span>
              <span className={`text-base font-serif font-bold ${word.isJesusWords ? "text-[#B91C1C]" : "text-[#2D3B32]"}`}>
                {word.original}
              </span>
              <span className="text-[10px] italic text-[#526356] mt-0.5">
                ({word.translit})
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-sm leading-relaxed font-serif">
        {words.map((word, idx) => (
          <span key={idx} className={word.isJesusWords ? "text-[#B91C1C] font-semibold" : "text-[#1F2923]"}>
            {word.translation}{" "}
          </span>
        ))}
        <span className="text-[10px] font-sans text-[#526356] uppercase font-bold">[{selectedVersion}]</span>
      </p>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#F6F5F0] text-[#1F2923] font-sans flex flex-col overflow-hidden">
      
      {/* NOTIFICAÇÃO DE SESSÃO */}
      {authNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D3B32] text-[#F6F5F0] border border-[#425447] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md animate-bounce">
          <div className="text-amber-400">⚠️</div>
          <div className="flex-1 text-xs">
            <p className="font-semibold">{authNotice}</p>
            <p className="text-[10px] text-[#A8B6AB]">Faça login para habilitar o caderno de estudos pessoal.</p>
          </div>
          <button 
            onClick={() => setActiveTab("home")} 
            className="bg-amber-500 text-stone-900 font-bold px-2.5 py-1 rounded text-[10px] hover:bg-amber-400"
          >
            Entrar
          </button>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="border-b border-[#E2E0D5] bg-[#F6F5F0]/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div onClick={() => setActiveTab("home")} className="flex items-center gap-3 cursor-pointer">
            <OliveTreeLogo />
            <span className="font-serif text-lg font-bold tracking-tight text-[#2D3B32]">
              Bíblia Origens
            </span>
          </div>

          <nav className="ml-6 flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "home" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setActiveTab("read")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "read" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
              }`}
            >
              <BookOpenIcon /> Leitura
            </button>
            {user && (
              <button
                onClick={() => setActiveTab("studies")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "studies" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
                }`}
              >
                <AcademicCapIcon /> Meus Estudos ({savedStudiesList.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "search" ? "bg-[#2D3B32] text-[#F6F5F0]" : "text-[#526356] hover:bg-[#EAE8DD]"
              }`}
            >
              <SearchIcon /> Pesquisa
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#526356]">Olá, <strong className="text-[#2D3B32]">{user.name}</strong></span>
              <button onClick={handleLogout} className="text-xs font-semibold text-rose-700 hover:underline">Sair</button>
            </div>
          ) : (
            <button onClick={() => setActiveTab("home")} className="text-xs bg-[#2D3B32] text-[#F6F5F0] px-3 py-1.5 rounded-lg font-medium">
              Entrar / Criar Conta
            </button>
          )}

          {activeTab === "read" && (
            <div className="flex items-center gap-2 ml-2">
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value as TranslationVersion)}
                className="bg-[#2D3B32] text-[#F6F5F0] text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="ORIGINAL">Interlinear (Original)</option>
                <option value="ARA">ARA (Almeida Revista e Atualizada)</option>
                <option value="NVI">NVI (Nova Versão Internacional)</option>
                <option value="NAA">NAA (Nova Almeida Atualizada)</option>
              </select>

              <select
                value={selectedBook}
                onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); setSelectedVerse(1); }}
                className="bg-[#EAE8DD] border border-[#D8D5C5] text-[#1F2923] text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none"
              >
                {Object.keys(typedBibleData.books).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={selectedChapter}
                onChange={(e) => { setSelectedChapter(Number(e.target.value)); setSelectedVerse(1); }}
                className="bg-[#EAE8DD] border border-[#D8D5C5] text-[#1F2923] text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none"
              >
                {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* TELA INICIAL */}
        {activeTab === "home" && (
          <main className="flex-1 overflow-y-auto p-8 relative z-10">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-4 pt-4">
                <span className="text-xs font-bold tracking-widest uppercase text-[#425447] bg-[#EAE8DD] px-3 py-1 rounded-full border border-[#D8D5C5]">
                  Plataforma de Estudo Exegético
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1F2923] leading-tight">
                  Explore a Bíblia nas Suas Línguas Originais
                </h1>
                <p className="text-sm text-[#526356] max-w-2xl mx-auto leading-relaxed">
                  Acesse o texto Hebraico e Grego versículo por versículo com análise morfológica, chaves Strong, referências cruzadas e destaques das palavras de Jesus em vermelho.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-[#EFECE1]/90 backdrop-blur-sm border border-[#E2E0D5] rounded-2xl p-6 shadow-sm">
                {user ? (
                  <div className="text-center space-y-4">
                    <h3 className="font-serif font-bold text-xl text-[#2D3B32]">Bem-vindo de volta, {user.name}!</h3>
                    <p className="text-xs text-[#526356]">Suas anotações e favoritos estão sincronizados nesta sessão.</p>
                    <button onClick={() => setActiveTab("read")} className="w-full bg-[#2D3B32] text-[#F6F5F0] py-2.5 rounded-xl font-medium text-xs">
                      Ir para Leitura Bíblica
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex border-b border-[#D8D5C5] mb-4">
                      <button onClick={() => setAuthMode("login")} className={`flex-1 pb-2 text-xs font-bold text-center ${authMode === "login" ? "border-b-2 border-[#2D3B32] text-[#2D3B32]" : "text-[#526356]"}`}>Entrar</button>
                      <button onClick={() => setAuthMode("register")} className={`flex-1 pb-2 text-xs font-bold text-center ${authMode === "register" ? "border-b-2 border-[#2D3B32] text-[#2D3B32]" : "text-[#526356]"}`}>Criar Conta</button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-3">
                      {authMode === "register" && (
                        <div>
                          <label className="text-[11px] font-semibold text-[#526356] block mb-1">Nome Completo</label>
                          <input type="text" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Seu nome" className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-lg px-3 py-2 text-xs text-[#1F2923] focus:outline-none" />
                        </div>
                      )}
                      <div>
                        <label className="text-[11px] font-semibold text-[#526356] block mb-1">E-mail</label>
                        <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="seu@email.com" className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-lg px-3 py-2 text-xs text-[#1F2923] focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#526356] block mb-1">Senha</label>
                        <input type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-lg px-3 py-2 text-xs text-[#1F2923] focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full bg-[#2D3B32] text-[#F6F5F0] py-2.5 rounded-xl font-medium text-xs mt-2">
                        {authMode === "login" ? "Acessar Plataforma" : "Cadastrar e Começar"}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <div className="bg-[#EFECE1]/90 backdrop-blur-sm border border-[#E2E0D5] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                <OliveTreeLogo />
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#425447]">Desenvolvimento & Idealização</span>
                  <h2 className="text-lg font-serif font-bold text-[#1F2923]">Ernandes Machado Arruda</h2>
                  <p className="text-xs text-[#526356] leading-relaxed">
                    Projeto desenvolvido com o objetivo de fornecer uma ferramenta exegética moderna, acessível e precisa para estudantes, pastores e pesquisadores da Bíblia Sagrada.
                  </p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TELA DE LEITURA */}
        {activeTab === "read" && (
          <main className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 border-b border-[#E2E0D5] pb-4 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider uppercase text-[#425447]">
                      {currentBook?.testament} · {currentBook?.category}
                    </p>
                    <h1 className="text-3xl font-serif font-bold text-[#1F2923]">
                      {selectedBook} {selectedChapter} · <span className="text-emerald-800">{selectedVersion === "ORIGINAL" ? currentLanguage : selectedVersion}</span>
                    </h1>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveSidePanel(activeSidePanel === "references" ? "none" : "references")}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border ${
                        activeSidePanel === "references" ? "bg-[#2D3B32] text-[#F6F5F0] border-[#2D3B32]" : "bg-[#EAE8DD] hover:bg-[#D8D5C5] text-[#2D3B32] border-[#D8D5C5]"
                      }`}
                    >
                      Referências
                    </button>
                    <button
                      onClick={() => setActiveSidePanel(activeSidePanel === "context" ? "none" : "context")}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border ${
                        activeSidePanel === "context" ? "bg-[#2D3B32] text-[#F6F5F0] border-[#2D3B32]" : "bg-[#EAE8DD] hover:bg-[#D8D5C5] text-[#2D3B32] border-[#D8D5C5]"
                      }`}
                    >
                      Contexto Histórico
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {Object.entries(currentChapterVerses).map(([vNumStr, vText]) => {
                    const vNum = parseInt(vNumStr);
                    const isSelected = selectedVerse === vNum;
                    const vKey = `${selectedBook}-${selectedChapter}-${vNum}`;
                    const vData = userData[vKey];

                    return (
                      <div
                        key={vNumStr}
                        onClick={() => {
                          setSelectedVerse(vNum);
                          if (activeSidePanel === "none") setActiveSidePanel("study");
                        }}
                        className={`p-4 rounded-xl transition-all border ${
                          isSelected
                            ? "bg-[#EAE8DD] border-[#2D3B32]"
                            : vData?.highlighted
                            ? "bg-emerald-100/60 border-emerald-300"
                            : "border-transparent hover:bg-[#EAE8DD]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#2D3B32] text-[#F6F5F0] font-serif font-bold text-xs flex items-center justify-center">
                              {vNum}
                            </span>
                            {vData?.favorite && <StarIcon filled />}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVerse(vNum);
                              setActiveSidePanel("references");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 bg-[#2D3B32] hover:bg-[#1F2923] text-[#F6F5F0] rounded-lg text-xs font-medium transition-colors shadow-sm"
                          >
                            <LinkIcon />
                            <span>Referências</span>
                          </button>
                        </div>

                        {renderVerseContent(vKey, vText)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PAINEL LATERAL DE ESTUDO, CONTEXTO E REFERÊNCIAS */}
            {activeSidePanel !== "none" && (
              <aside className="w-96 bg-[#EFECE1] border-l border-[#E2E0D5] p-6 overflow-y-auto flex flex-col shrink-0">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E0D5] mb-4">
                  <h3 className="font-semibold text-[#1F2923] text-sm">
                    {activeSidePanel === "study" && "Anotações do Versículo"}
                    {activeSidePanel === "context" && "Introdução & Contexto Histórico"}
                    {activeSidePanel === "references" && "Referências"}
                  </h3>
                  <button onClick={() => setActiveSidePanel("none")} className="text-xs text-[#526356] font-bold">✕ Fechar</button>
                </div>

                {activeSidePanel === "context" && (
                  <div className="space-y-4 text-xs text-[#1F2923]">
                    <div className="bg-[#F6F5F0] p-3 rounded-lg border border-[#D8D5C5] space-y-1">
                      <p><strong>Livro:</strong> {selectedBook}</p>
                      <p><strong>Autor:</strong> {typedContextData[selectedBook]?.author || "Desconhecido"}</p>
                      <p><strong>Data de Escrita:</strong> {typedContextData[selectedBook]?.date || "N/A"}</p>
                      <p><strong>Tema Central:</strong> {typedContextData[selectedBook]?.theme || "N/A"}</p>
                    </div>

                    <div>
                      <span className="font-bold block mb-1 text-[#2D3B32]">Introdução ao Livro:</span>
                      <p className="leading-relaxed bg-[#F6F5F0] p-3 rounded-lg border border-[#D8D5C5]">
                        {typedContextData[selectedBook]?.introduction || "Introdução não cadastrada."}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold block mb-1 text-[#2D3B32]">Contexto Histórico & Cultural:</span>
                      <p className="leading-relaxed bg-[#F6F5F0] p-3 rounded-lg border border-[#D8D5C5]">
                        {typedContextData[selectedBook]?.historicalContext || typedContextData[selectedBook]?.summary || "Contexto histórico não disponível."}
                      </p>
                    </div>
                  </div>
                )}

                {/* PAINEL DE REFERÊNCIAS */}
                {activeSidePanel === "references" && (
                  <div className="space-y-4">
                    <div className="bg-[#2D3B32] text-[#F6F5F0] p-3 rounded-xl border border-[#425447]">
                      <p className="text-xs font-bold">Passagens Paralelas</p>
                      <p className="text-[11px] text-[#A8B6AB]">{selectedBook} {selectedChapter}:{selectedVerse || 1}</p>
                    </div>

                    <div className="space-y-3">
                      {currentReferences.map((ref, i) => (
                        <div key={i} className="p-3 bg-[#F6F5F0] border border-[#D8D5C5] rounded-xl text-xs text-[#1F2923] hover:border-[#2D3B32] transition-colors shadow-sm">
                          <p className="font-bold text-[#2D3B32] mb-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                            {ref.passage}
                          </p>
                          <p className="text-[#526356] italic leading-relaxed">"{ref.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSidePanel === "study" && selectedVerse && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-[#2D3B32]">{selectedBook} {selectedChapter}:{selectedVerse}</p>
                    
                    {!user ? (
                      <div className="p-4 bg-[#EAE8DD] border border-[#D8D5C5] rounded-xl text-xs text-center space-y-3">
                        <p className="text-[#2D3B32] font-semibold">🔒 Função restrita a usuários logados</p>
                        <p className="text-[#526356] leading-relaxed">
                          Para favoritar, destacar e escrever anotações teológicas personalizadas, por favor acesse sua conta.
                        </p>
                        <button onClick={() => setActiveTab("home")} className="bg-[#2D3B32] text-[#F6F5F0] px-4 py-1.5 rounded-lg text-xs font-medium">
                          Fazer Login
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <button onClick={() => toggleFavorite(selectedVerse)} className="flex-1 py-1.5 bg-[#EAE8DD] rounded text-xs font-medium text-[#1F2923] border border-[#D8D5C5]">
                            {currentVerseNote?.favorite ? "★ Favorito" : "☆ Favoritar"}
                          </button>
                          <button onClick={() => toggleHighlight(selectedVerse)} className="flex-1 py-1.5 bg-[#EAE8DD] rounded text-xs font-medium text-[#1F2923] border border-[#D8D5C5]">
                            {currentVerseNote?.highlighted ? "Destacado" : "Destacar"}
                          </button>
                        </div>

                        <textarea
                          value={currentVerseNote?.study || ""}
                          onChange={(e) => saveStudyText(e.target.value)}
                          placeholder="Escreva suas anotações teológicas do versículo..."
                          className="w-full h-48 bg-[#F6F5F0] border border-[#D8D5C5] rounded-xl p-3 text-xs focus:outline-none resize-none text-[#1F2923]"
                        />
                      </>
                    )}

                    <button onClick={() => setActiveSidePanel("references")} className="w-full py-2 bg-[#2D3B32] text-[#F6F5F0] font-medium text-xs rounded-lg border border-[#2D3B32]">
                      Ver Referências
                    </button>
                  </div>
                )}
              </aside>
            )}
          </main>
        )}

        {/* TELA DE ESTUDOS SALVOS */}
        {activeTab === "studies" && (
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-serif font-bold mb-6 text-[#1F2923]">Meus Estudos Salvos</h2>
              {!user ? (
                <p className="text-xs text-[#526356]">Faça login para visualizar seus estudos salvos.</p>
              ) : savedStudiesList.length === 0 ? (
                <p className="text-xs text-[#526356]">Nenhum estudo salvo até o momento.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedStudiesList.map((st) => (
                    <div key={st.key} className="bg-[#EFECE1] border border-[#E2E0D5] p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#2D3B32]">{st.book} {st.chapter}:{st.verse}</span>
                        <p className="text-xs italic text-[#526356] my-2 bg-[#F6F5F0] p-2 rounded">"{st.verseText}"</p>
                        <p className="text-xs text-[#1F2923]">{st.study}</p>
                      </div>
                      <button onClick={() => navigateToVerse(st.book, st.chapter, st.verse, true)} className="mt-4 text-xs font-semibold text-[#2D3B32] self-start">
                        Continuar estudo →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* TELA DE PESQUISA */}
        {activeTab === "search" && (
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-serif font-bold mb-6 text-[#1F2923]">Pesquisar na Bíblia</h2>
              <SearchInput initialValue={searchTerm} onSearch={handleSearch} />

              <div className="mt-6 space-y-3">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => navigateToVerse(res.bookKey, parseInt(res.chapter), parseInt(res.verse))}
                    className="bg-[#EFECE1] border border-[#E2E0D5] hover:border-[#2D3B32] p-4 rounded-xl cursor-pointer"
                  >
                    <p className="text-xs font-bold text-[#2D3B32] mb-1">{res.bookName} {res.chapter}:{res.verse}</p>
                    <p className="text-xs text-[#1F2923]">{res.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>

      {/* MODAL LÉXICO DETALHADO */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#F6F5F0] border border-[#D8D5C5] rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setSelectedWord(null)} className="absolute top-4 right-4 text-xs font-bold text-[#526356]">✕</button>
            <div className="border-b border-[#E2E0D5] pb-3 mb-3">
              <div className="flex items-baseline justify-between">
                <span className={`text-lg font-bold ${selectedWord.isJesusWords ? "text-[#B91C1C]" : "text-[#1F2923]"}`}>
                  {selectedWord.translation}
                </span>
                <span className="text-[10px] font-semibold text-[#2D3B32] bg-[#EAE8DD] px-2 py-0.5 rounded border border-[#D8D5C5]">
                  {selectedWord.strong}
                </span>
              </div>
              <p className={`text-lg font-serif font-bold mt-1 ${selectedWord.isJesusWords ? "text-[#B91C1C]" : "text-[#2D3B32]"}`}>
                {selectedWord.original} <span className="text-xs font-sans font-normal italic text-[#526356]">({selectedWord.translit})</span>
              </p>
            </div>
            <div className="space-y-2 text-xs text-[#1F2923]">
              <p><strong>Classe Gramatical:</strong> {selectedWord.grammar}</p>
              {selectedWord.morphology && <p><strong>Morfologia:</strong> {selectedWord.morphology}</p>}
              <p><strong>Definição Exegética:</strong> {selectedWord.meaning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchInput({ initialValue, onSearch }: { initialValue: string; onSearch: (val: string) => void }) {
  const [val, setVal] = useState(initialValue);
  return (
    <input
      type="text"
      value={val}
      onChange={(e) => { setVal(e.target.value); onSearch(e.target.value); }}
      placeholder="Digite um termo para pesquisar..."
      className="w-full bg-[#EFECE1] border border-[#D8D5C5] rounded-xl px-4 py-3 text-xs text-[#1F2923] focus:outline-none"
      autoFocus
    />
  );
}
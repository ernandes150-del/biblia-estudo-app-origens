"use client";

import { useEffect, useMemo, useState } from "react";
import bibleData from "../data/bible/bible.json";
import referencesData from "../data/study/references.json";
import contextData from "../data/study/context.json";
import type {
  ActiveSidePanel,
  ActiveTab,
  BibleData,
  ContextInfo,
  InterlinearWord,
  SearchResult,
  TranslationVersion,
  User,
  UserData,
} from "./types";
import AuthNotice from "./components/AuthNotice";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import ReadView from "./components/ReadView";
import StudiesView from "./components/StudiesView";
import SearchView from "./components/SearchView";
import LexiconModal from "./components/LexiconModal";
import { loadBookLexicon } from "./lib/lexicon";
import { supabase } from "./lib/supabaseClient";
import { fetchUserData, upsertVerseNote } from "./lib/userDataStore";

export default function BibliaOrigensApp() {
  const typedBibleData = bibleData as unknown as BibleData;
  const typedReferencesData = referencesData as unknown as Record<string, { reference: string; description: string }[]>;
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

  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [activeSidePanel, setActiveSidePanel] = useState<ActiveSidePanel>("none");
  const [selectedWord, setSelectedWord] = useState<InterlinearWord | null>(null);

  const [userData, setUserData] = useState<UserData>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // ESTADO DO MENU MOBILE
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  // Força um novo render de ReadView quando o léxico interlinear do livro
  // selecionado termina de carregar (getInterlinearWords lê de um cache que
  // não é estado do React, então repassamos o contador como prop para
  // ReadView, que o usa apenas para invalidar seu cálculo memoizado).
  const [lexiconTick, setLexiconTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadBookLexicon(selectedBook).then(() => {
      if (!cancelled) setLexiconTick((t) => t + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedBook]);

  useEffect(() => {
    let cancelled = false;

    // Restaura a sessão (o supabase-js já persiste o token no localStorage
    // internamente) e escuta login/logout feitos em outras abas.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled || !session?.user) return;
      const su = session.user;
      setUser({ id: su.id, email: su.email ?? "", name: (su.user_metadata?.name as string) || (su.email?.split("@")[0] ?? "") });
      const data = await fetchUserData(su.id);
      if (!cancelled) setUserData(data);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setUserData({});
        return;
      }
      const su = session.user;
      setUser({ id: su.id, email: su.email ?? "", name: (su.user_metadata?.name as string) || (su.email?.split("@")[0] ?? "") });
      const data = await fetchUserData(su.id);
      setUserData(data);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const triggerAuthAlert = (message: string) => {
    setAuthNotice(message);
    setTimeout(() => setAuthNotice(null), 5000);
  };

  // Atualiza o estado local de imediato (UI otimista) e grava só a nota do
  // versículo alterado no Supabase, em vez de reescrever tudo.
  const saveUserData = (newData: UserData, changedKey?: string) => {
    setUserData(newData);
    if (user && changedKey) {
      upsertVerseNote(user.id, changedKey, newData[changedKey]);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    if (authMode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput,
        options: { data: { name: nameInput || emailInput.split("@")[0] } },
      });
      if (error) {
        triggerAuthAlert(error.message);
        return;
      }
      if (!data.session) {
        // Projeto com confirmação de e-mail ativada: ainda não há sessão.
        triggerAuthAlert("Conta criada! Verifique seu e-mail para confirmar o acesso.");
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });
      if (error) {
        triggerAuthAlert(error.message);
        return;
      }
    }

    setAuthNotice(null);
    setActiveTab("read");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  const toggleFavorite = (verseNum: number) => {
    if (!user) {
      triggerAuthAlert("Apenas pessoas logadas podem favoritar versículos.");
      return;
    }
    const key = `${selectedBook}-${selectedChapter}-${verseNum}`;
    const existing = userData[key] || { favorite: false, highlighted: false, note: "", study: "" };
    saveUserData({ ...userData, [key]: { ...existing, favorite: !existing.favorite } }, key);
  };

  const toggleHighlight = (verseNum: number) => {
    if (!user) {
      triggerAuthAlert("Apenas pessoas logadas podem destacar versículos.");
      return;
    }
    const key = `${selectedBook}-${selectedChapter}-${verseNum}`;
    const existing = userData[key] || { favorite: false, highlighted: false, note: "", study: "" };
    saveUserData({ ...userData, [key]: { ...existing, highlighted: !existing.highlighted } }, key);
  };

  const saveStudyText = (studyText: string) => {
    if (!user) {
      triggerAuthAlert("Apenas pessoas logadas podem criar anotações de estudo.");
      return;
    }
    if (!currentVerseKey) return;
    const existing = userData[currentVerseKey] || { favorite: false, highlighted: false, note: "", study: "" };
    saveUserData({ ...userData, [currentVerseKey]: { ...existing, study: studyText } }, currentVerseKey);
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
      .filter(([, v]) => v.study && v.study.trim() !== "")
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
    setMenuMobileAberto(false);
    if (openStudy) setActiveSidePanel("study");
  };

  const currentReferences = useMemo(() => {
    const verseNum = selectedVerse || 1;
    const refKey = `${selectedBook} ${selectedChapter}:${verseNum}`;
    const directRefs = typedReferencesData[refKey];

    if (directRefs && directRefs.length > 0) {
      return directRefs.map(ref => ({ passage: ref.reference, text: ref.description }));
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

  return (
    <div className="h-screen w-screen bg-[#F6F5F0] text-[#1F2923] font-sans flex flex-col overflow-hidden">

      {authNotice && (
        <AuthNotice message={authNotice} onGoToLogin={() => setActiveTab("home")} />
      )}

      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedStudiesCount={savedStudiesList.length}
        handleLogout={handleLogout}
        menuMobileAberto={menuMobileAberto}
        setMenuMobileAberto={setMenuMobileAberto}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        bookNames={Object.keys(typedBibleData.books)}
        totalChapters={totalChapters}
        onSetSelectedVerse={setSelectedVerse}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === "home" && (
          <HomeView
            user={user}
            authMode={authMode}
            setAuthMode={setAuthMode}
            emailInput={emailInput}
            setEmailInput={setEmailInput}
            nameInput={nameInput}
            setNameInput={setNameInput}
            passwordInput={passwordInput}
            setPasswordInput={setPasswordInput}
            handleAuth={handleAuth}
            onStartReading={() => setActiveTab("read")}
          />
        )}

        {activeTab === "read" && (
          <ReadView
            selectedBook={selectedBook}
            selectedChapter={selectedChapter}
            selectedVerse={selectedVerse}
            setSelectedVerse={setSelectedVerse}
            currentLanguage={currentLanguage}
            currentChapterVerses={currentChapterVerses}
            userData={userData}
            selectedVersion={selectedVersion}
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            toggleFavorite={toggleFavorite}
            toggleHighlight={toggleHighlight}
            setSelectedWord={setSelectedWord}
            typedContextData={typedContextData}
            currentVerseKey={currentVerseKey}
            currentVerseNote={currentVerseNote}
            saveStudyText={saveStudyText}
            currentReferences={currentReferences}
            lexiconVersion={lexiconTick}
          />
        )}

        {activeTab === "studies" && user && (
          <StudiesView savedStudiesList={savedStudiesList} navigateToVerse={navigateToVerse} />
        )}

        {activeTab === "search" && (
          <SearchView
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            searchResults={searchResults}
            navigateToVerse={navigateToVerse}
          />
        )}
      </div>

      {selectedWord && (
        <LexiconModal word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  );
}

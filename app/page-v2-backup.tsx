"use client";

import { useEffect, useMemo, useState } from "react";
import bibleData from "../data/bible/bible.json";

type BibleBook = {
  name: string;
  testament: string;
  category: string;
  chapters: number;
  chapterData: Record<string, Record<string, string>>;
};

type BibleData = {
  translation: {
    name: string;
    abbreviation: string;
    language: string;
    year: number;
    license: string;
    source: string;
  };
  books: Record<string, BibleBook>;
};

type VerseNote = {
  favorite: boolean;
  highlighted: boolean;
  note: string;
};

type SearchResult = {
  book: string;
  chapter: number;
  verse: string;
  text: string;
};

const bible = bibleData as BibleData;

const allBooks = Object.values(bible.books);

const oldTestament = allBooks.filter(
  (book) => book.testament === "Antigo Testamento"
);

const newTestament = allBooks.filter(
  (book) => book.testament === "Novo Testamento"
);

const STORAGE_KEY = "biblia-estudo-verses-v1";

export default function Home() {
  const [selectedBook, setSelectedBook] =
    useState<BibleBook | null>(null);

  const [selectedChapter, setSelectedChapter] =
    useState<number | null>(null);

  const [selectedVerse, setSelectedVerse] =
    useState<string | null>(null);

  const [verseData, setVerseData] =
    useState<Record<string, VerseNote>>({});

  const [storageLoaded, setStorageLoaded] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState<"bible" | "search" | "favorites" | "notes" | "highlights">(
      "bible"
    );

  const [showBooks, setShowBooks] =
    useState(false);

  const [searchBook, setSearchBook] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<SearchResult[]>([]);

  const [searchPerformed, setSearchPerformed] =
    useState(false);

  const [noteText, setNoteText] =
    useState("");

  const [showNote, setShowNote] =
    useState(false);

  /*
   * ==========================================================
   * CARREGAR DADOS SALVOS
   * ==========================================================
   */

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          setVerseData(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Erro ao carregar dados:",
        error
      );
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  /*
   * ==========================================================
   * SALVAR DADOS
   * ==========================================================
   */

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(verseData)
      );
    } catch (error) {
      console.error(
        "Erro ao salvar dados:",
        error
      );
    }
  }, [verseData, storageLoaded]);

  /*
   * ==========================================================
   * VERSÍCULOS DO CAPÍTULO ATUAL
   * ==========================================================
   */

  const verses = useMemo(() => {
    if (
      !selectedBook ||
      selectedChapter === null
    ) {
      return [];
    }

    const chapter =
      selectedBook.chapterData[
        String(selectedChapter)
      ];

    if (!chapter) {
      return [];
    }

    return Object.entries(chapter).map(
      ([number, text]) => ({
        number,
        text,
      })
    );
  }, [selectedBook, selectedChapter]);

  /*
   * ==========================================================
   * LISTAS DE FAVORITOS / DESTAQUES / ANOTAÇÕES
   * ==========================================================
   */

  const favoriteVerses = useMemo(() => {
    return Object.entries(verseData)
      .filter(([, data]) => data.favorite)
      .map(([id, data]) => ({
        id,
        ...data,
      }));
  }, [verseData]);

  const highlightedVerses = useMemo(() => {
    return Object.entries(verseData)
      .filter(([, data]) => data.highlighted)
      .map(([id, data]) => ({
        id,
        ...data,
      }));
  }, [verseData]);

  const annotatedVerses = useMemo(() => {
    return Object.entries(verseData)
      .filter(
        ([, data]) =>
          data.note &&
          data.note.trim() !== ""
      )
      .map(([id, data]) => ({
        id,
        ...data,
      }));
  }, [verseData]);

  /*
   * ==========================================================
   * FILTRO DOS LIVROS
   * ==========================================================
   */

  const filteredOldTestament =
    oldTestament.filter((book) =>
      book.name
        .toLowerCase()
        .includes(searchBook.toLowerCase())
    );

  const filteredNewTestament =
    newTestament.filter((book) =>
      book.name
        .toLowerCase()
        .includes(searchBook.toLowerCase())
    );

  /*
   * ==========================================================
   * ID DO VERSÍCULO
   * ==========================================================
   */

  function getVerseId(
    verseNumber: string
  ) {
    if (
      !selectedBook ||
      selectedChapter === null
    ) {
      return "";
    }

    return `${selectedBook.name}-${selectedChapter}-${verseNumber}`;
  }

  /*
   * ==========================================================
   * ABRIR LIVRO
   * ==========================================================
   */

  function openBook(book: BibleBook) {
    setSelectedBook(book);
    setSelectedChapter(null);
    setSelectedVerse(null);
    setShowBooks(false);
    setActiveSection("bible");
    setSearchBook("");
    setShowNote(false);
  }

  /*
   * ==========================================================
   * ABRIR CAPÍTULO
   * ==========================================================
   */

  function openChapter(chapter: number) {
    setSelectedChapter(chapter);
    setSelectedVerse(null);
    setShowNote(false);
    setActiveSection("bible");
  }

  /*
   * ==========================================================
   * VOLTAR PARA LIVROS
   * ==========================================================
   */

  function backToBooks() {
    setSelectedBook(null);
    setSelectedChapter(null);
    setSelectedVerse(null);
    setShowNote(false);
    setShowBooks(true);
  }

  /*
   * ==========================================================
   * VOLTAR PARA CAPÍTULOS
   * ==========================================================
   */

  function backToChapters() {
    setSelectedChapter(null);
    setSelectedVerse(null);
    setShowNote(false);
  }

  /*
   * ==========================================================
   * CAPÍTULO ANTERIOR
   * ==========================================================
   */

  function previousChapter() {
    if (
      !selectedBook ||
      selectedChapter === null
    ) {
      return;
    }

    if (selectedChapter > 1) {
      openChapter(selectedChapter - 1);
      return;
    }

    const index = allBooks.findIndex(
      (book) =>
        book.name === selectedBook.name
    );

    if (index > 0) {
      const previousBook =
        allBooks[index - 1];

      setSelectedBook(previousBook);
      setSelectedChapter(
        previousBook.chapters
      );
      setSelectedVerse(null);
    }
  }

  /*
   * ==========================================================
   * PRÓXIMO CAPÍTULO
   * ==========================================================
   */

  function nextChapter() {
    if (
      !selectedBook ||
      selectedChapter === null
    ) {
      return;
    }

    if (
      selectedChapter <
      selectedBook.chapters
    ) {
      openChapter(selectedChapter + 1);
      return;
    }

    const index = allBooks.findIndex(
      (book) =>
        book.name === selectedBook.name
    );

    if (index < allBooks.length - 1) {
      const nextBook =
        allBooks[index + 1];

      setSelectedBook(nextBook);
      setSelectedChapter(1);
      setSelectedVerse(null);
    }
  }

  /*
   * ==========================================================
   * SELECIONAR VERSÍCULO
   * ==========================================================
   */

  function selectVerse(
    verseNumber: string
  ) {
    setSelectedVerse((current) =>
      current === verseNumber
        ? null
        : verseNumber
    );

    setShowNote(false);
  }

  /*
   * ==========================================================
   * ATUALIZAR DADOS DO VERSÍCULO
   * ==========================================================
   */

  function updateVerseData(
    verseNumber: string,
    changes: Partial<VerseNote>
  ) {
    const id =
      getVerseId(verseNumber);

    if (!id) {
      return;
    }

    setVerseData((current) => ({
      ...current,

      [id]: {
        favorite: false,
        highlighted: false,
        note: "",
        ...(current[id] || {}),
        ...changes,
      },
    }));
  }

  /*
   * ==========================================================
   * FAVORITO
   * ==========================================================
   */

  function toggleFavorite(
    verseNumber: string
  ) {
    const id =
      getVerseId(verseNumber);

    const current =
      verseData[id];

    updateVerseData(
      verseNumber,
      {
        favorite:
          !current?.favorite,
      }
    );
  }

  /*
   * ==========================================================
   * DESTAQUE
   * ==========================================================
   */

  function toggleHighlight(
    verseNumber: string
  ) {
    const id =
      getVerseId(verseNumber);

    const current =
      verseData[id];

    updateVerseData(
      verseNumber,
      {
        highlighted:
          !current?.highlighted,
      }
    );
  }

  /*
   * ==========================================================
   * COPIAR VERSÍCULO
   * ==========================================================
   */

  async function copyVerse(
    book: string,
    chapter: number,
    verse: string,
    text: string
  ) {
    const content =
      `${book} ${chapter}:${verse} — ${text}`;

    try {
      await navigator.clipboard.writeText(
        content
      );
    } catch (error) {
      console.error(
        "Erro ao copiar:",
        error
      );
    }
  }

  /*
   * ==========================================================
   * ANOTAÇÃO
   * ==========================================================
   */

  function openNote(
    verseNumber: string
  ) {
    const id =
      getVerseId(verseNumber);

    setNoteText(
      verseData[id]?.note || ""
    );

    setShowNote(true);
  }

  function saveNote() {
    if (!selectedVerse) {
      return;
    }

    updateVerseData(
      selectedVerse,
      {
        note: noteText,
      }
    );

    setShowNote(false);
  }

  /*
   * ==========================================================
   * PESQUISA
   * ==========================================================
   */

  function performSearch() {
    const term =
      searchTerm.trim().toLowerCase();

    if (!term) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    const results: SearchResult[] = [];

    for (const book of allBooks) {
      for (
        let chapter = 1;
        chapter <= book.chapters;
        chapter++
      ) {
        const chapterData =
          book.chapterData[
            String(chapter)
          ];

        if (!chapterData) {
          continue;
        }

        for (const [
          verse,
          text,
        ] of Object.entries(
          chapterData
        )) {
          if (
            text
              .toLowerCase()
              .includes(term)
          ) {
            results.push({
              book: book.name,
              chapter,
              verse,
              text,
            });
          }
        }
      }
    }

    setSearchResults(results);
    setSearchPerformed(true);
  }

  /*
   * ==========================================================
   * ABRIR RESULTADO DA PESQUISA
   * ==========================================================
   */

  function openSearchResult(
    result: SearchResult
  ) {
    const book =
      bible.books[result.book];

    if (!book) {
      return;
    }

    setSelectedBook(book);
    setSelectedChapter(result.chapter);
    setSelectedVerse(result.verse);
    setActiveSection("bible");
    setShowBooks(false);
    setShowNote(false);
  }

  /*
   * ==========================================================
   * ABRIR VERSÍCULO SALVO
   * ==========================================================
   */

  function openSavedVerse(
    id: string
  ) {
    const parts = id.split("-");

    const verse =
      parts.pop();

    const chapter =
      parts.pop();

    const bookName =
      parts.join("-");

    const book =
      bible.books[bookName];

    if (
      !book ||
      !chapter ||
      !verse
    ) {
      return;
    }

    setSelectedBook(book);
    setSelectedChapter(
      Number(chapter)
    );
    setSelectedVerse(verse);
    setActiveSection("bible");
    setShowBooks(false);
    setShowNote(false);
  }

  /*
   * ==========================================================
   * NAVEGAÇÃO PRINCIPAL
   * ==========================================================
   */

  function navigate(
    section:
      | "bible"
      | "search"
      | "favorites"
      | "notes"
      | "highlights"
  ) {
    setActiveSection(section);

    setShowBooks(
      section === "bible" &&
        !selectedBook
    );

    if (section !== "search") {
      setSearchPerformed(false);
    }
  }

  /*
   * ==========================================================
   * COMPONENTE DE MENU
   * ==========================================================
   */

  function Navigation() {
    return (
      <nav className="border-b border-stone-200 bg-white">

        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">

          <button
            onClick={() =>
              navigate("bible")
            }
            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
              activeSection === "bible"
                ? "border-b-2 border-stone-900 text-stone-900"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            📖 Bíblia
          </button>

          <button
            onClick={() =>
              navigate("search")
            }
            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
              activeSection === "search"
                ? "border-b-2 border-stone-900 text-stone-900"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            🔎 Pesquisar
          </button>

          <button
            onClick={() =>
              navigate("favorites")
            }
            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
              activeSection ===
              "favorites"
                ? "border-b-2 border-stone-900 text-stone-900"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            ⭐ Favoritos
            {favoriteVerses.length >
              0 && (
              <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                {
                  favoriteVerses.length
                }
              </span>
            )}
          </button>

          <button
            onClick={() =>
              navigate("notes")
            }
            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
              activeSection ===
              "notes"
                ? "border-b-2 border-stone-900 text-stone-900"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            📝 Anotações
            {annotatedVerses.length >
              0 && (
              <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                {
                  annotatedVerses.length
                }
              </span>
            )}
          </button>

          <button
            onClick={() =>
              navigate("highlights")
            }
            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
              activeSection ===
              "highlights"
                ? "border-b-2 border-stone-900 text-stone-900"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            🖍️ Destaques
          </button>

        </div>

      </nav>
    );
  }

  /*
   * ==========================================================
   * INTERFACE
   * ==========================================================
   */

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">

          <button
            onClick={() => {
              setActiveSection("bible");

              if (!selectedBook) {
                setShowBooks(true);
              }
            }}
            className="text-left"
          >

            <h1 className="text-2xl font-bold">
              Bíblia de Estudo
            </h1>

            <p className="text-xs text-stone-500">
              Bíblia Livre • 2018
            </p>

          </button>

          <button
            onClick={() => {
              setActiveSection("bible");
              setShowBooks(true);
            }}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
          >
            Livros
          </button>

        </div>

      </header>

      <Navigation />

      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* =====================================================
            BÍBLIA
        ====================================================== */}

        {activeSection === "bible" && (

          <>
            {/* LIVROS */}

            {!selectedBook &&
              showBooks && (

                <section>

                  <div className="mb-6 flex items-center justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold">
                        Livros da Bíblia
                      </h2>

                      <p className="mt-1 text-sm text-stone-500">
                        66 livros • 39 no Antigo Testamento • 27 no Novo Testamento
                      </p>

                    </div>

                  </div>

                  <input
                    type="text"
                    placeholder="Pesquisar livro..."
                    value={searchBook}
                    onChange={(event) =>
                      setSearchBook(
                        event.target.value
                      )
                    }
                    className="mb-8 w-full rounded-2xl border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                  />

                  <div className="grid gap-8 md:grid-cols-2">

                    {/* AT */}

                    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">

                      <h3 className="mb-4 text-xl font-bold">
                        Antigo Testamento
                      </h3>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                        {filteredOldTestament.map(
                          (book) => (

                            <button
                              key={book.name}
                              onClick={() =>
                                openBook(
                                  book
                                )
                              }
                              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-left text-sm font-medium hover:border-stone-400 hover:bg-stone-100"
                            >

                              {book.name}

                              <span className="mt-1 block text-xs text-stone-500">
                                {
                                  book.chapters
                                }{" "}
                                capítulos
                              </span>

                            </button>

                          )
                        )}

                      </div>

                    </div>

                    {/* NT */}

                    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">

                      <h3 className="mb-4 text-xl font-bold">
                        Novo Testamento
                      </h3>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                        {filteredNewTestament.map(
                          (book) => (

                            <button
                              key={book.name}
                              onClick={() =>
                                openBook(
                                  book
                                )
                              }
                              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-left text-sm font-medium hover:border-stone-400 hover:bg-stone-100"
                            >

                              {book.name}

                              <span className="mt-1 block text-xs text-stone-500">
                                {
                                  book.chapters
                                }{" "}
                                capítulos
                              </span>

                            </button>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                </section>

              )}

            {/* HOME */}

            {!selectedBook &&
              !showBooks && (

                <section className="flex min-h-[65vh] items-center justify-center">

                  <div className="w-full max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm md:p-12">

                    <div className="mb-6 text-5xl">
                      📖
                    </div>

                    <h2 className="text-3xl font-bold md:text-4xl">
                      Bíblia de Estudo
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-stone-600">
                      Leia, pesquise e estude a Bíblia diretamente pelo aplicativo.
                    </p>

                    <button
                      onClick={() =>
                        setShowBooks(true)
                      }
                      className="mt-8 rounded-2xl bg-stone-900 px-7 py-3 font-semibold text-white hover:bg-stone-700"
                    >
                      Abrir Bíblia
                    </button>

                  </div>

                </section>

              )}

            {/* CAPÍTULOS */}

            {selectedBook &&
              selectedChapter ===
                null && (

                <section>

                  <button
                    onClick={backToBooks}
                    className="mb-6 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-100"
                  >
                    ← Livros
                  </button>

                  <p className="text-sm text-stone-500">
                    {
                      selectedBook.testament
                    }
                  </p>

                  <h2 className="mt-1 text-3xl font-bold">
                    {selectedBook.name}
                  </h2>

                  <p className="mt-2 mb-8 text-stone-500">
                    Selecione um capítulo
                  </p>

                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">

                    {Array.from(
                      {
                        length:
                          selectedBook.chapters,
                      },
                      (_, index) =>
                        index + 1
                    ).map(
                      (chapter) => (

                        <button
                          key={chapter}
                          onClick={() =>
                            openChapter(
                              chapter
                            )
                          }
                          className="aspect-square rounded-2xl border border-stone-200 bg-white text-lg font-semibold shadow-sm hover:border-stone-400 hover:bg-stone-100"
                        >
                          {chapter}
                        </button>

                      )
                    )}

                  </div>

                </section>

              )}

            {/* LEITOR */}

            {selectedBook &&
              selectedChapter !==
                null && (

                <section>

                  <div className="mb-6 flex items-center justify-between gap-3">

                    <button
                      onClick={
                        backToChapters
                      }
                      className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-100"
                    >
                      ← Capítulos
                    </button>

                    <div className="text-center">

                      <p className="text-sm text-stone-500">
                        {
                          selectedBook.name
                        }
                      </p>

                      <h2 className="text-2xl font-bold">
                        {selectedChapter}
                      </h2>

                    </div>

                    <button
                      onClick={() => {
                        setShowBooks(
                          true
                        );
                        setSelectedBook(
                          null
                        );
                        setSelectedChapter(
                          null
                        );
                      }}
                      className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-100"
                    >
                      Livros
                    </button>

                  </div>

                  <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-10">

                    <div className="mb-8 border-b border-stone-200 pb-6">

                      <h3 className="text-2xl font-bold">
                        {
                          selectedBook.name
                        }{" "}
                        {
                          selectedChapter
                        }
                      </h3>

                      <p className="mt-2 text-sm text-stone-500">
                        Bíblia Livre • 2018
                      </p>

                    </div>

                    <div className="space-y-2">

                      {verses.map(
                        (verse) => {

                          const id =
                            getVerseId(
                              verse.number
                            );

                          const data =
                            verseData[id];

                          const isSelected =
                            selectedVerse ===
                            verse.number;

                          return (

                            <div
                              key={
                                verse.number
                              }
                            >

                              <button
                                onClick={() =>
                                  selectVerse(
                                    verse.number
                                  )
                                }
                                className={`w-full rounded-xl p-3 text-left transition ${
                                  data?.highlighted
                                    ? "bg-yellow-100"
                                    : isSelected
                                    ? "bg-stone-100"
                                    : "hover:bg-stone-50"
                                }`}
                              >

                                <div className="flex gap-4">

                                  <span className="min-w-[28px] pt-1 text-sm font-bold text-stone-400">
                                    {
                                      verse.number
                                    }
                                  </span>

                                  <p className="text-lg leading-8">
                                    {
                                      verse.text
                                    }
                                  </p>

                                </div>

                              </button>

                              {isSelected && (

                                <div className="ml-11 mt-1 flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">

                                  <button
                                    onClick={() =>
                                      toggleFavorite(
                                        verse.number
                                      )
                                    }
                                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                      data?.favorite
                                        ? "bg-yellow-200 text-yellow-900"
                                        : "border border-stone-200 bg-white"
                                    }`}
                                  >
                                    ⭐{" "}
                                    {data?.favorite
                                      ? "Favoritado"
                                      : "Favoritar"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      toggleHighlight(
                                        verse.number
                                      )
                                    }
                                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                      data?.highlighted
                                        ? "bg-yellow-200 text-yellow-900"
                                        : "border border-stone-200 bg-white"
                                    }`}
                                  >
                                    🖍️{" "}
                                    {data?.highlighted
                                      ? "Remover"
                                      : "Destacar"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      copyVerse(
                                        selectedBook.name,
                                        selectedChapter,
                                        verse.number,
                                        verse.text
                                      )
                                    }
                                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium"
                                  >
                                    📋 Copiar
                                  </button>

                                  <button
                                    onClick={() =>
                                      openNote(
                                        verse.number
                                      )
                                    }
                                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium"
                                  >
                                    📝 Anotação
                                  </button>

                                </div>

                              )}

                              {isSelected &&
                                showNote && (

                                  <div className="ml-11 mt-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">

                                    <h4 className="mb-3 font-semibold">
                                      Anotação pessoal
                                    </h4>

                                    <textarea
                                      value={
                                        noteText
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        setNoteText(
                                          event
                                            .target
                                            .value
                                        )
                                      }
                                      rows={4}
                                      placeholder="Escreva sua anotação..."
                                      className="w-full resize-none rounded-xl border border-stone-300 p-3 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                                    />

                                    <div className="mt-3 flex justify-end gap-2">

                                      <button
                                        onClick={() =>
                                          setShowNote(
                                            false
                                          )
                                        }
                                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm"
                                      >
                                        Cancelar
                                      </button>

                                      <button
                                        onClick={
                                          saveNote
                                        }
                                        className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                                      >
                                        Salvar
                                      </button>

                                    </div>

                                  </div>

                                )}

                            </div>

                          );
                        }
                      )}

                    </div>

                  </article>

                  <div className="mt-6 grid grid-cols-2 gap-3">

                    <button
                      onClick={
                        previousChapter
                      }
                      className="rounded-2xl border border-stone-300 bg-white px-4 py-4 text-sm font-semibold hover:bg-stone-100"
                    >
                      ← Capítulo anterior
                    </button>

                    <button
                      onClick={
                        nextChapter
                      }
                      className="rounded-2xl bg-stone-900 px-4 py-4 text-sm font-semibold text-white hover:bg-stone-700"
                    >
                      Próximo capítulo →
                    </button>

                  </div>

                </section>

              )}

          </>

        )}

        {/* =====================================================
            PESQUISA
        ====================================================== */}

        {activeSection === "search" && (

          <section>

            <div className="mb-8">

              <h2 className="text-3xl font-bold">
                Pesquisar na Bíblia
              </h2>

              <p className="mt-2 text-stone-500">
                Pesquise uma palavra ou frase nos 66 livros.
              </p>

            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">

              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      performSearch();
                    }
                  }}
                  placeholder='Ex.: "amor", "fé", "salvação"...'
                  className="flex-1 rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                />

                <button
                  onClick={
                    performSearch
                  }
                  className="rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700"
                >
                  🔎 Pesquisar
                </button>

              </div>

            </div>

            {searchPerformed && (

              <div className="mt-8">

                <div className="mb-4">

                  <h3 className="text-xl font-bold">
                    {searchResults.length}{" "}
                    resultado
                    {searchResults.length !==
                    1
                      ? "s"
                      : ""}
                  </h3>

                </div>

                {searchResults.length ===
                  0 ? (

                  <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center">
                    <p className="text-stone-500">
                      Nenhum versículo encontrado.
                    </p>
                  </div>

                ) : (

                  <div className="space-y-3">

                    {searchResults
                      .slice(0, 300)
                      .map(
                        (
                          result,
                          index
                        ) => (

                          <button
                            key={`${result.book}-${result.chapter}-${result.verse}-${index}`}
                            onClick={() =>
                              openSearchResult(
                                result
                              )
                            }
                            className="w-full rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
                          >

                            <div className="mb-2 flex items-center justify-between">

                              <span className="font-bold">
                                {
                                  result.book
                                }{" "}
                                {
                                  result.chapter
                                }:
                                {
                                  result.verse
                                }
                              </span>

                              <span className="text-xs text-stone-400">
                                Abrir
                                capítulo →
                              </span>

                            </div>

                            <p className="leading-7 text-stone-700">
                              {
                                result.text
                              }
                            </p>

                          </button>

                        )
                      )}

                  </div>

                )}

                {searchResults.length >
                  300 && (

                  <p className="mt-4 text-center text-sm text-stone-500">
                    Exibindo os primeiros
                    300 resultados.
                  </p>

                )}

              </div>

            )}

          </section>

        )}

        {/* =====================================================
            FAVORITOS
        ====================================================== */}

        {activeSection ===
          "favorites" && (

          <section>

            <h2 className="text-3xl font-bold">
              ⭐ Favoritos
            </h2>

            <p className="mt-2 text-stone-500">
              Versículos que você marcou como favoritos.
            </p>

            <div className="mt-8">

              {favoriteVerses.length ===
              0 ? (

                <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">

                  <div className="text-4xl">
                    ⭐
                  </div>

                  <p className="mt-4 font-semibold">
                    Nenhum favorito ainda.
                  </p>

                  <p className="mt-2 text-sm text-stone-500">
                    Durante a leitura, selecione um versículo e toque em "Favoritar".
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {favoriteVerses.map(
                    (item) => {

                      const cleanId =
                        item.id;

                      const parts =
                        cleanId.split(
                          "-"
                        );

                      const verse =
                        parts.pop();

                      const chapter =
                        parts.pop();

                      const book =
                        parts.join("-");

                      const bibleBook =
                        bible.books[
                          book
                        ];

                      const text =
                        bibleBook?.chapterData[
                          String(chapter)
                        ]?.[String(verse)];

                      return (

                        <button
                          key={item.id}
                          onClick={() =>
                            openSavedVerse(
                              item.id
                            )
                          }
                          className="w-full rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm hover:border-stone-400"
                        >

                          <div className="font-bold">
                            {book}{" "}
                            {chapter}:
                            {verse}
                          </div>

                          <p className="mt-2 leading-7 text-stone-700">
                            {text}
                          </p>

                        </button>

                      );
                    }
                  )}

                </div>

              )}

            </div>

          </section>

        )}

        {/* =====================================================
            ANOTAÇÕES
        ====================================================== */}

        {activeSection === "notes" && (

          <section>

            <h2 className="text-3xl font-bold">
              📝 Anotações
            </h2>

            <p className="mt-2 text-stone-500">
              Suas anotações pessoais sobre os versículos.
            </p>

            <div className="mt-8 space-y-4">

              {annotatedVerses.length ===
              0 ? (

                <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">

                  <div className="text-4xl">
                    📝
                  </div>

                  <p className="mt-4 font-semibold">
                    Nenhuma anotação ainda.
                  </p>

                </div>

              ) : (

                annotatedVerses.map(
                  (item) => {

                    const parts =
                      item.id.split(
                        "-"
                      );

                    const verse =
                      parts.pop();

                    const chapter =
                      parts.pop();

                    const book =
                      parts.join("-");

                    const bibleBook =
                      bible.books[
                        book
                      ];

                    const text =
                      bibleBook?.chapterData[
                        String(chapter)
                      ]?.[
                        String(verse)
                      ];

                    return (

                      <div
                        key={item.id}
                        className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                      >

                        <button
                          onClick={() =>
                            openSavedVerse(
                              item.id
                            )
                          }
                          className="text-left"
                        >

                          <div className="font-bold">
                            {book}{" "}
                            {chapter}:
                            {verse}
                          </div>

                          <p className="mt-2 leading-7 text-stone-700">
                            {text}
                          </p>

                        </button>

                        <div className="mt-4 rounded-xl bg-stone-50 p-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                            Minha anotação
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">
                            {item.note}
                          </p>

                        </div>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </section>

        )}

        {/* =====================================================
            DESTAQUES
        ====================================================== */}

        {activeSection ===
          "highlights" && (

          <section>

            <h2 className="text-3xl font-bold">
              🖍️ Destaques
            </h2>

            <p className="mt-2 text-stone-500">
              Versículos que você marcou para destacar.
            </p>

            <div className="mt-8 space-y-3">

              {highlightedVerses.length ===
              0 ? (

                <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">

                  <div className="text-4xl">
                    🖍️
                  </div>

                  <p className="mt-4 font-semibold">
                    Nenhum destaque ainda.
                  </p>

                </div>

              ) : (

                highlightedVerses.map(
                  (item) => {

                    const parts =
                      item.id.split(
                        "-"
                      );

                    const verse =
                      parts.pop();

                    const chapter =
                      parts.pop();

                    const book =
                      parts.join("-");

                    const bibleBook =
                      bible.books[
                        book
                      ];

                    const text =
                      bibleBook?.chapterData[
                        String(chapter)
                      ]?.[
                        String(verse)
                      ];

                    return (

                      <button
                        key={item.id}
                        onClick={() =>
                          openSavedVerse(
                            item.id
                          )
                        }
                        className="w-full rounded-2xl border border-yellow-200 bg-yellow-100 p-5 text-left shadow-sm hover:bg-yellow-200"
                      >

                        <div className="font-bold">
                          {book}{" "}
                          {chapter}:
                          {verse}
                        </div>

                        <p className="mt-2 leading-7">
                          {text}
                        </p>

                      </button>

                    );
                  }
                )

              )}

            </div>

          </section>

        )}

        {/* RODAPÉ */}

        <footer className="mt-16 border-t border-stone-200 py-8 text-center text-xs text-stone-500">

          <p>
            Bíblia de Estudo
          </p>

          <p className="mt-1">
            Texto: Bíblia Livre • 2018
          </p>

          <p className="mt-1">
            Texto disponibilizado sob licença CC BY 4.0.
          </p>

        </footer>

      </div>

    </main>
  );
}
export const BookOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export const AcademicCapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

export const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? "fill-amber-500 text-amber-500" : "text-stone-400"}`} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

// LOGO DE OLIVEIRA BASEADO NA ILUSTRAÇÃO DETALHADA
export const OliveTreeLogo = () => (
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

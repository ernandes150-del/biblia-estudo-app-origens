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
  <svg className={`w-4 h-4 ${filled ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-dim)]"}`} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

// LOGO DE OLIVEIRA BASEADO NA ILUSTRAÇÃO DETALHADA
export const AppLogo = () => (
  <div className="relative w-11 h-11 bg-gradient-to-b from-[var(--accent-hover)] to-[var(--accent-deep)] rounded-[12px] flex items-center justify-center shadow-lg shrink-0 ring-1 ring-white/20 ring-inset">
    {/* Marca: a letra hebraica Álef (א) — primeira letra do alfabeto hebraico,
        primeira palavra da Torá começa com ela. Identidade própria do app,
        não um clipart de livro genérico. */}
    <span className="font-serif text-[28px] font-bold leading-none text-white select-none drop-shadow-sm" style={{ transform: "translateY(-1px)" }}>
      א
    </span>
    {/* brilho sutil no topo, estilo ícone iOS */}
    <div className="absolute inset-x-1 top-1 h-1/3 rounded-full bg-white/15 blur-[2px] pointer-events-none" />
  </div>
);

// Versão animada do logo pra tela inicial: o Álef se desenha traço por
// traço (efeito de "vídeo se formando"), depois o quadrado ganha
// preenchimento e brilho. Usa a mesma marca (Álef), não um ícone novo.
export const AnimatedLogo = () => (
  <div className="relative w-24 h-24">
    <div
      className="absolute inset-0 rounded-[26px] bg-gradient-to-b from-[var(--accent-hover)] to-[var(--accent-deep)] opacity-0 shadow-2xl ring-1 ring-white/20 ring-inset"
      style={{ animation: "logoBoxIn 0.5s ease 0.9s forwards" }}
    />
    <div
      className="absolute inset-x-3 top-3 h-1/3 rounded-full bg-white/15 blur-[3px] opacity-0 pointer-events-none"
      style={{ animation: "fadeIn 0.5s ease 1.3s forwards" }}
    />
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      {/* Traço principal (diagonal) */}
      <path
        d="M28 74 L74 26"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "drawStroke 0.5s ease 0s forwards",
        }}
      />
      {/* Gancho superior direito */}
      <path
        d="M74 26 L60 40"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "drawStroke 0.35s ease 0.5s forwards",
        }}
      />
      {/* Gancho inferior esquerdo */}
      <path
        d="M28 74 L42 60"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "drawStroke 0.35s ease 0.75s forwards",
        }}
      />
    </svg>
  </div>
);export const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 2.5V5M12 19V21.5M21.5 12H19M5 12H2.5M18.5 5.5L16.8 7.2M7.2 16.8L5.5 18.5M18.5 18.5L16.8 16.8M7.2 7.2L5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

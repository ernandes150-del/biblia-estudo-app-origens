import { AnimatedLogo } from "../lib/icons";

type HomeViewProps = {
  user: { id: string; name: string; email: string } | null;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  emailInput: string;
  setEmailInput: (v: string) => void;
  nameInput: string;
  setNameInput: (v: string) => void;
  passwordInput: string;
  setPasswordInput: (v: string) => void;
  handleAuth: (e: React.FormEvent) => void;
  onStartReading: () => void;
};

export default function HomeView({
  user,
  authMode,
  setAuthMode,
  emailInput,
  setEmailInput,
  nameInput,
  setNameInput,
  passwordInput,
  setPasswordInput,
  handleAuth,
}: HomeViewProps) {
  return (
    <main className="flex-1 flex items-center justify-center relative overflow-y-auto bg-[var(--bg)] py-8">
      {/* GLOW DECORATIVO DE FUNDO */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
        <AnimatedLogo />

        <h1 className="mt-5 text-lg font-semibold tracking-[0.15em] uppercase text-[var(--text)] opacity-0 animate-[fadeIn_0.6s_ease_1.4s_forwards]">
          Bíblia Origens
        </h1>

        {!user && (
          <div className="mt-8 w-full opacity-0 animate-[fadeIn_0.6s_ease_1.8s_forwards]">
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setAuthMode("login")}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                  authMode === "login" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)]"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                  authMode === "register" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)]"
                }`}
              >
                Criar conta
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "register" && (
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
                />
              )}
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="w-full bg-[var(--accent)] text-white font-semibold py-2.5 rounded-lg text-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                {authMode === "login" ? "Entrar" : "Cadastrar"}
              </button>
            </form>

            {/* NÚMEROS REAIS DO ACERVO */}
            <div className="flex items-center justify-center gap-5 pt-8 text-center">
              <div>
                <div className="text-lg font-bold text-[var(--text)]">66</div>
                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">livros</div>
              </div>
              <div className="w-px h-7 bg-[var(--border)]" />
              <div>
                <div className="text-lg font-bold text-[var(--text)]">425 mil</div>
                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">palavras</div>
              </div>
              <div className="w-px h-7 bg-[var(--border)]" />
              <div>
                <div className="text-lg font-bold text-[var(--text)]">25 mil</div>
                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">raízes</div>
              </div>
            </div>

            <p className="text-center text-[10px] text-[var(--text-dim)] pt-6">
              Powered by Ernandes Machado Arruda
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

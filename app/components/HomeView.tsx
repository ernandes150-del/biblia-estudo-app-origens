import type { User } from "../types";

type HomeViewProps = {
  user: User | null;
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
  onStartReading,
}: HomeViewProps) {
  return (
    <main className="flex-1 overflow-y-auto relative z-10">
      {/* GLOW DECORATIVO DE FUNDO */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="max-w-4xl mx-auto space-y-10 p-4 md:p-8 relative">
        <div className="text-center space-y-5 pt-8">
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--accent)] bg-[var(--bg-elevated)] px-3 py-1 rounded-full border border-[var(--border)]">
            Estudo bíblico em hebraico e grego
          </span>

          {/* PALAVRA ORIGINAL EM DESTAQUE, TAMANHO GRANDE */}
          <div className="font-serif text-6xl md:text-7xl font-bold text-[var(--text)] tracking-tight">
            בְּרֵאשִׁית
          </div>
          <p className="text-xs text-[var(--text-muted)] italic -mt-3">be·re·shit · Gênesis 1:1</p>

          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[var(--text)] leading-tight max-w-2xl mx-auto">
            Cada palavra da Bíblia, na sua raiz original
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            Toque em qualquer palavra do texto e veja o hebraico ou grego original, a forma gramatical,
            o número de Strong e todas as outras vezes que aquela palavra aparece na Escritura.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onStartReading}
              className="bg-[var(--accent)] text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-[var(--accent)]/20 hover:bg-[var(--accent-hover)] transition-all"
            >
              Começar a Estudar
            </button>
          </div>

          {/* NÚMEROS REAIS DO ACERVO */}
          <div className="flex items-center justify-center gap-6 md:gap-10 pt-6 text-center">
            <div>
              <div className="text-xl font-bold text-[var(--text)]">66</div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">livros</div>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div>
              <div className="text-xl font-bold text-[var(--text)]">425 mil</div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">palavras analisadas</div>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div>
              <div className="text-xl font-bold text-[var(--text)]">25 mil</div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">raízes (Strong&apos;s)</div>
            </div>
          </div>
        </div>

        {/* CARD DE LOGIN / CADASTRO */}
        {!user && (
          <div className="max-w-md mx-auto bg-[var(--bg-elevated)]/60 border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
              <h2 className="font-serif font-bold text-base text-[var(--text)]">
                {authMode === "login" ? "Acessar Conta" : "Criar Nova Conta"}
              </h2>
              <button
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-xs text-[var(--accent)] underline font-medium"
              >
                {authMode === "login" ? "Criar conta" : "Já tenho conta"}
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "register" && (
                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">Nome completo</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              )}
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">Senha</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--accent)] text-white font-semibold py-2 rounded-lg text-xs hover:bg-[var(--accent-hover)] transition-colors mt-2"
              >
                {authMode === "login" ? "Entrar" : "Cadastrar"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

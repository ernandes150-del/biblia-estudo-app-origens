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
    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
        <div className="text-center space-y-4 pt-4">
          <span className="text-xs font-bold tracking-widest uppercase text-[#425447] bg-[#EAE8DD] px-3 py-1 rounded-full border border-[#D8D5C5]">
            Plataforma de Estudo Exegético
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1F2923] leading-tight">
            Explore a Bíblia nas Suas Línguas Originais
          </h1>
          <p className="text-sm text-[#526356] max-w-2xl mx-auto leading-relaxed">
            Consulte os textos em Hebraico e Grego com análise gramatical interlinear, contexto histórico dos livros e caderno de estudos pessoal.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onStartReading}
              className="bg-[#2D3B32] text-[#F6F5F0] px-6 py-2.5 rounded-xl font-medium text-sm shadow-md hover:bg-[#3A4B40] transition-all"
            >
              Começar Leitura
            </button>
          </div>
        </div>

        {/* CARD DE LOGIN / CADASTRO */}
        {!user && (
          <div className="max-w-md mx-auto bg-[#EAE8DD]/60 border border-[#D8D5C5] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#D8D5C5] pb-3">
              <h2 className="font-serif font-bold text-base text-[#2D3B32]">
                {authMode === "login" ? "Acessar Conta" : "Criar Nova Conta"}
              </h2>
              <button
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-xs text-[#425447] underline font-medium"
              >
                {authMode === "login" ? "Criar conta" : "Já tenho conta"}
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "register" && (
                <div>
                  <label className="text-[11px] font-semibold text-[#526356] block mb-1">Nome completo</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2D3B32]"
                  />
                </div>
              )}
              <div>
                <label className="text-[11px] font-semibold text-[#526356] block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2D3B32]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#526356] block mb-1">Senha</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F6F5F0] border border-[#D8D5C5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2D3B32]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D3B32] text-[#F6F5F0] font-semibold py-2 rounded-lg text-xs hover:bg-[#3A4B40] transition-colors mt-2"
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

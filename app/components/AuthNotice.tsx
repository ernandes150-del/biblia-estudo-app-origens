type AuthNoticeProps = {
  message: string;
  onGoToLogin: () => void;
};

export default function AuthNotice({ message, onGoToLogin }: AuthNoticeProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#1C1C1E] text-[#F5F5F7] border border-[#0A84FF]/60 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md animate-bounce">
      <div className="text-amber-400">⚠️</div>
      <div className="flex-1 text-xs">
        <p className="font-semibold">{message}</p>
        <p className="text-[10px] text-[#8E8E93]">Faça login para habilitar o caderno de estudos pessoal.</p>
      </div>
      <button
        onClick={onGoToLogin}
        className="bg-[#0A84FF] text-white font-bold px-2.5 py-1 rounded text-[10px] hover:bg-[#3B9EFF]"
      >
        Entrar
      </button>
    </div>
  );
}

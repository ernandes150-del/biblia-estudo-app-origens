type AuthNoticeProps = {
  message: string;
  onGoToLogin: () => void;
};

export default function AuthNotice({ message, onGoToLogin }: AuthNoticeProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#1B1B1D] text-[#F1EBD9] border border-[#C9A227]/60 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md animate-bounce">
      <div className="text-amber-400">⚠️</div>
      <div className="flex-1 text-xs">
        <p className="font-semibold">{message}</p>
        <p className="text-[10px] text-[#8A8378]">Faça login para habilitar o caderno de estudos pessoal.</p>
      </div>
      <button
        onClick={onGoToLogin}
        className="bg-[#C9A227] text-[#0F0F10] font-bold px-2.5 py-1 rounded text-[10px] hover:bg-[#DDB94A]"
      >
        Entrar
      </button>
    </div>
  );
}

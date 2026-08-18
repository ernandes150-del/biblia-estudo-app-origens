type AuthNoticeProps = {
  message: string;
  onGoToLogin: () => void;
};

export default function AuthNotice({ message, onGoToLogin }: AuthNoticeProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#2D3B32] text-[#F6F5F0] border border-[#425447] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md animate-bounce">
      <div className="text-amber-400">⚠️</div>
      <div className="flex-1 text-xs">
        <p className="font-semibold">{message}</p>
        <p className="text-[10px] text-[#A8B6AB]">Faça login para habilitar o caderno de estudos pessoal.</p>
      </div>
      <button
        onClick={onGoToLogin}
        className="bg-amber-500 text-stone-900 font-bold px-2.5 py-1 rounded text-[10px] hover:bg-amber-400"
      >
        Entrar
      </button>
    </div>
  );
}

import type { InterlinearWord } from "../types";

type LexiconModalProps = {
  word: InterlinearWord;
  onClose: () => void;
};

export default function LexiconModal({ word, onClose }: LexiconModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F6F5F0] border border-[#D8D5C5] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
      >
        <div className="flex items-start justify-between border-b border-[#D8D5C5] pb-3">
          <div>
            <span className="text-[10px] font-bold text-[#425447] bg-[#EAE8DD] px-2 py-0.5 rounded uppercase">
              {word.strong || "Léxico"}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#2D3B32] mt-1">
              {word.original} ({word.translit})
            </h3>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-[#526356]">
            ✕
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <p><strong>Glosa literal (fonte, inglês):</strong> {word.translation}</p>
          <p><strong>Gramática:</strong> {word.grammar}</p>
          <p><strong>Morfologia:</strong> {word.morphology}</p>
          <div className="pt-2 border-t border-[#D8D5C5]">
            <strong className="block mb-1">Significado (léxico, inglês):</strong>
            <p className="text-[#526356] leading-relaxed">{word.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

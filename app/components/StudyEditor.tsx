import { useEffect, useRef, useState } from "react";
import {
  createBlock,
  parseStudyBlocks,
  serializeStudyBlocks,
  type StudyBlock,
  type StudyBlockType,
} from "../lib/studyBlocks";

type StudyEditorProps = {
  value: string | undefined;
  onChange: (serialized: string) => void;
};

const TYPE_LABEL: Record<StudyBlockType, string> = {
  heading: "H",
  paragraph: "P",
  bullet: "•",
};

export default function StudyEditor({ value, onChange }: StudyEditorProps) {
  const [blocks, setBlocks] = useState<StudyBlock[]>(() => {
    const initial = parseStudyBlocks(value);
    return initial.length > 0 ? initial : [createBlock()];
  });

  // Se o versículo selecionado mudar (prop value muda por fora), recarrega
  // os blocos a partir do novo valor — ajuste feito durante a renderização,
  // não em efeito, seguindo o padrão de "resetar estado quando uma prop muda".
  const [trackedValue, setTrackedValue] = useState(value);
  if (trackedValue !== value) {
    setTrackedValue(value);
    const next = parseStudyBlocks(value);
    setBlocks(next.length > 0 ? next : [createBlock()]);
  }

  const commit = (next: StudyBlock[]) => {
    setBlocks(next);
    onChange(serializeStudyBlocks(next));
  };

  const updateText = (id: string, text: string) => {
    commit(blocks.map((b) => (b.id === id ? { ...b, text } : b)));
  };

  const updateType = (id: string, type: StudyBlockType) => {
    commit(blocks.map((b) => (b.id === id ? { ...b, type } : b)));
  };

  const addBlockAfter = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const next = [...blocks];
    next.splice(idx + 1, 0, createBlock());
    commit(next);
  };

  const removeBlock = (id: string) => {
    const next = blocks.filter((b) => b.id !== id);
    commit(next.length > 0 ? next : [createBlock()]);
  };

  return (
    <div className="space-y-1.5">
      {blocks.map((block) => (
        <StudyBlockRow
          key={block.id}
          block={block}
          onTextChange={(text) => updateText(block.id, text)}
          onTypeChange={(type) => updateType(block.id, type)}
          onEnter={() => addBlockAfter(block.id)}
          onRemove={() => removeBlock(block.id)}
          canRemove={blocks.length > 1}
        />
      ))}
    </div>
  );
}

function StudyBlockRow({
  block,
  onTextChange,
  onTypeChange,
  onEnter,
  onRemove,
  canRemove,
}: {
  block: StudyBlock;
  onTextChange: (text: string) => void;
  onTypeChange: (type: StudyBlockType) => void;
  onEnter: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [block.text]);

  const textClass =
    block.type === "heading"
      ? "font-serif font-bold text-sm text-[var(--text)]"
      : "text-xs text-[var(--text-secondary)]";

  return (
    <div className="flex items-start gap-1.5 group">
      <div className="flex gap-0.5 pt-1 shrink-0">
        {(["heading", "paragraph", "bullet"] as StudyBlockType[]).map((t) => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
              block.type === t ? "bg-[var(--accent)] text-white" : "text-[var(--text-dim)] opacity-0 group-hover:opacity-100"
            }`}
            title={t === "heading" ? "Título" : t === "bullet" ? "Item de lista" : "Parágrafo"}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {block.type === "bullet" && <span className="text-[var(--text-dim)] pt-1 text-xs shrink-0">•</span>}

      <textarea
        ref={ref}
        rows={1}
        value={block.text}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter();
          }
          if (e.key === "Backspace" && block.text === "" && canRemove) {
            e.preventDefault();
            onRemove();
          }
        }}
        placeholder={block.type === "heading" ? "Título da seção..." : "Escreva aqui..."}
        className={`flex-1 bg-transparent border-none resize-none focus:outline-none leading-relaxed py-0.5 ${textClass}`}
      />

      {canRemove && (
        <button
          onClick={onRemove}
          className="text-[var(--text-dim)] opacity-0 group-hover:opacity-100 text-xs px-1"
          title="Remover bloco"
        >
          ✕
        </button>
      )}
    </div>
  );
}

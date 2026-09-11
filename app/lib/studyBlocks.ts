// Editor de estudo estruturado: o conteúdo é guardado como JSON (lista de
// blocos) dentro do mesmo campo de texto que já existia no banco
// (verse_notes.study) — sem precisar mudar o esquema do banco. Notas antigas,
// que eram texto puro, continuam funcionando: viram um único bloco de
// parágrafo na primeira leitura.

export type StudyBlockType = "heading" | "paragraph" | "bullet";

export type StudyBlock = {
  id: string;
  type: StudyBlockType;
  text: string;
};

function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function parseStudyBlocks(raw: string | undefined): StudyBlock[] {
  if (!raw || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((b) => b && typeof b.text === "string" && typeof b.type === "string")) {
      return parsed.map((b) => ({ id: b.id || newId(), type: b.type, text: b.text }));
    }
  } catch {
    // não era JSON — é uma nota antiga em texto puro
  }

  return [{ id: newId(), type: "paragraph", text: raw }];
}

export function serializeStudyBlocks(blocks: StudyBlock[]): string {
  const meaningful = blocks.filter((b) => b.text.trim() !== "");
  if (meaningful.length === 0) return "";
  return JSON.stringify(meaningful);
}

export function studyBlocksToPlainText(blocks: StudyBlock[]): string {
  return blocks.map((b) => (b.type === "bullet" ? `• ${b.text}` : b.text)).join(" ");
}

export function createBlock(type: StudyBlockType = "paragraph"): StudyBlock {
  return { id: newId(), type, text: "" };
}

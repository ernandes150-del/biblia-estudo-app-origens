import { supabase } from "./supabaseClient";
import type { UserData, VerseNote } from "../types";

type VerseNoteRow = {
  verse_key: string;
  favorite: boolean;
  highlighted: boolean;
  note: string;
  study: string;
};

// Busca todas as anotações do usuário logado e monta o UserData no formato
// que o resto do app já espera ("Livro-Cap-Vers" -> VerseNote).
export async function fetchUserData(userId: string): Promise<UserData> {
  const { data, error } = await supabase
    .from("verse_notes")
    .select("verse_key, favorite, highlighted, note, study")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao carregar anotações do Supabase:", error.message);
    return {};
  }

  const result: UserData = {};
  for (const row of (data ?? []) as VerseNoteRow[]) {
    result[row.verse_key] = {
      favorite: row.favorite,
      highlighted: row.highlighted,
      note: row.note,
      study: row.study,
    };
  }
  return result;
}

// Grava (upsert) a anotação de um único versículo. Se a nota ficou "vazia"
// (sem favorito, destaque, nota ou estudo), apaga a linha para não acumular
// lixo no banco.
export async function upsertVerseNote(
  userId: string,
  verseKey: string,
  note: VerseNote
): Promise<void> {
  const isEmpty =
    !note.favorite && !note.highlighted && !note.note.trim() && !(note.study ?? "").trim();

  if (isEmpty) {
    const { error } = await supabase
      .from("verse_notes")
      .delete()
      .eq("user_id", userId)
      .eq("verse_key", verseKey);
    if (error) console.error("Erro ao remover anotação vazia:", error.message);
    return;
  }

  const { error } = await supabase.from("verse_notes").upsert({
    user_id: userId,
    verse_key: verseKey,
    favorite: note.favorite,
    highlighted: note.highlighted,
    note: note.note,
    study: note.study ?? "",
  });

  if (error) console.error("Erro ao salvar anotação no Supabase:", error.message);
}

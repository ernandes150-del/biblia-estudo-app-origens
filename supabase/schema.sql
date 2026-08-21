-- Bíblia Origens — Fase 3: esquema de persistência real (Supabase)
-- Rode este script inteiro no SQL Editor do seu projeto Supabase.

-- Tabela de anotações por versículo, uma linha por (usuário, versículo).
create table if not exists public.verse_notes (
  user_id     uuid references auth.users(id) on delete cascade not null,
  verse_key   text not null, -- ex: "Gênesis-1-1"
  favorite    boolean not null default false,
  highlighted boolean not null default false,
  note        text not null default '',
  study       text not null default '',
  updated_at  timestamptz not null default now(),
  primary key (user_id, verse_key)
);

-- Segurança em nível de linha: cada usuário só enxerga/edita as próprias notas.
alter table public.verse_notes enable row level security;

create policy "Usuário lê suas próprias notas"
  on public.verse_notes for select
  using (auth.uid() = user_id);

create policy "Usuário insere suas próprias notas"
  on public.verse_notes for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza suas próprias notas"
  on public.verse_notes for update
  using (auth.uid() = user_id);

create policy "Usuário apaga suas próprias notas"
  on public.verse_notes for delete
  using (auth.uid() = user_id);

-- Mantém updated_at sempre atualizado automaticamente.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_verse_notes_updated_at on public.verse_notes;
create trigger set_verse_notes_updated_at
  before update on public.verse_notes
  for each row execute function public.set_updated_at();

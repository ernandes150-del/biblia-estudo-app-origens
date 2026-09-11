-- Bíblia Origens — esquema de persistência (Supabase)
-- Rode este script inteiro no SQL Editor do seu projeto Supabase.
-- Idempotente: pode rodar de novo com segurança (usa "if not exists" e
-- recria políticas/triggers).

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = '';

-- Notas por versículo (favorito, destaque, nota livre, estudo)
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

alter table public.verse_notes enable row level security;

drop policy if exists "Usuário lê suas próprias notas" on public.verse_notes;
create policy "Usuário lê suas próprias notas"
  on public.verse_notes for select using (auth.uid() = user_id);

drop policy if exists "Usuário insere suas próprias notas" on public.verse_notes;
create policy "Usuário insere suas próprias notas"
  on public.verse_notes for insert with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza suas próprias notas" on public.verse_notes;
create policy "Usuário atualiza suas próprias notas"
  on public.verse_notes for update using (auth.uid() = user_id);

drop policy if exists "Usuário apaga suas próprias notas" on public.verse_notes;
create policy "Usuário apaga suas próprias notas"
  on public.verse_notes for delete using (auth.uid() = user_id);

drop trigger if exists set_verse_notes_updated_at on public.verse_notes;
create trigger set_verse_notes_updated_at
  before update on public.verse_notes
  for each row execute function public.set_updated_at();

-- Notas ligadas à palavra original (Strong's), não a um versículo específico
create table if not exists public.word_notes (
  user_id     uuid references auth.users(id) on delete cascade not null,
  strong      text not null, -- ex: "H2617"
  note        text not null default '',
  updated_at  timestamptz not null default now(),
  primary key (user_id, strong)
);

alter table public.word_notes enable row level security;

drop policy if exists "Usuário lê suas próprias notas de palavra" on public.word_notes;
create policy "Usuário lê suas próprias notas de palavra"
  on public.word_notes for select using (auth.uid() = user_id);

drop policy if exists "Usuário insere suas próprias notas de palavra" on public.word_notes;
create policy "Usuário insere suas próprias notas de palavra"
  on public.word_notes for insert with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza suas próprias notas de palavra" on public.word_notes;
create policy "Usuário atualiza suas próprias notas de palavra"
  on public.word_notes for update using (auth.uid() = user_id);

drop policy if exists "Usuário apaga suas próprias notas de palavra" on public.word_notes;
create policy "Usuário apaga suas próprias notas de palavra"
  on public.word_notes for delete using (auth.uid() = user_id);

drop trigger if exists set_word_notes_updated_at on public.word_notes;
create trigger set_word_notes_updated_at
  before update on public.word_notes
  for each row execute function public.set_updated_at();

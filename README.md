This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Créditos de dados

O léxico interlinear (Strong's, gramática e morfologia hebraica/grega) em
`public/lexicon/` é derivado do **STEPBible-Data**, de "STEP Bible"
([www.STEPBible.org](https://www.STEPBible.org)) com base em trabalho da
Tyndale House, Cambridge, disponibilizado sob licença **CC BY 4.0**
(https://github.com/STEPBible/STEPBible-Data). O texto bíblico em português
usado no app é da Bíblia Livre (CC BY 4.0, eBible.org).

## Autenticação e persistência (Supabase)

Login/cadastro e as anotações de estudo (favoritos, destaques, notas) usam o
[Supabase](https://supabase.com) (Auth + Postgres).

1. Crie um projeto gratuito em https://supabase.com.
2. No SQL Editor do projeto, rode o script `supabase/schema.sql` deste
   repositório — ele cria a tabela `verse_notes` com Row Level Security (cada
   usuário só acessa as próprias anotações).
3. Em Project Settings > API, copie a **Project URL** e a chave
   **anon public**.
4. Copie `.env.local.example` para `.env.local` e preencha essas duas
   variáveis.
5. Na Vercel, adicione as mesmas duas variáveis em
   Project Settings > Environment Variables antes do próximo deploy.

Por padrão, o Supabase exige confirmação de e-mail para novas contas. Isso
pode ser desativado em Authentication > Providers > Email, se quiser permitir
login imediato após o cadastro.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

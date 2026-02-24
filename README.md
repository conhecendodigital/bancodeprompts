# 🍌 BANCO DE PROMPTS

Biblioteca comunitária de prompts de IA para geração de imagens. Galeria visual com scraping automatizado, filtros dinâmicos e detalhes técnicos de cada prompt.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase)
![n8n](https://img.shields.io/badge/n8n-Automação-EA4B71?logo=n8n)

---

## Estrutura do Projeto

```
bancodeprompts/
├── web/                       # App Next.js 16 (frontend)
│   ├── src/app/               # Rotas (galeria + detalhes)
│   ├── src/components/        # PromptCard, SearchFilters, PromptGrid
│   └── src/lib/               # Cliente Supabase
├── supabase/migrations/       # Migrations SQL versionadas
│   ├── 001_initial_schema.sql
│   ├── 003_Automation_Configuration_Store.sql
│   ├── 004_Automation_config_state_store.sql
│   └── 005_Add_model_name_column_to_prompts_vault.sql
├── automations/n8n/           # Workflow exportado em JSON
├── docs/                      # Documentação técnica
└── README.md
```

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| **Node.js** | 18+ |
| **npm** | 9+ |
| **Conta Supabase** | Gratuita em [supabase.com](https://supabase.com) |

---

## Setup — Passo a Passo

### 1. Clonar o repositório

```bash
git clone https://github.com/conhecendodigital/bancodeprompts.git
cd bancodeprompts
```

### 2. Instalar dependências

```bash
cd web
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `web/.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

> ⚠️ **Nunca** comite o `.env.local`. Ele já está no `.gitignore`.

**Onde encontrar as chaves:**
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto → **Settings** → **API**
3. Copie a `URL` e a `anon public` key

### 4. Criar as tabelas no Supabase

No **SQL Editor** do Supabase, execute os scripts na ordem:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/003_Automation_Configuration_Store.sql
supabase/migrations/004_Automation_config_state_store.sql
supabase/migrations/005_Add_model_name_column_to_prompts_vault.sql
```

### 5. Rodar o servidor

```bash
npm run dev
```

Acesse **http://localhost:3000** 🚀

---

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Galeria** | Grid de cards com imagens full-bleed e overlay transparente |
| **Filtros dinâmicos** | Sticky, com categorias colapsáveis e tags do banco |
| **Página de detalhes** | Layout duas colunas, copiar prompt, modelo de IA, tags |
| **Busca** | Pesquisa por título ou conteúdo do prompt |
| **Scraper n8n** | Coleta automática diária (meta: 10 novos/dia) |

---

## Automação (n8n)

O workflow `BANCO DE PROMPTS - Deep Scraper` roda diariamente às 03:00 e coleta prompts automaticamente do [bananaprompts.xyz](https://www.bananaprompts.xyz).

**Para usar:**
1. Importe `automations/n8n/BANCO DE PROMPTS - Deep Scraper.json` no seu n8n
2. Configure a credencial do Supabase
3. Ative o workflow

Documentação completa em `docs/scraping_guide.md`.

---

## Padrões do Projeto

- **SQL**: Migrations versionadas em `supabase/migrations/` no formato `00X_nome.sql`
- **Código**: TypeScript strict, nomes semânticos, componentes React modulares
- **Git**: Commits semânticos (`feat:`, `fix:`, `chore:`, `style:`, `perf:`)

---

## Licença

Projeto privado — © Conhecendo Digital.

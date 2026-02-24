# Frontend Guide — BANCO DE PROMPTS

## Visão Geral

| Item | Detalhe |
|------|---------|
| **Framework** | Next.js 15 (App Router) |
| **Estilização** | Tailwind CSS v4 |
| **Tipografia** | Inter (Google Fonts) |
| **Tema** | Light Mode (fundo branco) |
| **Dados** | Supabase (`prompts_vault`) |
| **Diretório** | `/web/` |

## Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#FFFFFF` | Fundo principal |
| `--bg-subtle` | `#F8F9FA` | Cards de filtro, seções secundárias |
| `--bg-card` | `#1A1A2E` | Fundo dos cards de prompt |
| `--text` | `#1A1A2E` | Texto primário |
| `--text-muted` | `#6B7280` | Texto secundário, placeholders |
| `--accent` | `#6C5CE7` | Botões, links ativos, tags selecionadas |
| `--accent-hover` | `#5A4BD1` | Hover nos botões |
| `--accent-light` | `#EDE9FE` | Badges, backgrounds sutis |
| `--border` | `#E5E7EB` | Bordas de inputs e cards |

## Conexão com Supabase

O arquivo `.env.local` contém as variáveis de ambiente. **Nunca faça commit deste arquivo.**

```env
NEXT_PUBLIC_SUPABASE_URL=https://bvgkieylcippmqpzqqdo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

O client está em `src/lib/supabase.ts` e exporta:
- `supabase` — instância do client
- `Prompt` — interface TypeScript matching `prompts_vault`

## Estrutura de Componentes

```
src/
├── app/
│   ├── layout.tsx      # Layout raiz (Inter, metadata PT-BR, Header)
│   ├── globals.css     # Tokens CSS + Tailwind
│   └── page.tsx        # Página principal (fetch, filtros, grid)
├── components/
│   ├── Header.tsx      # Nav sticky (Início, Explorar, Sobre) + mobile
│   ├── SearchFilters.tsx # REFINAR GALERIA (busca + tags por categoria)
│   ├── PromptCard.tsx  # Card com imagem, título, preview, botão Copiar
│   └── PromptGrid.tsx  # Grid responsivo + skeletons + estado vazio
└── lib/
    └── supabase.ts     # Client + interface Prompt
```

## Funcionalidades

| Feature | Componente | Detalhe |
|---|---|---|
| Busca em tempo real | `SearchFilters` | Debounce 300ms, filtra título/prompt/autor |
| Tags por categoria | `SearchFilters` | 5 categorias, seleção múltipla, visual pill |
| Copiar prompt | `PromptCard` | `navigator.clipboard` + fallback `execCommand` |
| Grid responsivo | `PromptGrid` | 1 col (mobile) → 2 (tablet) → 3 (desktop) |
| Loading skeleton | `PromptGrid` | 6 skeleton cards enquanto carrega |
| Estado vazio | `PromptGrid` | Mensagem amigável quando filtro não encontra |

## Como Rodar

Abra o terminal na pasta `/web/` e execute na ordem:

```bash
# 1. Instalar dependências do Next.js (já scaffoldado)
npm install

# 2. Instalar Supabase client
npm install @supabase/supabase-js

# 3. Rodar em desenvolvimento
npm run dev
```

O site abre em `http://localhost:3000`.

## Build de Produção

```bash
npm run build
npm start
```

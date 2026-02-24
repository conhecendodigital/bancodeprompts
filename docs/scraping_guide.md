# Scraping Guide — BANCO DE PROMPTS

Documentação da automação de extração de prompts do [bananaprompts.xyz](https://www.bananaprompts.xyz/explore).

## Visão Geral

| Aspecto | Detalhe |
|---------|---------|
| **Workflow n8n** | `BANCO DE PROMPTS - Deep Scraper` |
| **ID** | `tKRng0JHYv4y5lTa` |
| **Versão** | V4 FINAL (com `model_name`) |
| **Nós** | 10 |
| **Schedule** | Diário, 03:00 (São Paulo) |
| **Tabela Supabase** | `prompts_vault` |
| **Credencial** | `bancodeprompts` (`ta1XyquWeL2aUlgz`) |
| **JSON** | `automations/n8n/deep_scraper_bancodeprompts_V4_FINAL.json` |

## Fluxo do Workflow (V4)

```
Agendamento Diário
  → Iniciar Contador (maxPages=1)
    → Buscar Página de Prompts (GET /api/prompts?page=N)
      → Filtrar & Transformar (remove premium, normaliza schema)
        → Buscar Detalhes (GET /api/prompts/{id}) ← NOVO
          → Extrair Model Name (model/tool/generator) ← NOVO
            → Tem Original ID? (Boolean: !!$json.original_id)
              ├─ True  → Salvar no Supabase → Check Pagination
              └─ False ────────────────────→ Check Pagination
                                                → Mais Páginas?
                                                  ├─ True  → Loop (Buscar Página)
                                                  └─ False → FIM
```

## Nós — Detalhamento

### 1. Agendamento Diário
- **Tipo:** Schedule Trigger
- **Cron:** `0 3 * * *` (03h diariamente)

### 2. Iniciar Contador
- **Tipo:** Code
- **maxPages:** 1 (limite de segurança, aumente gradualmente)

### 3. Buscar Página de Prompts
- **Tipo:** HTTP Request (GET)
- **URL:** `https://www.bananaprompts.xyz/api/prompts?page={{page}}&limit=100&sort=newest`
- **Retry:** 3 tentativas, 2s entre cada

### 4. Filtrar & Transformar
- **Tipo:** Code
- Remove prompts premium e vazios
- Normaliza para schema: `original_id`, `title`, `full_prompt`, `image_url`, `author_name`, `tags`, `source_url`

### 5. Buscar Detalhes ← NOVO (V4)
- **Tipo:** HTTP Request (GET)
- **URL:** `https://www.bananaprompts.xyz/api/prompts/{{ $json.original_id }}`
- **continueOnFail:** `true` (se a API falhar, pula o item)
- **Retry:** 2 tentativas, 1s entre cada
- **Propósito:** Obter detalhes do prompt (incluindo modelo de IA)

### 6. Extrair Model Name ← NOVO (V4)
- **Tipo:** Code
- Tenta extrair de: `model`, `tool`, `generator`, `modelName`, `ai_model`
- Preserva todos os campos originais + adiciona `model_name`
- Se houve erro na requisição anterior, passa o item sem alterar

### 7. Tem Original ID?
- **Tipo:** If (Boolean)
- **Expressão:** `={{ !!$json.original_id }}` → `is true`

### 8. Salvar no Supabase
- **Operação:** create
- **Data to Send:** Auto-Map Input Data
- **Inputs to Ignore:** `_meta`
- **Colunas mapeadas:** `original_id`, `title`, `full_prompt`, `image_url`, `author_name`, `tags`, `source_url`, `model_name`

### 9–10. Check Pagination + Mais Páginas?
- Controle de loop com `maxPages` como limite

## Configuração Supabase

### Schema `prompts_vault`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK) | Gerado automaticamente |
| `original_id` | TEXT (UNIQUE) | ID do prompt no bananaprompts |
| `title` | TEXT | Título do prompt |
| `full_prompt` | TEXT | Texto completo do prompt |
| `image_url` | TEXT | URL da imagem gerada |
| `author_name` | TEXT | Nome do criador |
| `tags` | TEXT[] | Array de tags |
| `source_url` | TEXT | Link original |
| `model_name` | TEXT | Modelo/ferramenta de IA ← NOVO |
| `captured_at` | TIMESTAMPTZ | Data de captura |

### Migração para V4

```sql
-- supabase/migrations/002_add_model_name.sql
ALTER TABLE prompts_vault
ADD COLUMN IF NOT EXISTS model_name TEXT DEFAULT NULL;
```

> **Importante:** Execute esta migração no Supabase SQL Editor antes de rodar o workflow V4.

## Estabilidade

- `continueOnFail: true` no nó Buscar Detalhes → se a API de detalhes falhar, o prompt é salvo sem model_name
- `retryOnFail` com `maxTries` em ambos HTTP Requests
- `onError: continueRegularOutput` → erros não param o workflow

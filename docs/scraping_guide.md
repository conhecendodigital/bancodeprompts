# Scraping Guide — BANCO DE PROMPTS

Documentação da automação de extração de prompts do [bananaprompts.xyz](https://www.bananaprompts.xyz/explore).

## Visão Geral

| Aspecto | Detalhe |
|---------|---------|
| **Workflow n8n** | `BANCO DE PROMPTS - Deep Scraper` |
| **ID** | `tKRng0JHYv4y5lTa` |
| **Versão** | V5 — Meta Diária de 10 |
| **Nós** | 11 |
| **Schedule** | Diário, 03:00 (São Paulo) |
| **Tabela Supabase** | `prompts_vault` |
| **Credencial** | `bancodeprompts` (`ta1XyquWeL2aUlgz`) |

## Fluxo do Workflow (V5)

```
Agendamento Diário (03:00)
  → Carregar IDs Existentes (Supabase getAll original_id)
    → Iniciar Contador (meta=10, cap=500, existingIds em memória)
      → Buscar Página de Prompts (GET /api/prompts?page=N)
        → Filtrar Inéditos (compara com existingIds, limita à meta)
          → Tem Original ID?
            ├─ True → Buscar Detalhes → Extrair Model Name → Salvar
            └─ False → (descartado)
          → Contabilizar Novos (acumula novos_hoje e totalVerificados)
            → Meta Atingida?
              ├─ novos < 10 E verificados < 500 → próxima página (loop)
              └─ meta atingida OU cap 500 → FIM
```

## Lógica da Meta Diária

| Variável | Descrição | Default |
|----------|-----------|---------|
| `metaDiaria` | Quantos prompts novos coletar por dia | 10 |
| `capVerificados` | Máximo de itens verificados (trava anti-loop) | 500 |
| `novos_hoje` | Contador de novos salvos no dia | 0 |
| `totalVerificados` | Contador total de itens analisados | 0 |

### Condições de parada:
1. **Meta atingida:** `novos_hoje >= 10`
2. **Cap de segurança:** `totalVerificados >= 500`
3. **Fim dos dados:** `hasMore === false`

### Blindagem de Duplicatas
- No início, `Carregar IDs Existentes` busca **todos** os `original_id` do Supabase
- `Iniciar Contador` converte para `Set` em memória
- `Filtrar Inéditos` compara cada item contra o Set → só prosseguem os inéditos
- **Zero queries extras** — verificação 100% em memória

## Nós — Detalhamento

### 1. Agendamento Diário
- **Cron:** `0 3 * * *`

### 2. Carregar IDs Existentes ← NOVO (V5)
- **Tipo:** Supabase (getAll)
- **Tabela:** `prompts_vault`
- **returnAll:** true
- Carrega todos os registros existentes para filtro em memória

### 3. Iniciar Contador ← MODIFICADO (V5)
- Converte registros existentes para `Set<original_id>`
- Inicializa: `novos_hoje=0`, `totalVerificados=0`, `metaDiaria=10`, `capVerificados=500`

### 4. Buscar Página de Prompts
- GET `?page={{page}}&limit=100&sort=newest`
- Retry: 3x, 2s intervalo

### 5. Filtrar Inéditos ← RENOMEADO (V5)
- Remove premium e vazios
- Compara contra `existingIds` Set (O(1) por item)
- Limita ao `quantosFaltam` (meta - novos_hoje)
- Se nenhum inédito → emite `_skip` com flag `deveContinuar`

### 6. Tem Original ID?
- Boolean: `!!$json.original_id`

### 7. Buscar Detalhes
- GET `/api/prompts/{id}` (continueOnFail, 2 retries)

### 8. Extrair Model Name
- Campos testados: `model`, `tool`, `generator`, `modelName`, `ai_model`

### 9. Salvar no Supabase
- Auto-Map, ignora `_meta`

### 10. Contabilizar Novos ← NOVO (V5)
- Acumula `novos_hoje` e `totalVerificados`
- Calcula `deveContinuar` baseado nas 3 condições de parada
- Emite `motivo` legível: `meta_atingida`, `cap_500_atingido`, ou `sem_mais_paginas`

### 11. Meta Atingida? ← RENOMEADO (V5)
- `$json.continue === true` → loop para próxima página
- `false` → workflow termina

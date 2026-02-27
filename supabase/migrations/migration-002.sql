-- =============================================================================
-- Migration: 002_create_automation_config.sql
-- Descrição: Tabela de estado persistido para a automação n8n.
-- Permite que o workflow retome de onde parou entre execuções.
-- Criado em: 2026-02-24
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.automation_config (
    key        TEXT        PRIMARY KEY,
    value      JSONB       NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE  public.automation_config       IS 'Armazena estado persistido de automações n8n entre execuções.';
COMMENT ON COLUMN public.automation_config.key   IS 'Identificador único da configuração (ex: banana_prompts_state).';
COMMENT ON COLUMN public.automation_config.value IS 'Estado serializado em JSON da automação.';

-- =============================================================================
-- Estado inicial do coletor de prompts (banana_prompts_state)
--
-- pagina_atual : página atual da paginação (incrementa a cada execução)
-- total_salvo  : total acumulado de prompts salvos no vault
-- =============================================================================

INSERT INTO public.automation_config (key, value)
VALUES (
    'banana_prompts_state',
    '{
        "pagina_atual": 0,
        "total_salvo": 0
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

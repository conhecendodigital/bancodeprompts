-- =============================================================================
-- Migration: 002_create_automation_config.sql
-- Descrição: Tabela de estado persistido para a automação n8n.
-- Permite que o workflow retome de onde parou entre execuções diárias.
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
-- last_good_offset : último offset onde foram encontrados prompts novos
--                    (ponto de retomada na próxima execução diária)
-- current_offset   : offset da iteração atual dentro do mesmo dia
-- novos_hoje       : contador de novos prompts na execução corrente
-- totalVerificados : total de prompts verificados na execução corrente
-- last_run_date    : data da última execução (formato YYYY-MM-DD)
-- =============================================================================

INSERT INTO public.automation_config (key, value)
VALUES (
    'banana_prompts_state',
    '{
        "last_good_offset": 0,
        "current_offset": 0,
        "novos_hoje": 0,
        "totalVerificados": 0,
        "last_run_date": null
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

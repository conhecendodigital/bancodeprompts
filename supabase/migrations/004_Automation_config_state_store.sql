-- Migration: 003_add_automation_config.sql
-- Descrição: Tabela de estado persistido para a automação n8n
-- Permite que o workflow retome de onde parou entre execuções diárias

CREATE TABLE IF NOT EXISTS public.automation_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estado inicial do coletor de prompts
-- last_good_offset: último offset onde encontrou prompts novos (retoma daqui no dia seguinte)
-- current_offset:   offset da iteração atual (dentro do mesmo dia)
-- novos_hoje:       contador de novos na execução atual
-- last_run_date:    data da última execução (formato YYYY-MM-DD)
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
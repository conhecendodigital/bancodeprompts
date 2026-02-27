-- =============================================================================
-- Migration: 003_create_published_prompts.sql
-- Descrição: Tabela de controle de prompts publicados no site.
-- Registra quais prompts do vault já foram publicados e quando.
-- Criado em: 2026-02-26
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.published_prompts (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id    UUID        NOT NULL REFERENCES public.prompts_vault(id) ON DELETE CASCADE,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE  public.published_prompts             IS 'Registro de prompts publicados no site a partir do vault.';
COMMENT ON COLUMN public.published_prompts.prompt_id   IS 'Referência ao prompt no vault.';
COMMENT ON COLUMN public.published_prompts.published_at IS 'Data/hora em que o prompt foi publicado no site.';

-- Índice para acelerar a busca de prompts não publicados
CREATE INDEX IF NOT EXISTS idx_published_prompts_prompt_id
    ON public.published_prompts(prompt_id);

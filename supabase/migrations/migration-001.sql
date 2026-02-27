-- =============================================================================
-- Migration: 001_create_prompts_vault.sql
-- Descrição: Criação da tabela principal para armazenamento dos prompts.
-- Objetivo: Evitar duplicidade via original_id e permitir busca por tags.
-- Criado em: 2026-02-23
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.prompts_vault (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    original_id TEXT        UNIQUE NOT NULL,   -- ID único extraído da URL original
    title       TEXT        NOT NULL,           -- Título do prompt
    full_prompt TEXT        NOT NULL,           -- Conteúdo completo do prompt
    image_url   TEXT,                           -- URL da imagem de capa/preview
    author_name TEXT,                           -- Nome do autor do prompt
    tags        TEXT[],                         -- Lista de tags para categorização e busca
    source_url  TEXT,                           -- URL original de onde o prompt foi capturado
    model_name  TEXT        DEFAULT NULL,       -- Modelo normalizado (ex: ChatGPT, Midjourney, DALL-E, Stable Diffusion, NanoBanana/Gemini)
    captured_at TIMESTAMPTZ DEFAULT NOW()       -- Data/hora da captura
);

COMMENT ON TABLE  public.prompts_vault             IS 'Base de dados central da biblioteca de prompts curados.';
COMMENT ON COLUMN public.prompts_vault.original_id IS 'ID único extraído da URL do site de origem.';
COMMENT ON COLUMN public.prompts_vault.model_name  IS 'Nome normalizado do modelo de IA (ChatGPT, Midjourney, DALL-E, Stable Diffusion, NanoBanana/Gemini).';

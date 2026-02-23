-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Descrição: Criação da tabela principal para armazenamento dos prompts.
-- Objetivo: Evitar duplicidade via original_id e permitir busca por tags.
-- Criado em: 2026-02-23
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.prompts_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_id TEXT UNIQUE NOT NULL,           -- ID único extraído da URL original
    title TEXT NOT NULL,                         -- Título do prompt
    full_prompt TEXT NOT NULL,                   -- Conteúdo completo do prompt
    image_url TEXT,                              -- URL da imagem de capa/preview
    author_name TEXT,                            -- Nome do autor do prompt
    tags TEXT[],                                 -- Lista de tags para categorização e busca
    source_url TEXT,                             -- URL original de onde o prompt foi capturado
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Data/hora da captura
);

COMMENT ON TABLE public.prompts_vault IS 'Base de dados central da biblioteca de prompts clonada.';

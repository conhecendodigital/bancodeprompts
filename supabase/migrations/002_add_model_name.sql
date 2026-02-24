-- Migration: 002_add_model_name.sql
-- Descrição: Adiciona coluna model_name para armazenar qual IA/modelo o prompt utiliza
-- Data: 2026-02-24

ALTER TABLE prompts_vault
ADD COLUMN IF NOT EXISTS model_name TEXT DEFAULT NULL;

COMMENT ON COLUMN prompts_vault.model_name IS 'Nome do modelo/ferramenta de IA utilizada para gerar a imagem (ex: Midjourney, DALL-E, Stable Diffusion)';

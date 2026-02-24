CREATE TABLE automation_config (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insere o estado inicial
INSERT INTO automation_config (key, value) VALUES 
('banana_prompts_state', '{
  "last_page": 1,
  "novos_hoje": 0,
  "last_run_date": null
}'::jsonb);
# 🍌 Banana Prompt Vault

Biblioteca centralizada de prompts curados, com versionamento SQL, automações n8n e interface web.

## Estrutura do Projeto

```
bancodeprompts/
├── supabase/migrations/   # Migrations SQL versionadas (00X_nome.sql)
├── automations/n8n/       # Workflows n8n exportados em JSON
├── web/                   # Aplicação front-end
├── docs/                  # Documentação do projeto
├── .gitignore
└── README.md
```

## Padrões

- **SQL**: Toda alteração de schema vai em `supabase/migrations/` no formato `00X_nome_descritivo.sql`, sempre com comentários explicativos.
- **Código**: Nomes de colunas e variáveis devem ser semânticos e autoexplicativos.
- **Documentação**: Código limpo e documentado é prioridade.

## Como Começar

1. Clone o repositório:
   ```bash
   git clone https://github.com/conhecendodigital/bancodeprompts.git
   ```
2. Execute a migration inicial no seu Supabase Dashboard ou via CLI.

## Licença

Projeto privado — © Conhecendo Digital.

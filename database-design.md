# 🧩 Database Design

## 1. users
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador do usuário |
| nome | text | Nome completo |
| email | text (unique) | E-mail do usuário |
| senha_hash | text | Senha (hash Supabase Auth) |
| role | enum | 'admin', 'gestor', 'inspetor' |
| plano | text | 'iniciante', 'profissional', 'enterprise' |
| equipe_id | uuid (FK) | Referência para a equipe (nullable) |
| cliente_id | uuid (FK) | Referência ao cliente SaaS (nullable) |
| created_at | timestamp | Data de cadastro |

⚠️ Os administradores do SaaS terão role = 'admin' e cliente_id = null.

## 2. clientes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador da conta do cliente |
| nome_empresa | text | Nome da empresa |
| plano_ativo | text | Plano atual |
| stripe_customer | text | ID de cliente no Stripe |
| created_at | timestamp | Data de ativação da conta |

## 3. equipes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador da equipe |
| nome | text | Nome da equipe |
| cliente_id | uuid (FK) | Cliente ao qual pertence |
| created_at | timestamp | Data de criação |

## 4. projetos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador do projeto |
| nome | text | Nome do projeto |
| cliente_id | uuid (FK) | Cliente proprietário |
| equipe_id | uuid (FK) | Equipe responsável |
| created_by | uuid (FK) | Usuário que criou |
| created_at | timestamp | Data de criação |

## 5. inspeções
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | ID da inspeção |
| projeto_id | uuid (FK) | Projeto a que pertence |
| inspetor_id | uuid (FK) | Usuário inspetor responsável |
| data_inicio | timestamp | Início da inspeção |
| data_fim | timestamp | Fim da inspeção |
| status | text | 'em_andamento', 'finalizada' |

## 6. testes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador do teste |
| nome | text | Nome do teste (ex: Continuidade) |
| descricao | text | Descrição orientativa |
| template_id | uuid (FK) | Se vier de template |

## 7. inspeção_testes
Relação entre inspeção e testes utilizados (ordem, status, resultado).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | |
| inspeção_id | uuid (FK) | |
| teste_id | uuid (FK) | |
| ordem | int | Ordem no drag-and-drop |
| resultado | text | Texto simples |
| concluido | boolean | Se foi finalizado |

## 8. observações
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | |
| inspeção_id | uuid (FK) | |
| autor_id | uuid (FK) | Usuário que registrou |
| tipo | enum | 'texto', 'imagem', 'voz' |
| conteudo_texto | text | Texto da observação |
| arquivo_url | text | URL de imagem/áudio (se aplicável) |
| criado_em | timestamp | Data/hora |

## 9. templates
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | ID do template |
| nome | text | Nome (ex: Template de Cabine Elétrica) |
| cliente_id | uuid (FK) | Dono do template (ou null para padrão) |
| criado_por | uuid (FK) | Usuário gestor |

## 10. comandos_voz
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | |
| usuario_id | uuid (FK) | Quem emitiu o comando |
| inspeção_id | uuid (FK) | Inspeção associada |
| texto_original | text | Texto transcrito do áudio |
| ação_inferida | jsonb | Ação interpretada pelo GPT (MCP format) |
| sucesso | boolean | Se foi possível executar a ação |
| erro_mensagem | text | Se falhou, descrição do erro |
| criado_em | timestamp | Data/hora do comando |

## Relacionamentos

- users.id → inspeções.inspetor_id
- users.id → observações.autor_id
- users.id → comandos_voz.usuario_id
- clientes.id → equipes.cliente_id
- equipes.id → users.equipe_id
- projetos.cliente_id → clientes.id
- inspeções.projeto_id → projetos.id
- inspeção_testes.inspeção_id → inspeções.id
- inspeção_testes.teste_id → testes.id
- templates.cliente_id → clientes.id (nullable)
- comandos_voz.ação_inferida → interpretado via API GPT

## Notas de Segurança

### 🔒 Supabase RLS (Row-Level Security)

Cada tabela usa policies baseadas em função (role):

- **inspetor**: só acessa inspeções que participou
- **gestor**: acessa projetos e usuários da equipe
- **admin**: acesso irrestrito

Tabelas sensíveis (observações, comandos_voz) só acessíveis por envolvidos

RLS em templates: públicos (cliente_id = null) e privados (scoped)

Auditing nos comandos de voz (logs, sucesso/falha)

### 🔐 Armazenamento Seguro

- Supabase Storage configurado por diretório por cliente
- Imagens e áudios com ACLs (bucket por cliente)
- Gatilhos para deletar mídia ao deletar inspeção

### 📊 Logs e Traços

- comandos_voz fornece histórico completo para depuração
- Adição futura de tabela logs_eventos para rastrear uso por role/operação
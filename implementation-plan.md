# Backend Implementation Plan – MVP Phase 1

## SECTION 1: Initial Setup

- [x] Supabase inicializado com tabelas seguras
- [x] Integração com Stripe (planos Iniciante, Profissional, Empresarial)
- [x] Configurações de ambientes sensíveis: GPT_API_KEY, WHISPER_API_KEY, STRIPE_SECRET_KEY

## SECTION 2: Database Schema Setup

- users (roles: admin, gestor, inspetor)
- teams
- clients
- projects
- inspections
- inspection_tests
- inspection_observations
- templates
- voice_logs (comando, transcript, ação, resultado)

## SECTION 3: Authentication and Access Control

- Supabase Auth
- Row-level security com policies por role:
  - Inspetor: somente dados próprios
  - Gestor: dados da equipe
  - Admin: acesso total
- Limites por plano (storage, relatórios, áreas)

## SECTION 4: Funcionalidades Must Have

- POST /api/login
- POST /api/projects
- POST /api/inspections
- PATCH /api/inspections/:id/tests
- POST /api/observations (texto, imagem, voz)
- POST /api/reports/generate
- POST /api/voice/transcribe (Whisper)
- POST /api/voice/interpret (GPT → JSON/MCP)
- POST /api/voice/execute (executar ação e logar)

## SECTION 5: Integrações e Lógica de Negócio

- Whisper API para transcrição
- GPT para interpretação de comandos (MCP JSON)
- Stripe para monetização
- Supabase Storage para mídias
- Rate-limiting por plano no uso de IA

## SECTION 6: Feature Gating and Access Logic

- Iniciante:
  - 2 áreas técnicas, 5GB, sem assistente virtual
- Profissional:
  - 50GB, assistente virtual liberado, templates personalizados
- Empresarial:
  - Armazenamento ilimitado, SSO, white-label, prioridade de IA
- Comando por voz bloqueado no plano Iniciante

## SECTION 7: Final QA and Validation

- Testes de roles e permissões
- Validação de transcrição e execução de voz
- Backup das principais tabelas
- Logs auditáveis de todas ações de IA

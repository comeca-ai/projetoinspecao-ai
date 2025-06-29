# 🧱 Implementation Plan – Backend (MVP Phase 1, com Assistente Virtual)

## SECTION 1: Initial Setup

### ☐ Configuração Supabase + Edge Functions
- [ ] Setup do projeto Supabase
- [ ] Configuração das Edge Functions
- [ ] Ambiente com vars seguras: GPT_API_KEY, WHISPER_API_KEY
- [ ] Setup Stripe para planos

## SECTION 2: Database Schema Setup

### ☐ Tabelas principais:
- [ ] `users` - Gerenciamento de usuários
- [ ] `clients` - Clientes dos usuários
- [ ] `projects` - Projetos por cliente
- [ ] `inspections` - Inspeções por projeto
- [ ] `inspection_tests` - Testes dentro das inspeções
- [ ] `inspection_observations` - Observações (texto, imagem, voz)
- [ ] `voice_commands` - Log de comandos processados pelo assistente

## SECTION 3: Authentication and Access Control

### ☐ Sistema de autenticação:
- [ ] Supabase Auth configurado
- [ ] Policies de row-level access implementadas
- [ ] ACLs por plano: limite de áreas, storage, relatórios

## SECTION 4: Funcionalidades Must Have

### ☐ APIs de CRUD básico:
- [ ] `POST /api/clients` – Criar cliente
- [ ] `POST /api/projects` – Criar projeto
- [ ] `POST /api/inspections` – Criar inspeção
- [ ] `PATCH /api/inspections/{id}` – Atualizar inspeção
- [ ] `POST /api/inspections/{id}/tests` – Adicionar testes
- [ ] `POST /api/observations` – Salvar observações (texto, imagem, voz)
- [ ] `POST /api/reports/generate` – Gerar relatório

### ☐ APIs do assistente virtual:
- [ ] `POST /api/voice/transcribe` – Envia áudio → Whisper
- [ ] `POST /api/voice/interpret` – Transcript → GPT → Retorna MCP
- [ ] `POST /api/voice/execute` – Executa comando (logs e retorno da ação)

## SECTION 5: Integrações e Lógica de Negócio

### ☐ Integrações externas:
- [ ] Whisper (áudio → texto)
- [ ] OpenAI GPT (texto → MCP JSON)
- [ ] Stripe (upgrade de plano)
- [ ] Supabase Storage (imagens, áudios)

## SECTION 6: Feature Gating and Access Logic

### ☐ Lógica de planos:
- [ ] **Iniciante**: 2 áreas técnicas, 5GB, templates padrão
- [ ] **Profissional**: todas áreas, 50GB, dashboard, templates personalizados
- [ ] Comandos por voz desativados no plano Iniciante

## SECTION 7: Final QA and Validation

### ☐ Testes e validação:
- [ ] Testes end-to-end (incluindo voz)
- [ ] Logs de comandos assistente exportáveis
- [ ] Backup das tabelas críticas
- [ ] Healthcheck da integração GPT ativo

---

## Notas Técnicas de Implementação

### Pipeline do Assistente Virtual
1. **Captura de áudio** → Frontend
2. **Transcrição** → Whisper API via Edge Function
3. **Interpretação** → GPT API para gerar comandos MCP
4. **Execução** → Backend processa e executa ações
5. **Feedback** → Retorno visual para o usuário

### Arquitetura de Segurança
- Todas as APIs protegidas por autenticação Supabase
- Tokens de IA gerenciados exclusivamente no backend
- Logs de comandos de voz para auditoria e melhoria
- Políticas RLS para isolamento de dados por usuário

### Performance Targets
- **Transcrição**: < 2s para áudios de até 30s
- **Interpretação**: < 1s para comandos simples
- **Execução**: < 1s para ações básicas
- **Total**: < 4s para ciclo completo

### Critérios de Aceitação
Todos os itens desta implementação devem estar ✅ **COMPLETOS** e testados antes da integração com o frontend e lançamento do MVP.
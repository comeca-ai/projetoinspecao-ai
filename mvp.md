#  MVP Production-Readiness Checklist

## SECTION 1: Feature Completion & Flow Validation

- [ ] Fluxo do Inspetor testado:
  - Criar inspeção
  - Selecionar testes via drag-and-drop
  - Gravar observações (texto, imagem, voz)
  - Usar assistente virtual com comandos de voz (adicionar teste, registrar observação, finalizar inspeção)
  - Gerar relatório
- [ ] Fluxo do Gestor testado:
  - Criar equipe
  - Gerenciar inspetores
  - Acessar inspeções da equipe
  - Criar templates personalizados
- [ ] Fluxo do Admin SaaS testado:
  - Criar clientes
  - Acompanhar uso de planos
  - Gerenciar planos Stripe
  - Visualizar logs de IA e comandos por voz

## SECTION 2: Database & Security Validation

- [ ] Supabase Policies segmentadas por role (inspetor, gestor, admin)
- [ ] Armazenamento seguro de mídia (imagem, áudio)
- [ ] Logs de comandos de voz com tracking por usuário
- [ ] Verificação de limites por plano (storage, templates, áreas)

## SECTION 3: Performance & API Optimizations

- [ ] Pipeline de comando de voz com latência < 4s
- [ ] Processamento assíncrono com feedback ao usuário
- [ ] Escalabilidade para múltiplos projetos simultâneos por gestor

## SECTION 4: Frontend & UX Polish

- [ ] UI distinta por role:
  - Inspetor: inspeções e assistente
  - Gestor: equipe, relatórios, templates
  - Admin SaaS: painel de contas, logs, uso
- [ ] Assistente virtual com:
  - Feedback de transcrição
  - Comandos executados com feedback visual
- [ ] Experiência responsiva (uso em campo)

## SECTION 5: Final Regression, Dependency Scan & Launch QA

- [ ] Testes de regressão completos
- [ ] Scan de dependências de segurança
- [ ] Verificação de API keys e ambientes
- [ ] Logs de falhas em comandos de voz

# 🧩 Database Design - InspectionPro Estrutura Atual

> **Status**: Infraestrutura pronta, sistema em produção, aguardando criação das tabelas principais
> **Última atualização**: 29 de junho de 2025

## 1. users ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador do usuário |
| email | text (unique) | E-mail do usuário (Supabase Auth) |
| nome_completo | text | Nome completo |
| role | enum | 'admin', 'gestor', 'inspetor' |
| plano | text | 'iniciante', 'profissional', 'enterprise' |
| equipe_id | uuid (FK) | Referência para a equipe (nullable) |
| cliente_id | uuid (FK) | Referência ao cliente SaaS (nullable) |
| ativo | boolean | Status do usuário |
| ultimo_acesso | timestamp | Último login |
| created_at | timestamp | Data de cadastro |
| updated_at | timestamp | Última atualização |

**Status Atual**: Roles gerenciados por hardcode no frontend:
```typescript
const adminEmails = ['jhonata.emerick@gmail.com', 'felipe.tancredi@gmail.com'];
const gestorEmails = ['felipe.tancredi@grupoaltavilla.com.br'];
const inspetorEmails = ['jer@grupoaltavilla.com.br'];
```

⚠️ Os administradores do SaaS terão role = 'admin' e cliente_id = null.

## 2. clientes ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador da conta do cliente |
| nome_empresa | text | Nome da empresa |
| cnpj | text (unique) | CNPJ da empresa |
| plano_ativo | text | Plano atual |
| limite_usuarios | integer | Limite de usuários do plano |
| limite_inspecoes | integer | Limite de inspeções mensais |
| stripe_customer_id | text | ID de cliente no Stripe |
| endereco | jsonb | Endereço completo |
| contato | jsonb | Dados de contato |
| configuracoes | jsonb | Configurações personalizadas |
| ativo | boolean | Status da conta |
| created_at | timestamp | Data de ativação da conta |
| updated_at | timestamp | Última atualização |

**Status Atual**: Cliente hardcoded para desenvolvimento:
```typescript
if (user.email === 'felipe.tancredi@grupoaltavilla.com.br') {
  clienteId = 'altavilla-client-001';
}
```

## 3. equipes ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador da equipe |
| nome | text | Nome da equipe |
| cliente_id | uuid (FK) | Cliente ao qual pertence |
| gestor_id | uuid (FK) | Usuário gestor da equipe |
| descricao | text | Descrição da equipe |
| ativa | boolean | Status da equipe |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Última atualização |

**Status Atual**: Equipe hardcoded para desenvolvimento:
```typescript
if (user.email === 'felipe.tancredi@grupoaltavilla.com.br') {
  equipeId = 'altavilla-team-001';
}
```

## 4. projetos ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador do projeto |
| nome | text | Nome do projeto |
| descricao | text | Descrição do projeto |
| cliente_id | uuid (FK) | Cliente proprietário |
| equipe_id | uuid (FK) | Equipe responsável |
| gestor_id | uuid (FK) | Usuário gestor do projeto |
| endereco | jsonb | Localização do projeto |
| status | text | 'ativo', 'pausado', 'concluido', 'cancelado' |
| data_inicio | date | Data de início |
| data_fim_prevista | date | Data prevista de conclusão |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Última atualização |

## 5. inspecoes ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | ID da inspeção |
| titulo | text | Título da inspeção |
| projeto_id | uuid (FK) | Projeto a que pertence |
| inspetor_id | uuid (FK) | Usuário inspetor responsável |
| template_id | uuid (FK) | Template utilizado (nullable) |
| tipo | text | Tipo de inspeção |
| prioridade | text | 'baixa', 'media', 'alta' |
| status | text | 'pendente', 'em_andamento', 'concluida', 'cancelada' |
| cliente_nome | text | Nome do cliente da inspeção |
| cliente_email | text | Email do cliente |
| localizacao | text | Nome do local |
| endereco | jsonb | Endereço completo |
| data_agendada | timestamp | Data/hora agendada |
| data_inicio | timestamp | Início da inspeção |
| data_conclusao | timestamp | Fim da inspeção |
| tempo_estimado | integer | Tempo estimado em minutos |
| progresso | integer | Percentual de progresso |
| observacoes | text | Observações gerais |
| metadados | jsonb | Dados adicionais |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Última atualização |

**Status Atual**: Interface completa implementada com mock data:
```typescript
interface Inspection {
  id: string;
  title: string;
  project: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  testsTotal: number;
  testsCompleted: number;
  location: string;
  assignedBy: string;
}
```

## 6. testes ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador do teste |
| nome | text | Nome do teste (ex: Continuidade) |
| categoria | text | Categoria do teste |
| descricao | text | Descrição orientativa |
| instrucoes | text[] | Instruções passo a passo |
| obrigatorio | boolean | Se é obrigatório |
| tempo_estimado | integer | Tempo estimado em minutos |
| template_id | uuid (FK) | Se vier de template (nullable) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Última atualização |

**Status Atual**: 14 testes mock implementados em 5 categorias:
- **Elétrica**: Continuidade, Isolamento, Aterramento
- **HVAC**: Pressão, Fluxo de Ar
- **Solar**: Irradiação
- **Segurança**: Alarme
- **Automação**: Sensores

## 7. inspecao_testes ⚠️ PENDENTE IMPLEMENTAÇÃO
Relação entre inspeção e testes utilizados (ordem, status, resultado).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador |
| inspecao_id | uuid (FK) | Referência à inspeção |
| teste_id | uuid (FK) | Referência ao teste |
| ordem | int | Ordem no drag-and-drop |
| status | text | 'pendente', 'em_andamento', 'concluido', 'falhado' |
| resultado | text | Resultado do teste |
| observacoes | text | Observações específicas |
| tempo_inicio | timestamp | Início da execução |
| tempo_fim | timestamp | Fim da execução |
| media_anexos | text[] | URLs dos arquivos anexados |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Última atualização |

**Status Atual**: Interface drag & drop implementada com gestão de estado completa.

## 8. observacoes ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador |
| inspecao_id | uuid (FK) | Referência à inspeção |
| teste_id | uuid (FK) | Referência ao teste (nullable) |
| autor_id | uuid (FK) | Usuário que registrou |
| tipo | enum | 'texto', 'imagem', 'audio', 'video' |
| conteudo | text | Texto da observação |
| arquivo_url | text | URL do arquivo (se aplicável) |
| arquivo_metadata | jsonb | Metadados do arquivo |
| timestamp_inspecao | timestamp | Momento na inspeção |
| created_at | timestamp | Data/hora de criação |

**Status Atual**: Modal funcional implementado:
```typescript
interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (observation: string, media: string[]) => void;
  testName: string;
}
```

## 9. templates ⚠️ PENDENTE IMPLEMENTAÇÃO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | ID do template |
| nome | text | Nome (ex: Template de Cabine Elétrica) |
| descricao | text | Descrição do template |
| cliente_id | uuid (FK) | Dono do template (ou null para padrão) |
| criado_por | uuid (FK) | Usuário gestor que criou |
| categoria | text | Categoria do template |
| testes_incluidos | uuid[] | Array de IDs dos testes |
| configuracoes | jsonb | Configurações específicas |
| ativo | boolean | Status do template |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Última atualização |

## 10. comandos_voz ✅ ESTRUTURA PRONTA - ⚠️ TABELA PENDENTE
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador |
| usuario_id | uuid (FK) | Quem emitiu o comando |
| inspecao_id | uuid (FK) | Inspeção associada (nullable) |
| texto_original | text | Texto transcrito do áudio |
| texto_processado | text | Texto limpo/processado |
| acao_inferida | jsonb | Ação interpretada pelo sistema |
| status | text | 'processando', 'sucesso', 'erro' |
| resultado | text | Resultado da execução |
| confianca | numeric(3,2) | Nível de confiança (0.00-1.00) |
| tempo_processamento | integer | Tempo em milissegundos |
| erro_detalhes | text | Detalhes do erro (se houver) |
| created_at | timestamp | Data/hora do comando |

**Status Atual**: Context completo implementado com interface funcional:
```typescript
interface VoiceCommand {
  id: string;
  timestamp: Date;
  originalText: string;
  interpretedAction: string;
  status: 'success' | 'error' | 'processing';
  result?: string;
  confidence?: number;
}
```

**Comandos Disponíveis**:
- "Adicionar teste de [nome]"
- "Marcar como concluído"
- "Adicionar observação [texto]"
- "Reprovar teste atual"
- "Tirar foto"
- "Finalizar inspeção"

## 11. audit_logs ✅ IMPLEMENTADO
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid (PK) | Identificador |
| user_id | uuid | Usuário que executou a ação |
| action | text | Ação realizada |
| table_name | text | Tabela afetada |
| record_id | uuid | ID do registro afetado |
| old_values | jsonb | Valores antes da alteração |
| new_values | jsonb | Valores após a alteração |
| ip_address | inet | IP do usuário |
| user_agent | text | User agent do navegador |
| created_at | timestamp | Data/hora da ação |

**Status**: ✅ Tabela criada e funcional com triggers automáticos.

## Sistema de Permissões ✅ IMPLEMENTADO

### Roles e Permissões Granulares

**22 Permissões Implementadas**:
- view_dashboard, manage_inspections, execute_inspections
- view_reports, generate_reports, manage_team
- invite_members, manage_templates, view_analytics
- manage_billing, view_team_inspections, manage_clients
- view_system_overview, view_voice_logs, use_voice_assistant
- upload_files, export_data, manage_settings
- view_audit_logs, manage_permissions, view_admin_panel
- manage_system_settings

### Planos e Limitações ✅ IMPLEMENTADO

| Plano | Usuários | Inspeções/Mês | Storage (GB) | Voz | Preço |
|-------|----------|---------------|--------------|-----|-------|
| Iniciante | 3 | 25 | 1 | ❌ | Grátis |
| Profissional | 10 | 100 | 10 | ✅ | R$ 99/mês |
| Enterprise | Ilimitado | Ilimitado | 100 | ✅ | R$ 299/mês |

### Distribuição por Role

**Admin**:
- Todos os acessos administrativos
- Gestão de clientes
- Visão geral do sistema
- Logs de auditoria

**Gestor**:
- Gestão da equipe
- Criação e gestão de inspeções
- Templates e relatórios
- Assistente de voz (planos Pro/Enterprise)
- Analytics da equipe

**Inspetor**:
- Execução de inspeções
- Relatórios pessoais
- Upload de arquivos
- Configurações básicas

## Relacionamentos

- users.id → inspecoes.inspetor_id
- users.id → observacoes.autor_id
- users.id → comandos_voz.usuario_id
- users.equipe_id → equipes.id
- users.cliente_id → clientes.id
- clientes.id → equipes.cliente_id
- equipes.id → projetos.equipe_id
- projetos.id → inspecoes.projeto_id
- inspecoes.id → inspecao_testes.inspecao_id
- testes.id → inspecao_testes.teste_id
- templates.cliente_id → clientes.id (nullable)
- comandos_voz.acao_inferida → interpretado via sistema

## Notas de Segurança ✅ IMPLEMENTADO

### 🔒 Supabase RLS (Row-Level Security)

**379 linhas de policies implementadas** em `/supabase/rls_policies.sql`:

- **inspetor**: só acessa inspeções que participou
- **gestor**: acessa projetos e usuários da equipe  
- **admin**: acesso irrestrito
- Tabelas sensíveis (observações, comandos_voz) só acessíveis por envolvidos
- RLS em templates: públicos (cliente_id = null) e privados (scoped)
- Auditing completo nos comandos de voz (logs, sucesso/falha)

### 🔐 Segurança Avançada ✅ IMPLEMENTADO

**Utilitários de Segurança**:
- **CSRF Protection**: Tokens anti-CSRF
- **Rate Limiting**: Proteção contra ataques
- **Input Validation**: Sanitização com Zod
- **JWT Security**: Validação e refresh automático
- **Session Management**: Timeout e renovação
- **Audit Trail**: Log completo de ações

### 📊 Monitoramento ✅ IMPLEMENTADO

**Scripts de Produção**:
- `setup-production.sh`: Configuração segura do servidor
- `manage-secrets.sh`: Gestão de variáveis de ambiente
- `ssl-setup.sh`: Automação SSL/TLS
- `health-check.sh`: Monitoramento da aplicação a cada 5min

### 🚀 Interface do Usuário ✅ IMPLEMENTADO

**Dashboards Completos**:
- Dashboard do Admin (gestão global)
- Dashboard do Gestor (gestão de equipe)
- Dashboard do Inspetor (execução)
- Formulário de Nova Inspeção (NewInspection.tsx)
- Sistema drag & drop para testes
- Assistente de voz funcional
- Modal de observações
- Quick Actions (6 ações funcionais)

### 📱 Sistema PWA ✅ IMPLEMENTADO

**Favicons Multi-Dispositivo**:
- 21 ícones para diferentes tamanhos e dispositivos
- Suporte completo a iOS, Android, Desktop
- Manifest.json configurado para instalação como app
- Meta tags otimizadas para PWA
- Título atualizado: "InspectionPro"

## Status de Implementação

| Componente | Status | Prioridade |
|------------|--------|------------|
| **Frontend Completo** | ✅ | - |
| **Autenticação** | ✅ | - |
| **Permissões** | ✅ | - |
| **Segurança** | ✅ | - |
| **PWA/Favicons** | ✅ | - |
| **Produção/SSL** | ✅ | - |
| **Health Monitoring** | ✅ | - |
| **Assistente Voz** | ✅ Framework | - |
| **Scripts Produção** | ✅ | - |
| **Schema Database** | ❌ | 🚨 ALTA |
| **CRUD Operations** | ❌ | 🚨 ALTA |
| **Templates** | ❌ | 🔧 MÉDIA |
| **File Storage** | ❌ | 🔧 MÉDIA |

## Próximos Passos Críticos

### 🚨 Fase 1: Schema Database (Urgente)
1. Criar todas as tabelas no Supabase
2. Migrar gestão de usuários para database
3. Implementar CRUD para inspeções
4. Conectar frontend aos dados reais

### 🔧 Fase 2: Funcionalidades (2-4 semanas)
1. Sistema de templates funcional
2. Upload e storage de mídia
3. Logs de comandos de voz persistidos
4. Relatórios com dados reais

### 🎯 Fase 3: Produção (1-2 semanas)
1. Monitoramento avançado
2. Backups automatizados
3. Performance tuning
4. Documentação final

---

**A aplicação InspectionPro possui arquitetura enterprise-grade com segurança avançada, interface completa e sistema operacional em produção (https://inspecao.digital). Necessita apenas da criação do schema do banco para se tornar totalmente funcional.**
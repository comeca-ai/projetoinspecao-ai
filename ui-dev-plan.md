# UI Development Plan

## Telas Necessárias por Tipo de Usuário

🔹 Inspetor

- Dashboard pessoal de inspeções
- Tela de execução de inspeção
- Modal do assistente virtual
- Visualizador de relatório

🔹 Gestor de Equipe

- Painel de equipe
- Gerenciador de templates
- Tela de inspeções da equipe
- Dashboard analítico (por inspetor, por projeto)

🔹 Administrador SaaS

- Painel de contas e planos
- Visão global de uso (storage, IA, usuários ativos)
- Log de comandos de voz e falhas
- Painel de billing (Stripe), gerenciamento de clientes

## Componentes por Tela

🔹 Tela de Execução de Inspeção (Inspetor)

- Lista lateral de testes (drag-and-drop)
- Painel central de testes selecionados
- Área de mídia (imagem, áudio)
- Modal de observação textual
- Botão de ativação do assistente virtual
- Indicador de status ("escutando" / "interpretando")
- Feedback visual das ações do assistente

🔹 Modal Assistente Virtual

- Componente de escuta
- Transcrição em tempo real
- Ação interpretada (ex: “Adicionando teste de isolamento”)
- Histórico dos últimos comandos

🔹 Painel de Equipe (Gestor)

- Lista de inspetores
- Botão: convidar novo membro
- Coluna: inspeções em andamento
- Coluna: relatórios finalizados

🔹 Admin SaaS – Painel Global

- Lista de clientes e plano atual
- Consumo de recursos (storage, API calls)
- Logs de IA e comandos de voz
- Ações de suporte: reset, upgrade, ban

## Fluxo de UI

1. Inspetor acessa o painel → seleciona inspeção → ativa assistente
2. Fala um comando (“adicionar teste”) → transcrição → execução
3. Ao finalizar, gera relatório
4. Gestor acessa o projeto → acompanha status da equipe
5. Admin monitora uso da IA, comandos de voz e comportamento de sistema

# 🎨 UI Development Plan (com Assistente Virtual)

## Telas Necessárias

### ☐ Principais interfaces:
- [ ] Tela de Login
- [ ] Tela de Dashboard
- [ ] Tela de Projeto
- [ ] Tela de Inspeção
- [ ] Tela de Relatório
- [ ] Modal Assistente Virtual

## Componentes por Tela

### 🔹 Tela de Inspeção

#### ☐ Layout principal:
- [ ] Lista lateral de testes disponíveis (drag-and-drop)
- [ ] Área central com testes em andamento
- [ ] Botão "Gravar Observação"
- [ ] Botão "Ativar Assistente Virtual"

#### ☐ Feedback do assistente:
- [ ] Feedback visual do comando processado
- [ ] Indicador de status ("Escutando…" / "Interpretando…" / "Executado")

### 🔹 Modal Assistente Virtual

#### ☐ Interface de voz:
- [ ] Componente de escuta com botão (pressionar para falar)
- [ ] Campo de transcrição (ao vivo)
- [ ] Feedback textual da IA ("Adicionando teste: Continuidade Elétrica")
- [ ] Lista dos últimos 5 comandos executados

## Fluxo de UI

### ☐ Jornada do usuário:
1. [ ] Usuário entra no dashboard e inicia um projeto
2. [ ] Inicia nova inspeção
3. [ ] Ativa assistente virtual (ícone visível)
4. [ ] Fala: "Adicionar teste de termografia"
5. [ ] Áudio enviado → Whisper → transcript
6. [ ] Backend processa transcript via GPT → retorna comando MCP
7. [ ] Front executa comando (adiciona teste automaticamente)
8. [ ] Usuário confirma ou ajusta via UI
9. [ ] Gera relatório e salva inspeção

---

## Especificações Técnicas

### Estados do Assistente Virtual
- **Inativo**: Botão disponível para ativação
- **Escutando**: Indicador visual ativo, capturando áudio
- **Processando**: Spinner/loading durante transcrição e interpretação
- **Executando**: Feedback visual da ação sendo realizada
- **Concluído**: Confirmação da ação executada
- **Erro**: Mensagem de erro com opção de tentar novamente

### Componentes Reutilizáveis
- **VoiceButton**: Botão de ativação do assistente
- **TranscriptionDisplay**: Exibição da transcrição em tempo real
- **CommandFeedback**: Feedback visual das ações do assistente
- **CommandHistory**: Histórico dos últimos comandos
- **StatusIndicator**: Indicadores de status do sistema

### Responsividade
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Interface adaptada mantendo funcionalidades principais
- **Mobile**: Versão simplificada com foco na usabilidade

### Acessibilidade
- **Keyboard Navigation**: Navegação completa por teclado
- **Screen Readers**: Suporte para leitores de tela
- **Voice Feedback**: Confirmações audíveis das ações
- **High Contrast**: Modo de alto contraste disponível

## Critérios de Aceitação

### ☐ Funcionalidade:
- [ ] Todos os fluxos principais funcionando
- [ ] Assistente virtual integrado e responsivo
- [ ] Fallback manual sempre disponível
- [ ] Performance adequada em dispositivos móveis

### ☐ UX/UI:
- [ ] Interface intuitiva e acessível
- [ ] Feedback visual claro para todas as ações
- [ ] Estados de loading e erro bem definidos
- [ ] Design consistente com o sistema

### ☐ Integração:
- [ ] Comunicação efetiva com backend
- [ ] Tratamento de erros robusto
- [ ] Logs de interação para análise
- [ ] Compatibilidade cross-browser
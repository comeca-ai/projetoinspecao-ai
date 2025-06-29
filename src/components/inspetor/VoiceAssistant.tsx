import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';

interface VoiceCommand {
  id: string;
  timestamp: Date;
  originalText: string;
  interpretedAction: string;
  status: 'success' | 'error' | 'processing';
  result?: string;
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose, onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  // Mock voice commands for demonstration
  const mockCommands: VoiceCommand[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      originalText: 'adicionar teste de continuidade',
      interpretedAction: 'Adicionar teste: Teste de Continuidade',
      status: 'success',
      result: 'Teste adicionado com sucesso'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 180000),
      originalText: 'marcar como concluído',
      interpretedAction: 'Marcar teste atual como concluído',
      status: 'success',
      result: 'Status atualizado'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 60000),
      originalText: 'adicionar observação problema na fiação',
      interpretedAction: 'Adicionar observação: "problema na fiação"',
      status: 'error',
      result: 'Erro: Nenhum teste selecionado'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCommandHistory(mockCommands);
    }
  }, [isOpen]);

  // Simulate audio level for visual feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setCurrentTranscription('');
    
    // Simulate voice recognition
    setTimeout(() => {
      setCurrentTranscription('Ouvindo...');
    }, 500);
    
    setTimeout(() => {
      setCurrentTranscription('adicionar teste de isolamento');
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const newCommand: VoiceCommand = {
        id: Date.now().toString(),
        timestamp: new Date(),
        originalText: currentTranscription,
        interpretedAction: 'Adicionar teste: Medição de Isolamento',
        status: 'processing'
      };
      
      setCommandHistory(prev => [newCommand, ...prev]);
      setIsProcessing(false);
      setCurrentTranscription('');
      
      // Simulate command execution
      setTimeout(() => {
        setCommandHistory(prev => prev.map(cmd => 
          cmd.id === newCommand.id 
            ? { ...cmd, status: 'success' as const, result: 'Teste adicionado com sucesso' }
            : cmd
        ));
        onCommand(currentTranscription);
      }, 1000);
    }, 2000);
  };

  const getStatusIcon = (status: VoiceCommand['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: VoiceCommand['status']) => {
    const config = {
      success: { label: 'Sucesso', className: 'bg-green-100 text-green-800' },
      error: { label: 'Erro', className: 'bg-red-100 text-red-800' },
      processing: { label: 'Processando', className: 'bg-blue-100 text-blue-800' }
    };
    
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Assistente Virtual por Voz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Voice Input Section */}
          <div className="text-center space-y-4">
            <div className="relative">
              <Button
                size="lg"
                className={`w-24 h-24 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              
              {/* Audio Level Indicator */}
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" 
                     style={{ opacity: audioLevel / 200 }} />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {isListening ? 'Escutando... Clique para parar' : 
                 isProcessing ? 'Processando comando...' : 
                 'Clique para começar a falar'}
              </p>
              
              {currentTranscription && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Transcrição:</span>
                  </div>
                  <p className="text-gray-800">{currentTranscription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Command Examples */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Comandos Disponíveis:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
              <div>• "Adicionar teste de [nome]"</div>
              <div>• "Marcar como concluído"</div>
              <div>• "Adicionar observação [texto]"</div>
              <div>• "Reprovar teste atual"</div>
              <div>• "Tirar foto"</div>
              <div>• "Finalizar inspeção"</div>
            </div>
          </div>

          {/* Command History */}
          <div className="space-y-3">
            <h4 className="font-medium">Histórico de Comandos</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {commandHistory.map((command) => (
                <div key={command.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(command.status)}
                      <span className="text-xs text-gray-500">
                        {command.timestamp.toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    {getStatusBadge(command.status)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Comando:</span> "{command.originalText}"
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Ação:</span> {command.interpretedAction}
                    </div>
                    {command.result && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Resultado:</span> {command.result}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {commandHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">Nenhum comando executado ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceAssistant;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import { 
  Plus, 
  FileText, 
  Clock, 
  Mic,
  Camera,
  MapPin
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startListening, isEnabled: voiceEnabled } = useVoiceAssistant();
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);

  // Mock data for last inspection
  const lastInspection = {
    id: '1',
    title: 'Inspeção Elétrica - Painel Principal',
    progress: 65
  };

  const handleNewInspection = () => {
    navigate('/inspections/new');
    toast({
      title: "Nova Inspeção",
      description: "Redirecionando para criação de inspeção",
    });
  };

  const handleContinueLast = () => {
    if (lastInspection) {
      navigate(`/inspections/${lastInspection.id}/execute`);
      toast({
        title: "Continuando Inspeção",
        description: `Retomando: ${lastInspection.title}`,
      });
    } else {
      toast({
        title: "Nenhuma Inspeção Pendente",
        description: "Não há inspeções em andamento para continuar",
        variant: "destructive"
      });
    }
  };

  const handleVoiceAssistant = () => {
    if (voiceEnabled) {
      startListening();
      toast({
        title: "Assistente de Voz Ativado",
        description: "Escutando comandos...",
      });
    } else {
      toast({
        title: "Assistente de Voz Indisponível",
        description: "Recurso não habilitado para seu perfil",
        variant: "destructive"
      });
    }
  };

  const handleCapturePhoto = async () => {
    setIsCapturingPhoto(true);
    
    try {
      // Simulate camera access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Câmera Ativada",
          description: "Função em desenvolvimento - acesso à câmera detectado",
        });
      } else {
        throw new Error("Camera not available");
      }
    } catch (error) {
      toast({
        title: "Erro na Câmera",
        description: "Não foi possível acessar a câmera do dispositivo",
        variant: "destructive"
      });
    } finally {
      setIsCapturingPhoto(false);
    }
  };

  const handleMyReports = () => {
    navigate('/reports');
    toast({
      title: "Meus Relatórios",
      description: "Navegando para a página de relatórios",
    });
  };

  const handleNearbyInspections = () => {
    toast({
      title: "Inspeções Próximas",
      description: "Função de mapa em desenvolvimento - mostrando inspeções na região atual",
    });
    // Could integrate with Google Maps or similar service
  };

  const actions = [
    {
      title: 'Nova Inspeção',
      description: 'Criar uma nova inspeção',
      icon: Plus,
      color: 'bg-[#f26522] hover:bg-[#e55a1f]',
      action: handleNewInspection
    },
    {
      title: 'Continuar Última',
      description: 'Retomar inspeção em andamento',
      icon: Clock,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: handleContinueLast,
      badge: lastInspection ? `${lastInspection.progress}%` : null
    },
    {
      title: 'Assistente de Voz',
      description: 'Ativar comandos por voz',
      icon: Mic,
      color: `${voiceEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`,
      action: handleVoiceAssistant,
      disabled: !voiceEnabled
    },
    {
      title: 'Capturar Foto',
      description: 'Tirar foto para inspeção',
      icon: Camera,
      color: 'bg-green-600 hover:bg-green-700',
      action: handleCapturePhoto,
      loading: isCapturingPhoto
    },
    {
      title: 'Meus Relatórios',
      description: 'Ver relatórios gerados',
      icon: FileText,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: handleMyReports
    },
    {
      title: 'Inspeções Próximas',
      description: 'Ver localizações no mapa',
      icon: MapPin,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: handleNearbyInspections
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="relative">
                <Button
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform ${action.color} text-white border-0 w-full ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={action.disabled ? undefined : action.action}
                  disabled={action.loading}
                >
                  {action.loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                  <div className="text-center">
                    <div className="font-medium text-xs">{action.title}</div>
                    <div className="text-xs opacity-80 mt-1">{action.description}</div>
                  </div>
                </Button>
                {action.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center">
                    {action.badge}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
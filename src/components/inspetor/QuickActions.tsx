import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Clock, 
  Mic,
  Camera,
  MapPin
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Nova Inspeção',
      description: 'Criar uma nova inspeção',
      icon: Plus,
      color: 'bg-[#f26522] hover:bg-[#e55a1f]',
      action: () => console.log('Nova inspeção')
    },
    {
      title: 'Continuar Última',
      description: 'Retomar inspeção em andamento',
      icon: Clock,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => console.log('Continuar última')
    },
    {
      title: 'Assistente de Voz',
      description: 'Ativar comandos por voz',
      icon: Mic,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => console.log('Assistente de voz')
    },
    {
      title: 'Capturar Foto',
      description: 'Tirar foto para inspeção',
      icon: Camera,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => console.log('Capturar foto')
    },
    {
      title: 'Meus Relatórios',
      description: 'Ver relatórios gerados',
      icon: FileText,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => console.log('Meus relatórios')
    },
    {
      title: 'Inspeções Próximas',
      description: 'Ver localizações no mapa',
      icon: MapPin,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => console.log('Inspeções próximas')
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
              <Button
                key={index}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform ${action.color} text-white border-0`}
                onClick={action.action}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-xs">{action.title}</div>
                  <div className="text-xs opacity-80 mt-1">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
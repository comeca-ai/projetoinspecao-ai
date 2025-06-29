import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  Mic,
  Brain,
  Clock,
  Users
} from 'lucide-react';

const CommandAnalytics: React.FC = () => {
  const commandTypes = [
    { type: 'ADD_TEST', label: 'Adicionar Teste', count: 156, percentage: 35 },
    { type: 'MARK_COMPLETED', label: 'Marcar Concluído', count: 134, percentage: 30 },
    { type: 'ADD_OBSERVATION', label: 'Adicionar Observação', count: 89, percentage: 20 },
    { type: 'CAPTURE_PHOTO', label: 'Tirar Foto', count: 45, percentage: 10 },
    { type: 'OTHER', label: 'Outros', count: 22, percentage: 5 }
  ];

  const hourlyUsage = [
    { hour: '08:00', commands: 45 },
    { hour: '09:00', commands: 78 },
    { hour: '10:00', commands: 123 },
    { hour: '11:00', commands: 89 },
    { hour: '12:00', commands: 34 },
    { hour: '13:00', commands: 56 },
    { hour: '14:00', commands: 98 },
    { hour: '15:00', commands: 112 },
    { hour: '16:00', commands: 87 },
    { hour: '17:00', commands: 65 }
  ];

  const maxCommands = Math.max(...hourlyUsage.map(h => h.commands));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Command Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Tipos de Comandos Mais Usados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {commandTypes.map((command, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{command.label}</span>
                <span className="text-gray-600">{command.count} comandos</span>
              </div>
              <Progress value={command.percentage} className="h-2" />
              <div className="text-xs text-gray-500 text-right">
                {command.percentage}% do total
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hourly Usage Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Padrão de Uso por Hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hourlyUsage.map((hour, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium w-12">{hour.hour}</span>
                <div className="flex-1">
                  <Progress 
                    value={(hour.commands / maxCommands) * 100} 
                    className="h-3" 
                  />
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {hour.commands}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Pico de uso: {maxCommands} comandos às {hourlyUsage.find(h => h.commands === maxCommands)?.hour}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandAnalytics;
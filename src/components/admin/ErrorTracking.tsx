import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  TrendingDown,
  Clock,
  User
} from 'lucide-react';

interface ErrorPattern {
  id: string;
  errorType: string;
  message: string;
  frequency: number;
  lastOccurrence: string;
  affectedUsers: number;
  severity: 'low' | 'medium' | 'high';
}

const mockErrorPatterns: ErrorPattern[] = [
  {
    id: '1',
    errorType: 'NO_ACTIVE_TEST',
    message: 'Nenhum teste ativo selecionado',
    frequency: 23,
    lastOccurrence: '2024-01-15T10:20:00',
    affectedUsers: 8,
    severity: 'medium'
  },
  {
    id: '2',
    errorType: 'AUDIO_QUALITY_LOW',
    message: 'Qualidade de áudio insuficiente para transcrição',
    frequency: 15,
    lastOccurrence: '2024-01-15T09:45:00',
    affectedUsers: 12,
    severity: 'high'
  },
  {
    id: '3',
    errorType: 'COMMAND_NOT_RECOGNIZED',
    message: 'Comando não reconhecido pelo sistema',
    frequency: 34,
    lastOccurrence: '2024-01-15T10:15:00',
    affectedUsers: 15,
    severity: 'low'
  },
  {
    id: '4',
    errorType: 'NETWORK_TIMEOUT',
    message: 'Timeout na conexão com serviço de IA',
    frequency: 7,
    lastOccurrence: '2024-01-15T08:30:00',
    affectedUsers: 4,
    severity: 'high'
  }
];

const ErrorTracking: React.FC = () => {
  const getSeverityBadge = (severity: string) => {
    const config = {
      low: { label: 'Baixa', color: 'bg-green-100 text-green-800' },
      medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'Alta', color: 'bg-red-100 text-red-800' }
    };
    
    const { label, color } = config[severity as keyof typeof config];
    return <Badge className={color}>{label}</Badge>;
  };

  const formatLastOccurrence = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const totalErrors = mockErrorPatterns.reduce((sum, error) => sum + error.frequency, 0);
  const highSeverityErrors = mockErrorPatterns.filter(e => e.severity === 'high').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Rastreamento de Erros
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total de erros hoje: {totalErrors}</span>
          <span>Erros críticos: {highSeverityErrors}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockErrorPatterns.map((error) => (
            <div key={error.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{error.errorType}</span>
                    {getSeverityBadge(error.severity)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{error.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">{error.frequency}</div>
                    <div className="text-gray-500">Ocorrências</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{error.affectedUsers}</div>
                    <div className="text-gray-500">Usuários afetados</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{formatLastOccurrence(error.lastOccurrence)}</div>
                    <div className="text-gray-500">Última ocorrência</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockErrorPatterns.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">Nenhum erro registrado hoje</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorTracking;
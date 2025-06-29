import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive,
  Users,
  Database,
  Mic,
  Image,
  FileText
} from 'lucide-react';

const ResourceMonitoring: React.FC = () => {
  const resources = [
    {
      title: 'Armazenamento Total',
      used: 2.4,
      total: 5.0,
      unit: 'TB',
      icon: HardDrive,
      color: 'text-blue-600',
      details: [
        { label: 'Imagens', value: '1.2TB' },
        { label: 'Áudios', value: '0.8TB' },
        { label: 'Documentos', value: '0.4TB' }
      ]
    },
    {
      title: 'Usuários Ativos',
      used: 1234,
      total: 2000,
      unit: 'usuários',
      icon: Users,
      color: 'text-green-600',
      details: [
        { label: 'Inspetores', value: '856' },
        { label: 'Gestores', value: '234' },
        { label: 'Admins', value: '144' }
      ]
    },
    {
      title: 'Comandos de Voz (Hoje)',
      used: 8456,
      total: 10000,
      unit: 'comandos',
      icon: Mic,
      color: 'text-purple-600',
      details: [
        { label: 'Sucesso', value: '7892' },
        { label: 'Falhas', value: '564' },
        { label: 'Em processamento', value: '0' }
      ]
    },
    {
      title: 'Conexões DB',
      used: 340,
      total: 500,
      unit: 'conexões',
      icon: Database,
      color: 'text-orange-600',
      details: [
        { label: 'Ativas', value: '340' },
        { label: 'Idle', value: '160' },
        { label: 'Disponíveis', value: '160' }
      ]
    }
  ];

  const getPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Monitoramento de Recursos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            const percentage = getPercentage(resource.used, resource.total);
            
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Icon className={`h-5 w-5 ${resource.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-600">
                      {resource.used.toLocaleString()} / {resource.total.toLocaleString()} {resource.unit}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${resource.color}`}>
                    {percentage}%
                  </div>
                </div>
                
                <Progress value={percentage} className="h-2" />
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {resource.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-center">
                      <div className="font-medium text-gray-900">{detail.value}</div>
                      <div className="text-gray-500">{detail.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceMonitoring;
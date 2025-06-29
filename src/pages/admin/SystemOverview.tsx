import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server,
  Database,
  HardDrive,
  Cpu,
  Activity,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import SystemMetrics from '@/components/admin/SystemMetrics';
import ResourceMonitoring from '@/components/admin/ResourceMonitoring';

interface SystemStatus {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
  lastCheck: string;
}

const mockSystemStatus: SystemStatus[] = [
  {
    service: 'API Gateway',
    status: 'healthy',
    uptime: '99.9%',
    responseTime: 45,
    lastCheck: '2024-01-15T10:30:00'
  },
  {
    service: 'Database',
    status: 'healthy',
    uptime: '99.8%',
    responseTime: 12,
    lastCheck: '2024-01-15T10:30:00'
  },
  {
    service: 'File Storage',
    status: 'warning',
    uptime: '99.5%',
    responseTime: 89,
    lastCheck: '2024-01-15T10:29:00'
  },
  {
    service: 'Voice Processing',
    status: 'healthy',
    uptime: '99.7%',
    responseTime: 156,
    lastCheck: '2024-01-15T10:30:00'
  },
  {
    service: 'Email Service',
    status: 'healthy',
    uptime: '99.9%',
    responseTime: 234,
    lastCheck: '2024-01-15T10:30:00'
  }
];

const SystemOverview: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Here you would refresh the system data
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      healthy: { label: 'Saudável', color: 'bg-green-100 text-green-800' },
      warning: { label: 'Atenção', color: 'bg-yellow-100 text-yellow-800' },
      critical: { label: 'Crítico', color: 'bg-red-100 text-red-800' }
    };
    
    const { label, color } = config[status as keyof typeof config];
    return <Badge className={color}>{label}</Badge>;
  };

  const formatLastCheck = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Visão Geral do Sistema
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoramento em tempo real da infraestrutura
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Última atualização: {lastRefresh.toLocaleTimeString('pt-BR')}
            </span>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operacional</div>
              <p className="text-xs text-muted-foreground">Todos os serviços funcionando</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% vs ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests/min</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,456</div>
              <p className="text-xs text-muted-foreground">Pico: 12,890</p>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <SystemMetrics />

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Status dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSystemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-medium">{service.service}</h4>
                      <p className="text-sm text-gray-600">
                        Uptime: {service.uptime} • Resposta: {service.responseTime}ms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {formatLastCheck(service.lastCheck)}
                    </span>
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Monitoring */}
        <ResourceMonitoring />

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Alto uso de armazenamento</p>
                  <p className="text-xs text-gray-600">Storage usage at 85% - consider scaling</p>
                </div>
                <span className="text-xs text-gray-500">2h atrás</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Activity className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pico de tráfego detectado</p>
                  <p className="text-xs text-gray-600">Traffic increased by 150% in the last hour</p>
                </div>
                <span className="text-xs text-gray-500">1h atrás</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Backup concluído com sucesso</p>
                  <p className="text-xs text-gray-600">Daily backup completed successfully</p>
                </div>
                <span className="text-xs text-gray-500">30min atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SystemOverview;
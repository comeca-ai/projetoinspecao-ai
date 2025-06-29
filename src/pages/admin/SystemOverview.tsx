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
  Shield,
  Clock,
  BarChart3,
  Wifi,
  Cloud
} from 'lucide-react';
import SystemMetrics from '@/components/admin/SystemMetrics';
import ResourceMonitoring from '@/components/admin/ResourceMonitoring';

interface SystemStatus {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
  lastCheck: string;
  description: string;
  region: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

const mockSystemStatus: SystemStatus[] = [
  {
    service: 'API Gateway',
    status: 'healthy',
    uptime: '99.9%',
    responseTime: 45,
    lastCheck: '2024-01-15T10:30:00',
    description: 'Main API endpoint handling all requests',
    region: 'us-east-1'
  },
  {
    service: 'Database Primary',
    status: 'healthy',
    uptime: '99.8%',
    responseTime: 12,
    lastCheck: '2024-01-15T10:30:00',
    description: 'PostgreSQL primary database',
    region: 'us-east-1'
  },
  {
    service: 'Database Replica',
    status: 'healthy',
    uptime: '99.7%',
    responseTime: 18,
    lastCheck: '2024-01-15T10:30:00',
    description: 'Read replica for load balancing',
    region: 'us-west-2'
  },
  {
    service: 'File Storage',
    status: 'warning',
    uptime: '99.5%',
    responseTime: 89,
    lastCheck: '2024-01-15T10:29:00',
    description: 'S3 compatible object storage',
    region: 'us-east-1'
  },
  {
    service: 'Voice Processing',
    status: 'healthy',
    uptime: '99.7%',
    responseTime: 156,
    lastCheck: '2024-01-15T10:30:00',
    description: 'AI voice recognition and processing',
    region: 'us-east-1'
  },
  {
    service: 'Email Service',
    status: 'healthy',
    uptime: '99.9%',
    responseTime: 234,
    lastCheck: '2024-01-15T10:30:00',
    description: 'Transactional email delivery',
    region: 'global'
  },
  {
    service: 'CDN',
    status: 'healthy',
    uptime: '99.95%',
    responseTime: 23,
    lastCheck: '2024-01-15T10:30:00',
    description: 'Content delivery network',
    region: 'global'
  },
  {
    service: 'Redis Cache',
    status: 'healthy',
    uptime: '99.8%',
    responseTime: 3,
    lastCheck: '2024-01-15T10:30:00',
    description: 'In-memory data structure store',
    region: 'us-east-1'
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Alto uso de armazenamento',
    message: 'Storage usage at 85% - consider scaling up storage capacity',
    timestamp: '2024-01-15T08:30:00',
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Pico de tráfego detectado',
    message: 'Traffic increased by 150% in the last hour - auto-scaling triggered',
    timestamp: '2024-01-15T09:15:00',
    resolved: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Backup concluído com sucesso',
    message: 'Daily backup completed successfully - 2.4TB backed up',
    timestamp: '2024-01-15T10:00:00',
    resolved: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Falha temporária no serviço de email',
    message: 'Email service experienced 2-minute downtime - now resolved',
    timestamp: '2024-01-15T07:45:00',
    resolved: true
  },
  {
    id: '5',
    type: 'warning',
    title: 'CPU usage elevado',
    message: 'CPU usage on web servers reached 85% - monitoring closely',
    timestamp: '2024-01-15T09:30:00',
    resolved: false
  }
];

const SystemOverview: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatLastCheck = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR');
  };

  const formatAlertTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const healthyServices = mockSystemStatus.filter(s => s.status === 'healthy').length;
  const warningServices = mockSystemStatus.filter(s => s.status === 'warning').length;
  const criticalServices = mockSystemStatus.filter(s => s.status === 'critical').length;
  const overallHealth = Math.round((healthyServices / mockSystemStatus.length) * 100);

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
              Monitoramento em tempo real da infraestrutura e serviços
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
              <div className={`text-2xl font-bold ${overallHealth >= 95 ? 'text-green-600' : overallHealth >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                {overallHealth >= 95 ? 'Operacional' : overallHealth >= 85 ? 'Degradado' : 'Crítico'}
              </div>
              <p className="text-xs text-muted-foreground">
                {healthyServices}/{mockSystemStatus.length} serviços saudáveis
              </p>
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
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {healthyServices} Saudáveis
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {warningServices} Atenção
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {criticalServices} Críticos
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSystemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-medium">{service.service}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>Uptime: {service.uptime}</span>
                        <span>•</span>
                        <span>Resposta: {service.responseTime}ms</span>
                        <span>•</span>
                        <span>{service.region}</span>
                      </div>
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
              Alertas e Notificações
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800">
                {mockAlerts.filter(a => !a.resolved && a.type === 'error').length} Críticos
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                {mockAlerts.filter(a => !a.resolved && a.type === 'warning').length} Avisos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 border rounded-lg ${getAlertBgColor(alert.type)} ${alert.resolved ? 'opacity-60' : ''}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      {alert.resolved && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                          Resolvido
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatAlertTime(alert.timestamp)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Tempo de resposta médio</span>
                <span className="font-medium">67ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Taxa de erro</span>
                <span className="font-medium text-green-600">0.02%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Throughput</span>
                <span className="font-medium">8.4k req/min</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cloud className="h-5 w-5" />
                Infraestrutura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Instâncias ativas</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Load balancers</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Regiões</span>
                <span className="font-medium">2</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wifi className="h-5 w-5" />
                Conectividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">CDN hits</span>
                <span className="font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Latência global</span>
                <span className="font-medium">23ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bandwidth</span>
                <span className="font-medium">2.1 GB/s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SystemOverview;
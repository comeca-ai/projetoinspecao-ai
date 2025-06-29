import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Server, 
  Globe, 
  Database,
  Cpu,
  HardDrive,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Shield,
  Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { monitoringAPI, type SystemMetrics, type ServiceStatus, type HealthCheck } from "@/api/monitoring";

export function Monitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [recentChecks, setRecentChecks] = useState<HealthCheck[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para carregar dados da API
  const loadMonitoringData = async () => {
    try {
      const data = await monitoringAPI.getAllMonitoringData();
      setMetrics(data.metrics);
      setServices(data.services);
      setRecentChecks(data.healthChecks);
    } catch (error) {
      console.error('Erro ao carregar dados de monitoramento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadMonitoringData();
  }, []);

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        loadMonitoringData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRefreshing]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMonitoringData();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'offline':
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Carregando dados de monitoramento...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!metrics) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os dados de monitoramento.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Monitoramento do Sistema</h1>
            <p className="text-muted-foreground">
              Acompanhe o status e performance da plataforma em tempo real
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border 
              ${isRefreshing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
              transition-colors`}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {/* Status Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-semibold">Operacional</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os sistemas funcionando
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">{metrics.uptime}%</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  30 dias
                </Badge>
              </div>
              <Progress value={metrics.uptime} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">{metrics.responseTime}ms</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Médio
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 5 minutos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">{metrics.activeUsers}</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Online
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Agora mesmo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status dos Serviços */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Serviços</CardTitle>
            <CardDescription>
              Monitoramento individual de cada componente do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(service.status)}`}>
                      {service.name.includes('Database') ? (
                        <Database className="h-5 w-5" />
                      ) : service.name.includes('API') ? (
                        <Server className="h-5 w-5" />
                      ) : (
                        <Globe className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Uptime: {service.uptime}%</span>
                        <span>•</span>
                        <span>Resposta: {service.responseTime.toFixed(0)}ms</span>
                        {service.ssl.valid && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              SSL válido ({service.ssl.expiresIn}d)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(service.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(service.status)}
                        {service.status === 'online' ? 'Online' : 
                         service.status === 'offline' ? 'Offline' : 'Alerta'}
                      </span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Último check: {formatDistanceToNow(service.lastCheck, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recursos do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos do Sistema</CardTitle>
              <CardDescription>
                Uso de CPU, memória e armazenamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">CPU</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.cpu.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={metrics.cpu} 
                  className={`h-2 ${metrics.cpu > 80 ? '[&>div]:bg-red-500' : 
                    metrics.cpu > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Memória</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.memory.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={metrics.memory} 
                  className={`h-2 ${metrics.memory > 80 ? '[&>div]:bg-red-500' : 
                    metrics.memory > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Armazenamento</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.disk}%</span>
                </div>
                <Progress 
                  value={metrics.disk} 
                  className={`h-2 ${metrics.disk > 80 ? '[&>div]:bg-red-500' : 
                    metrics.disk > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Requisições (24h)</p>
                    <p className="font-semibold">{metrics.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Erros (24h)</p>
                    <p className="font-semibold text-red-600">{metrics.errors}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Health Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Verificações</CardTitle>
              <CardDescription>
                Últimas verificações de saúde do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentChecks.map((check, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className={`mt-0.5 p-1 rounded-full ${getStatusColor(check.status)}`}>
                      {getStatusIcon(check.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{check.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{check.url}</span>
                        <span>•</span>
                        <span>{check.responseTime}ms</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(check.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
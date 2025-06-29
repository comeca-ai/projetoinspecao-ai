import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  Download,
  Mic,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  TrendingUp,
  Volume2,
  Brain,
  Loader2,
  BarChart3,
  FileText,
  Play,
  Pause
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CommandAnalytics from '@/components/admin/CommandAnalytics';
import ErrorTracking from '@/components/admin/ErrorTracking';

interface VoiceCommand {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  originalText: string;
  interpretedAction: string;
  status: 'success' | 'error' | 'processing';
  executionTime: number;
  confidence: number;
  errorMessage?: string;
  inspectionId?: string;
  clientId: string;
  clientName: string;
  audioUrl?: string;
  language: string;
  deviceType: string;
}

const mockVoiceCommands: VoiceCommand[] = [
  {
    id: '1',
    userId: 'user-123',
    userName: 'Carlos Silva',
    userEmail: 'carlos@techcorp.com',
    timestamp: '2024-01-15T10:30:00',
    originalText: 'adicionar teste de continuidade',
    interpretedAction: 'ADD_TEST: Teste de Continuidade',
    status: 'success',
    executionTime: 1200,
    confidence: 0.95,
    inspectionId: 'insp-456',
    clientId: 'client-1',
    clientName: 'TechCorp Engenharia',
    audioUrl: '/audio/cmd-1.wav',
    language: 'pt-BR',
    deviceType: 'mobile'
  },
  {
    id: '2',
    userId: 'user-234',
    userName: 'Ana Costa',
    userEmail: 'ana@solartech.com',
    timestamp: '2024-01-15T10:25:00',
    originalText: 'marcar como concluído',
    interpretedAction: 'MARK_COMPLETED: Current Test',
    status: 'success',
    executionTime: 800,
    confidence: 0.92,
    inspectionId: 'insp-789',
    clientId: 'client-2',
    clientName: 'Solar Tech Solutions',
    audioUrl: '/audio/cmd-2.wav',
    language: 'pt-BR',
    deviceType: 'desktop'
  },
  {
    id: '3',
    userId: 'user-345',
    userName: 'Roberto Lima',
    userEmail: 'roberto@eletricapro.com',
    timestamp: '2024-01-15T10:20:00',
    originalText: 'adicionar observação problema na fiação',
    interpretedAction: 'ADD_OBSERVATION: problema na fiação',
    status: 'error',
    executionTime: 2100,
    confidence: 0.78,
    errorMessage: 'Nenhum teste ativo selecionado',
    inspectionId: 'insp-101',
    clientId: 'client-3',
    clientName: 'Elétrica Pro',
    audioUrl: '/audio/cmd-3.wav',
    language: 'pt-BR',
    deviceType: 'tablet'
  },
  {
    id: '4',
    userId: 'user-456',
    userName: 'Maria Santos',
    userEmail: 'maria@inspecoes.com',
    timestamp: '2024-01-15T10:15:00',
    originalText: 'tirar foto do painel',
    interpretedAction: 'CAPTURE_PHOTO: painel',
    status: 'processing',
    executionTime: 0,
    confidence: 0.88,
    inspectionId: 'insp-202',
    clientId: 'client-4',
    clientName: 'Inspeções Rápidas',
    audioUrl: '/audio/cmd-4.wav',
    language: 'pt-BR',
    deviceType: 'mobile'
  },
  {
    id: '5',
    userId: 'user-567',
    userName: 'Pedro Oliveira',
    userEmail: 'pedro@automacao.com',
    timestamp: '2024-01-15T10:10:00',
    originalText: 'finalizar inspeção atual',
    interpretedAction: 'FINISH_INSPECTION: Current',
    status: 'success',
    executionTime: 950,
    confidence: 0.97,
    inspectionId: 'insp-303',
    clientId: 'client-5',
    clientName: 'Automação Industrial',
    audioUrl: '/audio/cmd-5.wav',
    language: 'pt-BR',
    deviceType: 'desktop'
  }
];

const VoiceLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const filteredCommands = mockVoiceCommands.filter(command => {
    const matchesSearch = command.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.interpretedAction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || command.status === statusFilter;
    const matchesClient = clientFilter === 'all' || command.clientId === clientFilter;
    const matchesDevice = deviceFilter === 'all' || command.deviceType === deviceFilter;
    return matchesSearch && matchesStatus && matchesClient && matchesDevice;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Sucesso', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      error: { label: 'Erro', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800', icon: Loader2 },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeviceIcon = (deviceType: string) => {
    // You could add device-specific icons here
    return '📱';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  const handlePlayAudio = (commandId: string) => {
    if (playingAudio === commandId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(commandId);
      // In a real app, you would play the actual audio file
      setTimeout(() => setPlayingAudio(null), 3000); // Simulate audio duration
    }
  };

  const getOverallStats = () => {
    const totalCommands = mockVoiceCommands.length;
    const successCommands = mockVoiceCommands.filter(c => c.status === 'success').length;
    const errorCommands = mockVoiceCommands.filter(c => c.status === 'error').length;
    const avgConfidence = mockVoiceCommands.reduce((sum, c) => sum + c.confidence, 0) / totalCommands;
    const avgExecutionTime = mockVoiceCommands
      .filter(c => c.status === 'success')
      .reduce((sum, c) => sum + c.executionTime, 0) / successCommands;

    return {
      totalCommands,
      successRate: Math.round((successCommands / totalCommands) * 100),
      errorRate: Math.round((errorCommands / totalCommands) * 100),
      averageConfidence: Math.round(avgConfidence * 100),
      averageExecutionTime: Math.round(avgExecutionTime),
      commandsToday: totalCommands,
      topErrorType: 'NO_ACTIVE_TEST'
    };
  };

  const stats = getOverallStats();

  const uniqueClients = Array.from(new Set(mockVoiceCommands.map(c => c.clientId)))
    .map(id => {
      const command = mockVoiceCommands.find(c => c.clientId === id);
      return { id, name: command?.clientName || '' };
    });

  const exportLogs = () => {
    // Implement CSV export functionality
    console.log('Exporting logs...');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Logs de Comandos de Voz
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoramento e análise detalhada dos comandos de voz processados
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Relatório
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comandos Hoje</CardTitle>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.commandsToday}</div>
              <p className="text-xs text-muted-foreground">+15% vs ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.errorRate}% de erros
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confiança Média</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
              <p className="text-xs text-muted-foreground">Precisão da IA</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageExecutionTime}ms</div>
              <p className="text-xs text-muted-foreground">Processamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <CommandAnalytics />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar comandos, usuários ou ações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
              </SelectContent>
            </Select>

            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Commands List */}
        <Card>
          <CardHeader>
            <CardTitle>Comandos Recentes</CardTitle>
            <div className="text-sm text-gray-600">
              Mostrando {filteredCommands.length} de {mockVoiceCommands.length} comandos
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCommands.map((command) => (
                <div key={command.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        <Mic className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{command.userName}</span>
                          <Badge variant="outline" className="text-xs">
                            {command.clientName}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getDeviceIcon(command.deviceType)} {command.deviceType}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{command.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(command.timestamp)}
                      </span>
                      {getStatusBadge(command.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Comando Original:</h4>
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-700">"{command.originalText}"</span>
                        {command.audioUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayAudio(command.id)}
                            className="h-6 w-6 p-0"
                          >
                            {playingAudio === command.id ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Ação Interpretada:</h4>
                      <div className="flex items-center gap-2">
                        <Brain className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-700">{command.interpretedAction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>
                        Confiança: <span className={`font-medium ${getConfidenceColor(command.confidence)}`}>
                          {Math.round(command.confidence * 100)}%
                        </span>
                      </span>
                      {command.status === 'success' && (
                        <span>Tempo: {command.executionTime}ms</span>
                      )}
                      <span>Idioma: {command.language}</span>
                      {command.inspectionId && (
                        <span>Inspeção: {command.inspectionId}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>

                  {command.errorMessage && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>Erro:</strong> {command.errorMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCommands.length === 0 && (
              <div className="text-center py-12">
                <Mic className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum comando encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente ajustar os filtros de busca.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Tracking */}
        <ErrorTracking />
      </div>
    </AppLayout>
  );
};

export default VoiceLogs;
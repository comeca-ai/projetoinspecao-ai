import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, CheckCircle, AlertCircle, Search, Filter, Plus, Eye } from 'lucide-react';

const TeamInspections: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data for team inspections
  const inspections = [
    {
      id: 1,
      title: 'Inspeção Elétrica - Edifício Central',
      location: 'Rua das Flores, 123',
      inspector: 'Jer',
      status: 'em_andamento',
      progress: 65,
      dueDate: '2025-01-15',
      priority: 'alta'
    },
    {
      id: 2,
      title: 'Vistoria de Segurança - Galpão Norte',
      location: 'Zona Industrial, Lote 45',
      inspector: 'Jer',
      status: 'concluida',
      progress: 100,
      dueDate: '2025-01-10',
      priority: 'media'
    },
    {
      id: 3,
      title: 'Auditoria Ambiental - Fábrica Sul',
      location: 'BR-101, KM 85',
      inspector: 'Jer',
      status: 'pendente',
      progress: 0,
      dueDate: '2025-01-20',
      priority: 'baixa'
    },
    {
      id: 4,
      title: 'Inspeção Estrutural - Ponte Rodoviária',
      location: 'Rodovia Estadual, KM 15',
      inspector: 'Jer',
      status: 'atrasada',
      progress: 30,
      dueDate: '2025-01-05',
      priority: 'alta'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
      concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
      pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      atrasada: { label: 'Atrasada', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      alta: { label: 'Alta', color: 'bg-red-100 text-red-800' },
      media: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
      baixa: { label: 'Baixa', color: 'bg-green-100 text-green-800' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || inspection.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inspeções da Equipe</h1>
            <p className="text-gray-600 mt-2">
              Acompanhe todas as inspeções da sua equipe
            </p>
          </div>
          <Button className="bg-[#f26522] hover:bg-[#e55a1f]">
            <Plus className="h-4 w-4 mr-2" />
            Nova Inspeção
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Inspeções ativas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Aguardando início</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Requer atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar inspeções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('all')}
              size="sm"
            >
              Todas
            </Button>
            <Button
              variant={selectedStatus === 'em_andamento' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('em_andamento')}
              size="sm"
            >
              Em Andamento
            </Button>
            <Button
              variant={selectedStatus === 'pendente' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('pendente')}
              size="sm"
            >
              Pendentes
            </Button>
            <Button
              variant={selectedStatus === 'atrasada' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('atrasada')}
              size="sm"
            >
              Atrasadas
            </Button>
          </div>
        </div>

        {/* Inspections List */}
        <div className="space-y-4">
          {filteredInspections.map((inspection) => (
            <Card key={inspection.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{inspection.title}</h3>
                      {getStatusBadge(inspection.status)}
                      {getPriorityBadge(inspection.priority)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Local:</span> {inspection.location}
                      </div>
                      <div>
                        <span className="font-medium">Inspetor:</span> {inspection.inspector}
                      </div>
                      <div>
                        <span className="font-medium">Prazo:</span> {new Date(inspection.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    {inspection.status === 'em_andamento' && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Progresso:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#f26522] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${inspection.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{inspection.progress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInspections.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma inspeção encontrada</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TeamInspections;
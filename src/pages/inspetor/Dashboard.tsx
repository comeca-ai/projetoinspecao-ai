import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Eye
} from 'lucide-react';
import InspectionCard from '@/components/inspetor/InspectionCard';
import QuickActions from '@/components/inspetor/QuickActions';

interface Inspection {
  id: string;
  title: string;
  project: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  testsTotal: number;
  testsCompleted: number;
  location: string;
  assignedBy: string;
}

const mockInspections: Inspection[] = [
  {
    id: '1',
    title: 'Inspeção Elétrica - Painel Principal',
    project: 'Edifício Comercial Centro',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-15',
    progress: 65,
    testsTotal: 12,
    testsCompleted: 8,
    location: 'São Paulo - SP',
    assignedBy: 'João Silva'
  },
  {
    id: '2',
    title: 'Verificação HVAC - Sistema Central',
    project: 'Shopping Plaza Norte',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-18',
    progress: 0,
    testsTotal: 8,
    testsCompleted: 0,
    location: 'São Paulo - SP',
    assignedBy: 'Maria Santos'
  },
  {
    id: '3',
    title: 'Inspeção Solar - Painéis Telhado',
    project: 'Residencial Jardins',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-01-10',
    progress: 100,
    testsTotal: 6,
    testsCompleted: 6,
    location: 'Campinas - SP',
    assignedBy: 'Carlos Lima'
  },
  {
    id: '4',
    title: 'Segurança Estrutural - Fundação',
    project: 'Torre Empresarial',
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-01-12',
    progress: 30,
    testsTotal: 15,
    testsCompleted: 4,
    location: 'São Paulo - SP',
    assignedBy: 'Ana Costa'
  }
];

const InspetorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInspections = mockInspections.filter(inspection => {
    const matchesSearch = inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      pending: mockInspections.filter(i => i.status === 'pending').length,
      in_progress: mockInspections.filter(i => i.status === 'in_progress').length,
      completed: mockInspections.filter(i => i.status === 'completed').length,
      overdue: mockInspections.filter(i => i.status === 'overdue').length,
    };
  };

  const stats = getStatusStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Minhas Inspeções
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas inspeções e acompanhe o progresso
            </p>
          </div>
          <Button className="bg-[#f26522] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova Inspeção
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Aguardando início</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Play className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
              <p className="text-xs text-muted-foreground">Em execução</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">Requer atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar inspeções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pendentes
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in_progress')}
            >
              Em Andamento
            </Button>
            <Button
              variant={statusFilter === 'overdue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('overdue')}
            >
              Atrasadas
            </Button>
          </div>
        </div>

        {/* Inspections List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>

        {filteredInspections.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma inspeção encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando sua primeira inspeção.'
              }
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default InspetorDashboard;
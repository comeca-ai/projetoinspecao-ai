import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Plus,
  Building,
  Users,
  CreditCard,
  TrendingUp,
  MoreVertical,
  Settings,
  Ban,
  RefreshCw,
  Crown,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ClientCard from '@/components/admin/ClientCard';
import PlanManagement from '@/components/admin/PlanManagement';

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  plan: 'iniciante' | 'profissional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  joinDate: string;
  lastActivity: string;
  teamMembers: number;
  activeInspections: number;
  storageUsed: number;
  storageLimit: number;
  monthlyRevenue: number;
  stripeCustomerId: string;
  trialEndsAt?: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'TechCorp Engenharia',
    contactName: 'João Silva',
    email: 'joao@techcorp.com',
    phone: '+55 11 99999-1111',
    plan: 'enterprise',
    status: 'active',
    joinDate: '2023-06-15',
    lastActivity: '2024-01-15T10:30:00',
    teamMembers: 25,
    activeInspections: 45,
    storageUsed: 180,
    storageLimit: 500,
    monthlyRevenue: 599,
    stripeCustomerId: 'cus_techcorp123'
  },
  {
    id: '2',
    companyName: 'Inspeções Rápidas Ltda',
    contactName: 'Maria Santos',
    email: 'maria@inspecoesrapidas.com',
    phone: '+55 11 99999-2222',
    plan: 'profissional',
    status: 'active',
    joinDate: '2023-08-20',
    lastActivity: '2024-01-15T09:15:00',
    teamMembers: 8,
    activeInspections: 23,
    storageUsed: 32,
    storageLimit: 50,
    monthlyRevenue: 239,
    stripeCustomerId: 'cus_inspecoes456'
  },
  {
    id: '3',
    companyName: 'Elétrica Pro',
    contactName: 'Carlos Lima',
    email: 'carlos@eletricapro.com',
    phone: '+55 11 99999-3333',
    plan: 'iniciante',
    status: 'trial',
    joinDate: '2024-01-01',
    lastActivity: '2024-01-14T16:45:00',
    teamMembers: 3,
    activeInspections: 5,
    storageUsed: 2,
    storageLimit: 5,
    monthlyRevenue: 0,
    stripeCustomerId: 'cus_eletrica789',
    trialEndsAt: '2024-01-15'
  },
  {
    id: '4',
    companyName: 'Solar Tech Solutions',
    contactName: 'Ana Costa',
    email: 'ana@solartech.com',
    phone: '+55 11 99999-4444',
    plan: 'profissional',
    status: 'suspended',
    joinDate: '2023-04-10',
    lastActivity: '2024-01-05T14:20:00',
    teamMembers: 12,
    activeInspections: 0,
    storageUsed: 45,
    storageLimit: 50,
    monthlyRevenue: 239,
    stripeCustomerId: 'cus_solar101'
  }
];

const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPlan = planFilter === 'all' || client.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getOverallStats = () => {
    return {
      totalClients: mockClients.length,
      activeClients: mockClients.filter(c => c.status === 'active').length,
      trialClients: mockClients.filter(c => c.status === 'trial').length,
      suspendedClients: mockClients.filter(c => c.status === 'suspended').length,
      totalRevenue: mockClients.reduce((sum, c) => sum + c.monthlyRevenue, 0),
      totalUsers: mockClients.reduce((sum, c) => sum + c.teamMembers, 0),
      totalInspections: mockClients.reduce((sum, c) => sum + c.activeInspections, 0)
    };
  };

  const stats = getOverallStats();

  const handleClientAction = (clientId: string, action: string) => {
    console.log(`Action ${action} for client ${clientId}`);
    // Here you would implement the actual client management actions
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciamento de Clientes
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os clientes da plataforma SaaS
            </p>
          </div>
          <Button className="bg-[#f26522] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeClients} ativos, {stats.trialClients} em trial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Receita recorrente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Across all clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inspeções Ativas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInspections}</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Status: {statusFilter === 'all' ? 'Todos' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Ativos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('trial')}>
                  Trial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>
                  Suspensos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Plan Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Plano: {planFilter === 'all' ? 'Todos' : planFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPlanFilter('all')}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPlanFilter('iniciante')}>
                  Iniciante
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPlanFilter('profissional')}>
                  Profissional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPlanFilter('enterprise')}>
                  Enterprise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onAction={handleClientAction}
            />
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || planFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece adicionando o primeiro cliente.'
              }
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientManagement;
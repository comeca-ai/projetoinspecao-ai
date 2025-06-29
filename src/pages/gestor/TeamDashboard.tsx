import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  UserPlus,
  Settings
} from 'lucide-react';
import TeamMemberCard from '@/components/gestor/TeamMemberCard';
import InviteMemberModal from '@/components/gestor/InviteMemberModal';
import TeamStats from '@/components/gestor/TeamStats';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'inspetor' | 'gestor';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  location: string;
  activeInspections: number;
  completedInspections: number;
  averageRating: number;
  lastActivity: string;
  specialties: string[];
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@empresa.com',
    phone: '+55 11 99999-1111',
    role: 'inspetor',
    status: 'active',
    joinDate: '2023-06-15',
    location: 'São Paulo - SP',
    activeInspections: 3,
    completedInspections: 45,
    averageRating: 4.8,
    lastActivity: '2024-01-15T10:30:00',
    specialties: ['Elétrica', 'Solar']
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    phone: '+55 11 99999-2222',
    role: 'inspetor',
    status: 'active',
    joinDate: '2023-08-20',
    location: 'Campinas - SP',
    activeInspections: 2,
    completedInspections: 32,
    averageRating: 4.6,
    lastActivity: '2024-01-15T09:15:00',
    specialties: ['HVAC', 'Segurança']
  },
  {
    id: '3',
    name: 'Roberto Lima',
    email: 'roberto.lima@empresa.com',
    phone: '+55 11 99999-3333',
    role: 'inspetor',
    status: 'inactive',
    joinDate: '2023-04-10',
    location: 'Santos - SP',
    activeInspections: 0,
    completedInspections: 28,
    averageRating: 4.4,
    lastActivity: '2024-01-10T16:45:00',
    specialties: ['Estrutural', 'Segurança']
  },
  {
    id: '4',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    phone: '+55 11 99999-4444',
    role: 'inspetor',
    status: 'pending',
    joinDate: '2024-01-10',
    location: 'São Paulo - SP',
    activeInspections: 0,
    completedInspections: 0,
    averageRating: 0,
    lastActivity: '2024-01-10T14:20:00',
    specialties: ['Elétrica']
  }
];

const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTeamStats = () => {
    return {
      total: mockTeamMembers.length,
      active: mockTeamMembers.filter(m => m.status === 'active').length,
      inactive: mockTeamMembers.filter(m => m.status === 'inactive').length,
      pending: mockTeamMembers.filter(m => m.status === 'pending').length,
      totalActiveInspections: mockTeamMembers.reduce((sum, m) => sum + m.activeInspections, 0),
      totalCompletedInspections: mockTeamMembers.reduce((sum, m) => sum + m.completedInspections, 0),
      averageRating: mockTeamMembers.reduce((sum, m) => sum + m.averageRating, 0) / mockTeamMembers.length
    };
  };

  const stats = getTeamStats();

  const handleInviteMember = (memberData: any) => {
    console.log('Inviting member:', memberData);
    setIsInviteModalOpen(false);
    // Here you would typically send the invitation
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestão de Equipe
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie sua equipe de inspetores e acompanhe o desempenho
            </p>
          </div>
          <Button 
            className="bg-[#f26522] hover:bg-[#e55a1f]"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Convidar Membro
          </Button>
        </div>

        {/* Team Stats */}
        <TeamStats stats={stats} />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar membros da equipe..."
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
              Todos
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
            >
              Ativos
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
            >
              Inativos
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pendentes
            </Button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece convidando membros para sua equipe.'
              }
            </p>
            <div className="mt-6">
              <Button 
                className="bg-[#f26522] hover:bg-[#e55a1f]"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar Primeiro Membro
              </Button>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteMember}
        />
      </div>
    </AppLayout>
  );
};

export default TeamDashboard;
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Eye, 
  MapPin, 
  User, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface InspectionCardProps {
  inspection: Inspection;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ inspection }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      in_progress: { label: 'Em Andamento', variant: 'default' as const, icon: Play },
      completed: { label: 'Concluída', variant: 'secondary' as const, icon: CheckCircle },
      overdue: { label: 'Atrasada', variant: 'destructive' as const, icon: AlertTriangle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority as keyof typeof colors];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = new Date(inspection.dueDate) < new Date() && inspection.status !== 'completed';

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {inspection.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{inspection.project}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {inspection.location}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {inspection.assignedBy}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(inspection.status)}
            <span className={`text-xs font-medium ${getPriorityColor(inspection.priority)}`}>
              Prioridade {inspection.priority === 'low' ? 'Baixa' : 
                         inspection.priority === 'medium' ? 'Média' : 'Alta'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">
              {inspection.testsCompleted}/{inspection.testsTotal} testes
            </span>
          </div>
          <Progress value={inspection.progress} className="h-2" />
          <div className="text-xs text-gray-500">
            {inspection.progress}% concluído
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3 w-3" />
            Prazo:
          </div>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(inspection.dueDate)}
            {isOverdue && ' (Atrasado)'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {inspection.status === 'completed' ? (
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Ver Relatório
            </Button>
          ) : (
            <Link to={`/inspections/${inspection.id}/execute`} className="flex-1">
              <Button 
                size="sm" 
                className="w-full bg-[#f26522] hover:bg-[#e55a1f]"
              >
                <Play className="mr-2 h-4 w-4" />
                {inspection.status === 'pending' ? 'Iniciar' : 'Continuar'}
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionCard;
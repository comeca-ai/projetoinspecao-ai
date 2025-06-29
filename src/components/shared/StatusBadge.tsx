import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Pause,
  Play,
  Loader2,
  Info,
  AlertTriangle,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'paused'
  | 'active'
  | 'inactive'
  | 'draft'
  | 'published'
  | 'archived';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  className?: string;
  customConfig?: {
    [key in StatusType]?: {
      label: string;
      color: string;
      icon?: React.ComponentType<{ className?: string }>;
    };
  };
}

const defaultStatusConfig: Record<StatusType, {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  success: {
    label: 'Sucesso',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  warning: {
    label: 'Atenção',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle
  },
  error: {
    label: 'Erro',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  info: {
    label: 'Informação',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Info
  },
  pending: {
    label: 'Pendente',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock
  },
  in_progress: {
    label: 'Em Andamento',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Loader2
  },
  completed: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  failed: {
    label: 'Falhou',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Ban
  },
  paused: {
    label: 'Pausado',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Pause
  },
  active: {
    label: 'Ativo',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Play
  },
  inactive: {
    label: 'Inativo',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Pause
  },
  draft: {
    label: 'Rascunho',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock
  },
  published: {
    label: 'Publicado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  archived: {
    label: 'Arquivado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Ban
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
  size = 'default',
  variant = 'default',
  className = '',
  customConfig = {}
}) => {
  const config = customConfig[status] || defaultStatusConfig[status];
  const displayLabel = label || config.label;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const variantClasses = {
    default: config.color,
    outline: `border ${config.color.replace('bg-', 'border-').replace('text-', 'text-')} bg-transparent`,
    solid: config.color.replace('100', '500').replace('800', 'white')
  };

  return (
    <Badge 
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showIcon && Icon && (
        <Icon 
          className={cn(
            iconSizes[size],
            status === 'in_progress' && 'animate-spin'
          )} 
        />
      )}
      {displayLabel}
    </Badge>
  );
};

// Convenience components for common statuses
export const SuccessBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="success" {...props} />
);

export const ErrorBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="error" {...props} />
);

export const WarningBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="warning" {...props} />
);

export const InfoBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="info" {...props} />
);

export const PendingBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="pending" {...props} />
);

export const InProgressBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="in_progress" {...props} />
);
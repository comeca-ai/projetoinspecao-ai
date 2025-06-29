import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Trash2, 
  CheckCircle, 
  Info,
  HelpCircle,
  XCircle
} from 'lucide-react';

export type ConfirmDialogType = 'danger' | 'warning' | 'info' | 'success' | 'question';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  destructive?: boolean;
}

const typeConfig: Record<ConfirmDialogType, {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  confirmButtonClass: string;
}> = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700 text-white'
  },
  question: {
    icon: HelpCircle,
    iconColor: 'text-gray-600',
    confirmButtonClass: 'bg-gray-600 hover:bg-gray-700 text-white'
  }
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'question',
  onConfirm,
  loading = false,
  destructive = false
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error handling should be done by the parent component
      console.error('Confirm action failed:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              type === 'danger' ? 'bg-red-100' :
              type === 'warning' ? 'bg-yellow-100' :
              type === 'info' ? 'bg-blue-100' :
              type === 'success' ? 'bg-green-100' :
              'bg-gray-100'
            }`}>
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={destructive || type === 'danger' ? config.confirmButtonClass : undefined}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Convenience hook for using confirm dialogs
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmDialogType;
    onConfirm: () => void | Promise<void>;
    destructive?: boolean;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const [loading, setLoading] = React.useState(false);

  const confirm = React.useCallback((options: Omit<typeof dialogState, 'open'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        ...options,
        open: true,
        onConfirm: async () => {
          setLoading(true);
          try {
            await options.onConfirm();
            resolve(true);
          } catch (error) {
            resolve(false);
          } finally {
            setLoading(false);
          }
        }
      });
    });
  }, []);

  const ConfirmDialogComponent = React.useCallback(() => (
    <ConfirmDialog
      {...dialogState}
      loading={loading}
      onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
    />
  ), [dialogState, loading]);

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent
  };
};

// Convenience functions for common dialog types
export const confirmDelete = (
  title: string = 'Confirmar exclusão',
  description: string = 'Esta ação não pode ser desfeita.',
  onConfirm: () => void | Promise<void>
) => ({
  title,
  description,
  confirmText: 'Excluir',
  cancelText: 'Cancelar',
  type: 'danger' as const,
  destructive: true,
  onConfirm
});

export const confirmAction = (
  title: string,
  description: string,
  onConfirm: () => void | Promise<void>,
  confirmText: string = 'Confirmar'
) => ({
  title,
  description,
  confirmText,
  cancelText: 'Cancelar',
  type: 'question' as const,
  onConfirm
});
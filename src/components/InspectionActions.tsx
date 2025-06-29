import React, { useState } from 'react';
import { 
  Button, 
  ButtonGroup, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Share as ShareIcon, 
  Print as PrintIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Inspection } from '@/types/inspection';

interface InspectionActionsProps {
  inspection: Inspection;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
}

/**
 * Component that renders action buttons for an inspection with permission checks
 */
export const InspectionActions: React.FC<InspectionActionsProps> = ({
  inspection,
  onEdit,
  onDelete,
  onShare,
  onPrint
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { canPerformAction } = usePermissions();
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete?.();
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  // Check if inspection is completed
  const isCompleted = inspection.status === 'completed';
  
  return (
    <>
      <ButtonGroup size="small" aria-label="inspection actions">
        <PermissionGuard
          action="edit_inspection"
          actionContext={{ inspectionId: inspection.id, status: inspection.status }}
          hideIfUnauthorized
        >
          <Tooltip title={isCompleted ? "Inspeção finalizada" : "Editar"}>
            <span>
              <IconButton 
                onClick={onEdit} 
                disabled={isCompleted}
                color="primary"
                size="small"
              >
                {isCompleted ? <LockIcon /> : <EditIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </PermissionGuard>
        
        <PermissionGuard
          permission="manage_inspections"
          hideIfUnauthorized
        >
          <Tooltip title="Excluir">
            <IconButton 
              onClick={handleDeleteClick} 
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
        
        <PermissionGuard
          permission="view_reports"
          hideIfUnauthorized
        >
          <Tooltip title="Imprimir relatório">
            <IconButton 
              onClick={onPrint} 
              color="primary"
              size="small"
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
        
        <PermissionGuard
          permission="manage_inspections"
          hideIfUnauthorized
        >
          <Tooltip title="Compartilhar">
            <IconButton 
              onClick={onShare} 
              color="primary"
              size="small"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      </ButtonGroup>
      
      {/* Confirmation dialog for delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir esta inspeção? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

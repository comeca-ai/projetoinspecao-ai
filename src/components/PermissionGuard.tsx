import React, { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/usePermissions';
import { Alert, AlertTitle, Box } from '@mui/material';

interface PermissionGuardProps {
  /**
   * The permission required to access the content
   */
  permission?: Permission;
  
  /**
   * Multiple permissions where any one is sufficient (OR logic)
   */
  anyPermission?: Permission[];
  
  /**
   * Multiple permissions where all are required (AND logic)
   */
  allPermissions?: Permission[];
  
  /**
   * Specific action to check (uses business logic in usePermissions)
   */
  action?: string;
  
  /**
   * Context data for action check
   */
  actionContext?: any;
  
  /**
   * Feature from plan to check
   */
  feature?: string;
  
  /**
   * Content to render if permission check passes
   */
  children: ReactNode;
  
  /**
   * Custom fallback component to render if permission check fails
   */
  fallback?: ReactNode;
  
  /**
   * Whether to hide the component completely if permission check fails
   */
  hideIfUnauthorized?: boolean;
  
  /**
   * Whether to show upgrade message if applicable
   */
  showUpgradeMessage?: boolean;
}

/**
 * A component that conditionally renders its children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  anyPermission,
  allPermissions,
  action,
  actionContext,
  feature,
  children,
  fallback,
  hideIfUnauthorized = false,
  showUpgradeMessage = true,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
    canUseFeature,
    getUpgradeMessage,
  } = usePermissions();

  // Check permissions based on provided props
  let isAuthorized = true;

  if (permission) {
    isAuthorized = hasPermission(permission);
  }

  if (isAuthorized && anyPermission?.length) {
    isAuthorized = hasAnyPermission(anyPermission);
  }

  if (isAuthorized && allPermissions?.length) {
    isAuthorized = hasAllPermissions(allPermissions);
  }

  if (isAuthorized && action) {
    isAuthorized = canPerformAction(action, actionContext);
  }

  if (isAuthorized && feature) {
    isAuthorized = canUseFeature(feature);
  }

  // If authorized, render children
  if (isAuthorized) {
    return <>{children}</>;
  }

  // If unauthorized and should hide, render nothing
  if (hideIfUnauthorized) {
    return null;
  }

  // If custom fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback with upgrade message if applicable
  let upgradeMessage = null;
  if (showUpgradeMessage && feature) {
    upgradeMessage = getUpgradeMessage(feature);
  }

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="warning">
        <AlertTitle>Acesso Restrito</AlertTitle>
        Você não tem permissão para acessar este recurso.
        {upgradeMessage && (
          <Box sx={{ mt: 1, fontWeight: 'bold' }}>
            {upgradeMessage}
          </Box>
        )}
      </Alert>
    </Box>
  );
};

/**
 * A component that only renders its children if a specific action can be performed
 */
export const ActionGuard: React.FC<Omit<PermissionGuardProps, 'permission' | 'anyPermission' | 'allPermissions' | 'feature'> & { action: string }> = (props) => {
  return <PermissionGuard {...props} />;
};

/**
 * A component that only renders its children if a specific feature is available in the user's plan
 */
export const FeatureGuard: React.FC<Omit<PermissionGuardProps, 'permission' | 'anyPermission' | 'allPermissions' | 'action' | 'actionContext'> & { feature: string }> = (props) => {
  return <PermissionGuard {...props} />;
};

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions, Permission } from '@/hooks/usePermissions';
import { Alert, AlertTitle, Box, Button, Container, Typography } from '@mui/material';

interface RouteGuardProps {
  /**
   * The permission required to access this route
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
   * Whether authentication is required
   */
  requireAuth?: boolean;
  
  /**
   * Redirect path if unauthorized
   */
  redirectTo?: string;
  
  /**
   * Content to render if authorized
   */
  children: ReactNode;
}

/**
 * A component that guards routes based on authentication and permissions
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  permission,
  anyPermission,
  allPermissions,
  action,
  actionContext,
  feature,
  requireAuth = true,
  redirectTo = '/login',
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
    canUseFeature,
    getUpgradeMessage,
  } = usePermissions();

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Verificando permissões...</Typography>
      </Container>
    );
  }

  // Check if user is authenticated
  if (requireAuth && !user) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If no permissions are required, render children
  if (!permission && !anyPermission?.length && !allPermissions?.length && !action && !feature) {
    return <>{children}</>;
  }

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

  // Get upgrade message if applicable
  let upgradeMessage = null;
  if (feature) {
    upgradeMessage = getUpgradeMessage(feature);
  }

  // If unauthorized, show access denied page
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Alert severity="error" sx={{ mb: 4 }}>
        <AlertTitle>Acesso Negado</AlertTitle>
        Você não tem permissão para acessar esta página.
      </Alert>
      
      {upgradeMessage && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <AlertTitle>Upgrade Necessário</AlertTitle>
          {upgradeMessage}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
        
        <Button 
          variant="contained" 
          color="primary" 
          component="a" 
          href="/"
        >
          Ir para Dashboard
        </Button>
      </Box>
    </Container>
  );
};

/**
 * A component that guards routes based on specific roles
 */
export const RoleGuard: React.FC<Omit<RouteGuardProps, 'permission' | 'anyPermission' | 'allPermissions'> & { 
  roles: ('admin' | 'gestor' | 'inspetor')[] 
}> = ({ roles, ...props }) => {
  const { user } = useAuth();
  
  // Check if user has one of the required roles
  const hasRole = user && roles.includes(user.role);
  
  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <RouteGuard {...props} />;
};

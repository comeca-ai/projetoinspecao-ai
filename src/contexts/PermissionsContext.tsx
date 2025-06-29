import React, { createContext, useContext, ReactNode } from 'react';
import { usePermissions, Permission, Role, Plan } from '@/hooks/usePermissions';

interface PermissionsContextType {
  permissions: Permission[];
  planLimits: any;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canUseFeature: (feature: string) => boolean;
  isWithinLimit: (limitType: string, currentValue: number) => boolean;
  getRemainingQuota: (limitType: string, currentValue: number) => number | null;
  getUsagePercentage: (limitType: string, currentValue: number) => number;
  canPerformAction: (action: string, context?: any) => boolean;
  getUpgradeMessage: (feature: string) => string | null;
  role?: Role;
  plan?: Plan;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const permissionsData = usePermissions();

  return (
    <PermissionsContext.Provider value={permissionsData}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Higher-order component for permission-based rendering
export const withPermissions = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: Permission[],
  fallback?: React.ComponentType<P> | React.ReactNode
) => {
  return (props: P) => {
    const { hasAnyPermission } = usePermissionsContext();
    
    if (!hasAnyPermission(requiredPermissions)) {
      if (fallback) {
        return React.isValidElement(fallback) ? fallback : React.createElement(fallback as React.ComponentType<P>, props);
      }
      return null;
    }
    
    return <Component {...props} />;
  };
};

// Component for conditional rendering based on permissions
interface PermissionGateProps {
  permissions: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  requireAll = false,
  fallback = null,
  children
}) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissionsContext();
  
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Component for feature-based rendering
interface FeatureGateProps {
  feature: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  fallback = null,
  children
}) => {
  const { canUseFeature } = usePermissionsContext();
  
  if (!canUseFeature(feature)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Component for plan-based rendering
interface PlanGateProps {
  plans: Plan[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PlanGate: React.FC<PlanGateProps> = ({
  plans,
  fallback = null,
  children
}) => {
  const { plan } = usePermissionsContext();
  
  if (!plan || !plans.includes(plan)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Component for role-based rendering
interface RoleGateProps {
  roles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  roles,
  fallback = null,
  children
}) => {
  const { role } = usePermissionsContext();
  
  if (!role || !roles.includes(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Hook for checking if user can perform an action with context
export const useActionPermission = (action: string, context?: any) => {
  const { canPerformAction } = usePermissionsContext();
  return canPerformAction(action, context);
};

// Hook for getting upgrade messages
export const useUpgradeMessage = (feature: string) => {
  const { getUpgradeMessage } = usePermissionsContext();
  return getUpgradeMessage(feature);
};

// Hook for usage limits
export const useUsageLimits = () => {
  const { isWithinLimit, getRemainingQuota, getUsagePercentage, planLimits } = usePermissionsContext();
  
  return {
    isWithinLimit,
    getRemainingQuota,
    getUsagePercentage,
    planLimits,
    checkLimit: (limitType: string, currentValue: number) => ({
      isWithin: isWithinLimit(limitType, currentValue),
      remaining: getRemainingQuota(limitType, currentValue),
      percentage: getUsagePercentage(limitType, currentValue)
    })
  };
};
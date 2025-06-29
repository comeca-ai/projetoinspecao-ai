import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type Permission = 
  | 'view_dashboard'
  | 'manage_inspections'
  | 'execute_inspections'
  | 'view_reports'
  | 'generate_reports'
  | 'manage_team'
  | 'invite_members'
  | 'manage_templates'
  | 'view_analytics'
  | 'manage_billing'
  | 'view_team_inspections'
  | 'manage_clients'
  | 'view_system_overview'
  | 'view_voice_logs'
  | 'use_voice_assistant'
  | 'upload_files'
  | 'export_data'
  | 'manage_settings';

export type Role = 'admin' | 'gestor' | 'inspetor';
export type Plan = 'iniciante' | 'profissional' | 'enterprise';

// Define permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_clients',
    'view_system_overview',
    'view_voice_logs',
    'export_data',
    'manage_settings',
    'view_reports',
    'view_analytics'
  ],
  gestor: [
    'view_dashboard',
    'manage_inspections',
    'view_reports',
    'generate_reports',
    'manage_team',
    'invite_members',
    'manage_templates',
    'view_analytics',
    'manage_billing',
    'view_team_inspections',
    'use_voice_assistant',
    'upload_files',
    'export_data',
    'manage_settings'
  ],
  inspetor: [
    'view_dashboard',
    'execute_inspections',
    'view_reports',
    'generate_reports',
    'upload_files',
    'manage_settings'
  ]
};

// Define plan-specific restrictions
const planRestrictions: Record<Plan, {
  maxStorageGB: number;
  maxTeamMembers: number;
  maxTemplates: number;
  hasVoiceAssistant: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomBranding: boolean;
  hasPrioritySupport: boolean;
  maxInspectionsPerMonth: number;
}> = {
  iniciante: {
    maxStorageGB: 5,
    maxTeamMembers: 3,
    maxTemplates: 5,
    hasVoiceAssistant: false,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    hasPrioritySupport: false,
    maxInspectionsPerMonth: 50
  },
  profissional: {
    maxStorageGB: 50,
    maxTeamMembers: 15,
    maxTemplates: 50,
    hasVoiceAssistant: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: false,
    hasPrioritySupport: true,
    maxInspectionsPerMonth: 500
  },
  enterprise: {
    maxStorageGB: -1, // unlimited
    maxTeamMembers: -1, // unlimited
    maxTemplates: -1, // unlimited
    hasVoiceAssistant: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: true,
    hasPrioritySupport: true,
    maxInspectionsPerMonth: -1 // unlimited
  }
};

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) return [];
    return rolePermissions[user.role] || [];
  }, [user]);

  const planLimits = useMemo(() => {
    if (!user) return planRestrictions.iniciante;
    return planRestrictions[user.plano];
  }, [user]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: Permission[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: Permission[]): boolean => {
    return permissionList.every(permission => hasPermission(permission));
  };

  const canUseFeature = (feature: keyof typeof planLimits): boolean => {
    if (!user) return false;
    
    switch (feature) {
      case 'hasVoiceAssistant':
        return planLimits.hasVoiceAssistant && hasPermission('use_voice_assistant');
      case 'hasAdvancedAnalytics':
        return planLimits.hasAdvancedAnalytics && hasPermission('view_analytics');
      default:
        return planLimits[feature] as boolean;
    }
  };

  const isWithinLimit = (
    limitType: 'maxStorageGB' | 'maxTeamMembers' | 'maxTemplates' | 'maxInspectionsPerMonth',
    currentValue: number
  ): boolean => {
    const limit = planLimits[limitType];
    return limit === -1 || currentValue < limit;
  };

  const getRemainingQuota = (
    limitType: 'maxStorageGB' | 'maxTeamMembers' | 'maxTemplates' | 'maxInspectionsPerMonth',
    currentValue: number
  ): number | null => {
    const limit = planLimits[limitType];
    if (limit === -1) return null; // unlimited
    return Math.max(0, limit - currentValue);
  };

  const getUsagePercentage = (
    limitType: 'maxStorageGB' | 'maxTeamMembers' | 'maxTemplates' | 'maxInspectionsPerMonth',
    currentValue: number
  ): number => {
    const limit = planLimits[limitType];
    if (limit === -1) return 0; // unlimited
    return Math.min(100, (currentValue / limit) * 100);
  };

  const canPerformAction = (action: string, context?: any): boolean => {
    // Custom business logic for specific actions
    switch (action) {
      case 'create_inspection':
        return hasPermission('manage_inspections') || hasPermission('execute_inspections');
      
      case 'invite_team_member':
        return hasPermission('invite_members') && 
               (context?.currentTeamSize ? isWithinLimit('maxTeamMembers', context.currentTeamSize) : true);
      
      case 'create_template':
        return hasPermission('manage_templates') && 
               (context?.currentTemplates ? isWithinLimit('maxTemplates', context.currentTemplates) : true);
      
      case 'use_voice_assistant':
        return canUseFeature('hasVoiceAssistant');
      
      case 'upload_file':
        return hasPermission('upload_files') && 
               (context?.currentStorageGB ? isWithinLimit('maxStorageGB', context.currentStorageGB) : true);
      
      default:
        return false;
    }
  };

  const getUpgradeMessage = (feature: string): string | null => {
    if (!user) return null;

    const upgradeMessages: Record<string, Record<Plan, string | null>> = {
      voice_assistant: {
        iniciante: 'Upgrade para o plano Profissional para usar o assistente de voz',
        profissional: null,
        enterprise: null
      },
      advanced_analytics: {
        iniciante: 'Upgrade para o plano Profissional para acessar análises avançadas',
        profissional: null,
        enterprise: null
      },
      custom_branding: {
        iniciante: 'Upgrade para o plano Enterprise para personalização de marca',
        profissional: 'Upgrade para o plano Enterprise para personalização de marca',
        enterprise: null
      }
    };

    return upgradeMessages[feature]?.[user.plano] || null;
  };

  return {
    permissions,
    planLimits,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canUseFeature,
    isWithinLimit,
    getRemainingQuota,
    getUsagePercentage,
    canPerformAction,
    getUpgradeMessage,
    user,
    role: user?.role,
    plan: user?.plano
  };
};

// Hook for checking specific permissions in components
export const useRequirePermission = (permission: Permission) => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};

// Hook for checking plan features
export const useRequireFeature = (feature: keyof typeof planRestrictions.iniciante) => {
  const { canUseFeature } = usePermissions();
  return canUseFeature(feature);
};
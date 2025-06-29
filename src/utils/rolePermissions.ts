import { Permission, Role } from '@/hooks/usePermissions';

// Define comprehensive role-based permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
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

// Define route permissions
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard': ['view_dashboard'],
  '/inspections': ['execute_inspections'],
  '/inspections/:id/execute': ['execute_inspections'],
  '/team': ['manage_team'],
  '/team-inspections': ['view_team_inspections'],
  '/templates': ['manage_templates'],
  '/analytics': ['view_analytics'],
  '/billing': ['manage_billing'],
  '/admin/clients': ['manage_clients'],
  '/admin/system': ['view_system_overview'],
  '/admin/voice-logs': ['view_voice_logs'],
  '/settings': ['manage_settings']
};

// Define component permissions
export const COMPONENT_PERMISSIONS = {
  VoiceAssistant: ['use_voice_assistant'],
  FileUpload: ['upload_files'],
  TeamInvite: ['invite_members'],
  TemplateEditor: ['manage_templates'],
  AnalyticsDashboard: ['view_analytics'],
  BillingPanel: ['manage_billing'],
  ClientManagement: ['manage_clients'],
  SystemMetrics: ['view_system_overview'],
  VoiceLogs: ['view_voice_logs'],
  DataExport: ['export_data']
} as const;

// Helper functions for permission checking
export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const canAccessRoute = (userRole: Role, route: string): boolean => {
  const requiredPermissions = ROUTE_PERMISSIONS[route];
  if (!requiredPermissions) return true; // No specific permissions required
  
  return hasAnyPermission(userRole, requiredPermissions);
};

export const canUseComponent = (userRole: Role, componentName: keyof typeof COMPONENT_PERMISSIONS): boolean => {
  const requiredPermissions = COMPONENT_PERMISSIONS[componentName];
  if (!requiredPermissions) return true;
  
  return hasAnyPermission(userRole, requiredPermissions);
};

// Role hierarchy for inheritance (higher roles inherit lower role permissions)
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  admin: ['admin', 'gestor', 'inspetor'],
  gestor: ['gestor', 'inspetor'],
  inspetor: ['inspetor']
};

export const hasRoleOrHigher = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole]?.includes(requiredRole) || false;
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  inspection: ['execute_inspections', 'manage_inspections', 'view_reports', 'generate_reports'],
  team: ['manage_team', 'invite_members', 'view_team_inspections'],
  admin: ['manage_clients', 'view_system_overview', 'view_voice_logs'],
  content: ['manage_templates', 'upload_files'],
  analytics: ['view_analytics', 'export_data'],
  billing: ['manage_billing'],
  voice: ['use_voice_assistant'],
  settings: ['manage_settings']
} as const;

export const hasPermissionGroup = (userRole: Role, group: keyof typeof PERMISSION_GROUPS): boolean => {
  const groupPermissions = PERMISSION_GROUPS[group];
  return hasAnyPermission(userRole, groupPermissions);
};

// Context-aware permissions (permissions that depend on additional context)
export interface PermissionContext {
  ownerId?: string;
  teamId?: string;
  clientId?: string;
  inspectionId?: string;
  templateId?: string;
}

export const hasContextualPermission = (
  userRole: Role,
  permission: Permission,
  context: PermissionContext,
  userId: string
): boolean => {
  // Base permission check
  if (!hasPermission(userRole, permission)) {
    return false;
  }

  // Additional context-based checks
  switch (permission) {
    case 'execute_inspections':
      // Inspectors can only execute their own inspections or team inspections
      if (userRole === 'inspetor') {
        return context.ownerId === userId || context.teamId !== undefined;
      }
      return true;

    case 'manage_inspections':
      // Gestors can manage inspections in their team/client
      if (userRole === 'gestor') {
        return context.teamId !== undefined || context.clientId !== undefined;
      }
      return true;

    case 'manage_templates':
      // Users can manage their own templates or team templates
      return context.ownerId === userId || context.teamId !== undefined;

    case 'view_reports':
      // Users can view reports they have access to
      if (userRole === 'inspetor') {
        return context.ownerId === userId || context.teamId !== undefined;
      }
      return true;

    default:
      return true;
  }
};

// Feature flags based on roles
export const ROLE_FEATURES = {
  admin: {
    canManageAllClients: true,
    canViewSystemMetrics: true,
    canAccessVoiceLogs: true,
    canExportAllData: true,
    hasUnlimitedAccess: true
  },
  gestor: {
    canManageTeam: true,
    canCreateTemplates: true,
    canViewAnalytics: true,
    canManageBilling: true,
    canUseVoiceAssistant: true,
    canInviteMembers: true
  },
  inspetor: {
    canExecuteInspections: true,
    canGenerateReports: true,
    canUploadFiles: true,
    canUseBasicFeatures: true
  }
} as const;

export const hasFeature = (userRole: Role, feature: string): boolean => {
  const roleFeatures = ROLE_FEATURES[userRole] as Record<string, boolean>;
  return roleFeatures?.[feature] || false;
};
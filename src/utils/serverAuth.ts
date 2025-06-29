import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types/auth';
import { logger } from '@/utils/logger';

// Interface for permission context
export interface AuthContext {
  userId?: string;
  userRole?: UserRole;
  teamId?: string;
  clientId?: string;
  resourceId?: string;
  resourceType?: 'inspection' | 'test' | 'template' | 'team' | 'client' | 'user';
}

// Error class for authorization failures
export class AuthorizationError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
  }
}

/**
 * Verify if the current session is valid
 * @returns The current user if session is valid
 * @throws AuthorizationError if session is invalid
 */
export const verifySession = async (): Promise<User> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new AuthorizationError('Unauthorized: No valid session', 401);
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new AuthorizationError('Unauthorized: User not found', 401);
  }
  
  // Get user role and metadata from the database
  const { data: userData, error } = await supabase
    .from('users')
    .select('role, equipe_id, cliente_id')
    .eq('id', user.id)
    .single();
  
  if (error || !userData) {
    logger.error('Error fetching user data:', error);
    throw new AuthorizationError('Unauthorized: User data not found', 401);
  }
  
  return {
    id: user.id,
    email: user.email || '',
    nome: user.user_metadata?.full_name || '',
    role: userData.role as UserRole,
    plano: user.user_metadata?.plano || 'iniciante',
    equipe_id: userData.equipe_id,
    cliente_id: userData.cliente_id,
    created_at: user.created_at || '',
    user_metadata: user.user_metadata
  };
}

/**
 * Check if user has the required role
 * @param userRole Current user role
 * @param requiredRole Required role
 * @returns True if user has required role or higher
 */
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    'admin': 3,
    'gestor': 2,
    'inspetor': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Check if user has permission to access a resource
 * @param context Authorization context
 * @param requiredPermission Required permission
 * @returns True if user has permission
 * @throws AuthorizationError if user doesn't have permission
 */
export const checkPermission = async (
  context: AuthContext,
  requiredPermission: string
): Promise<boolean> => {
  // If no user ID is provided, verify the current session
  if (!context.userId) {
    const user = await verifySession();
    context.userId = user.id;
    context.userRole = user.role;
    context.teamId = user.equipe_id;
    context.clientId = user.cliente_id;
  }
  
  // Admin has all permissions
  if (context.userRole === 'admin') {
    return true;
  }
  
  // Check specific permissions based on resource type
  switch (requiredPermission) {
    case 'view_inspection':
      return await canViewInspection(context);
    case 'edit_inspection':
      return await canEditInspection(context);
    case 'manage_team':
      return await canManageTeam(context);
    case 'view_template':
      return await canViewTemplate(context);
    case 'edit_template':
      return await canEditTemplate(context);
    default:
      // For other permissions, check role-based permissions
      return await hasRolePermission(context.userRole!, requiredPermission);
  }
};

/**
 * Check if user has permission based on role
 * @param userRole User role
 * @param permission Required permission
 * @returns True if user has permission
 */
const hasRolePermission = async (
  userRole: UserRole,
  permission: string
): Promise<boolean> => {
  // Get role permissions from database
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permissions')
    .eq('role', userRole)
    .single();
  
  if (error || !data) {
    logger.error('Error fetching role permissions:', error);
    return false;
  }
  
  return data.permissions.includes(permission);
};

/**
 * Check if user can view an inspection
 * @param context Authorization context
 * @returns True if user can view the inspection
 */
const canViewInspection = async (context: AuthContext): Promise<boolean> => {
  if (!context.resourceId) {
    return false;
  }
  
  // Gestor can view all inspections in their team/client
  if (context.userRole === 'gestor') {
    if (context.teamId) {
      const { data, error } = await supabase
        .from('inspections')
        .select('team_id')
        .eq('id', context.resourceId)
        .single();
      
      if (error || !data) {
        return false;
      }
      
      return data.team_id === context.teamId;
    }
    
    if (context.clientId) {
      const { data, error } = await supabase
        .from('inspections')
        .select('client_id')
        .eq('id', context.resourceId)
        .single();
      
      if (error || !data) {
        return false;
      }
      
      return data.client_id === context.clientId;
    }
  }
  
  // Inspetor can only view their own inspections
  if (context.userRole === 'inspetor') {
    const { data, error } = await supabase
      .from('inspections')
      .select('user_id')
      .eq('id', context.resourceId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.user_id === context.userId;
  }
  
  return false;
};

/**
 * Check if user can edit an inspection
 * @param context Authorization context
 * @returns True if user can edit the inspection
 */
const canEditInspection = async (context: AuthContext): Promise<boolean> => {
  // Editing has stricter permissions than viewing
  if (context.userRole === 'inspetor') {
    // Inspetor can only edit their own inspections
    const { data, error } = await supabase
      .from('inspections')
      .select('user_id, status')
      .eq('id', context.resourceId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    // Can only edit if they own it and it's not completed
    return data.user_id === context.userId && data.status !== 'completed';
  }
  
  // For gestor, reuse the view permission logic but add status check
  if (context.userRole === 'gestor') {
    const canView = await canViewInspection(context);
    
    if (canView) {
      const { data, error } = await supabase
        .from('inspections')
        .select('status')
        .eq('id', context.resourceId)
        .single();
      
      if (error || !data) {
        return false;
      }
      
      // Gestor can edit if inspection is not completed
      return data.status !== 'completed';
    }
  }
  
  return false;
};

/**
 * Check if user can manage a team
 * @param context Authorization context
 * @returns True if user can manage the team
 */
const canManageTeam = async (context: AuthContext): Promise<boolean> => {
  if (!context.resourceId) {
    return false;
  }
  
  // Only gestor and admin can manage teams
  if (context.userRole === 'inspetor') {
    return false;
  }
  
  if (context.userRole === 'gestor') {
    // Gestor can only manage their own team
    return context.teamId === context.resourceId;
  }
  
  return true; // Admin can manage any team
};

/**
 * Check if user can view a template
 * @param context Authorization context
 * @returns True if user can view the template
 */
const canViewTemplate = async (context: AuthContext): Promise<boolean> => {
  if (!context.resourceId) {
    return false;
  }
  
  // Get template details
  const { data, error } = await supabase
    .from('templates')
    .select('user_id, team_id, is_public')
    .eq('id', context.resourceId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  // Public templates can be viewed by anyone
  if (data.is_public) {
    return true;
  }
  
  // User can view their own templates
  if (data.user_id === context.userId) {
    return true;
  }
  
  // User can view team templates
  if (data.team_id && data.team_id === context.teamId) {
    return true;
  }
  
  return false;
};

/**
 * Check if user can edit a template
 * @param context Authorization context
 * @returns True if user can edit the template
 */
const canEditTemplate = async (context: AuthContext): Promise<boolean> => {
  if (!context.resourceId) {
    return false;
  }
  
  // Get template details
  const { data, error } = await supabase
    .from('templates')
    .select('user_id, team_id')
    .eq('id', context.resourceId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  // User can edit their own templates
  if (data.user_id === context.userId) {
    return true;
  }
  
  // Gestor can edit team templates
  if (context.userRole === 'gestor' && data.team_id && data.team_id === context.teamId) {
    return true;
  }
  
  // Admin can edit any template
  return context.userRole === 'admin';
};

/**
 * Middleware to verify permissions before executing a service function
 * @param handler The service function to wrap
 * @param permission Required permission
 * @param getContext Function to extract context from parameters
 * @returns Wrapped function with permission check
 */
export const withPermission = <T extends (...args: any[]) => Promise<any>>(
  handler: T,
  permission: string,
  getContext: (...args: Parameters<T>) => AuthContext
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const context = getContext(...args);
    
    // Verify permission
    const hasPermission = await checkPermission(context, permission);
    
    if (!hasPermission) {
      throw new AuthorizationError(`Unauthorized: Missing permission '${permission}'`);
    }
    
    // Execute the original handler
    return handler(...args);
  };
};

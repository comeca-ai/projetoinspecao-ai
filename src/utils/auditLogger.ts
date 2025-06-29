import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Severity levels for audit logs
 */
export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Categories of operations for audit logs
 */
export enum AuditCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  CONFIGURATION = 'configuration',
  SYSTEM = 'system',
  USER_MANAGEMENT = 'user_management',
  BILLING = 'billing'
}

/**
 * Interface for audit log entry
 */
export interface AuditLogEntry {
  user_id: string | null;
  action: string;
  category: AuditCategory;
  severity: AuditSeverity;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure';
  error_message?: string;
}

/**
 * Creates an audit log entry in the database
 * @param entry - Audit log entry details
 * @returns Promise resolving to the created entry ID
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<string> {
  try {
    // Add timestamp
    const logEntry = {
      ...entry,
      created_at: new Date().toISOString()
    };

    // Insert into audit_logs table
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(logEntry)
      .select('id')
      .single();

    if (error) {
      // Log to application logs if database insertion fails
      logger.error('Failed to create audit log:', error);
      logger.error('Audit log entry:', logEntry);
      return 'failed-to-create';
    }

    return data.id;
  } catch (error) {
    // Catch any unexpected errors
    logger.error('Unexpected error creating audit log:', error);
    return 'error-creating-log';
  }
}

/**
 * Higher-order function to wrap operations with audit logging
 * @param operation - Function to execute and audit
 * @param auditInfo - Audit information
 * @returns Function that executes operation with audit logging
 */
export function withAuditLog<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  auditInfo: {
    action: string;
    category: AuditCategory;
    severity: AuditSeverity;
    resourceType: string;
    getResourceId?: (args: Parameters<T>) => string | undefined;
    getDetails?: (args: Parameters<T>, result?: any) => Record<string, any> | undefined;
  }
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Extract user ID from context if available
    const userId = args[0]?.user?.id || args[0]?.userId || args[0]?.context?.user?.id || null;
    
    // Extract request info if available
    const req = args[0]?.req || args[0]?.request || args[0]?.context?.req;
    const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || null;
    const userAgent = req?.headers?.['user-agent'] || null;
    
    // Prepare audit log entry
    const auditEntry: AuditLogEntry = {
      user_id: userId,
      action: auditInfo.action,
      category: auditInfo.category,
      severity: auditInfo.severity,
      resource_type: auditInfo.resourceType,
      status: 'success',
      ip_address: ipAddress,
      user_agent: userAgent
    };
    
    // Add resource ID if available
    if (auditInfo.getResourceId) {
      auditEntry.resource_id = auditInfo.getResourceId(args);
    }
    
    try {
      // Execute the operation
      const result = await operation(...args);
      
      // Add details if available
      if (auditInfo.getDetails) {
        auditEntry.details = auditInfo.getDetails(args, result);
      }
      
      // Create success audit log
      await createAuditLog(auditEntry);
      
      return result;
    } catch (error: any) {
      // Update audit entry for failure
      auditEntry.status = 'failure';
      auditEntry.error_message = error.message || 'Unknown error';
      auditEntry.severity = AuditSeverity.ERROR; // Increase severity on failure
      
      // Create failure audit log
      await createAuditLog(auditEntry);
      
      // Re-throw the error
      throw error;
    }
  };
}

/**
 * Creates an audit log for authentication events
 * @param userId - User ID
 * @param action - Authentication action
 * @param status - Success or failure
 * @param details - Additional details
 * @param errorMessage - Error message if failure
 * @param request - Request object for IP and user agent
 */
export async function logAuthEvent(
  userId: string | null,
  action: 'login' | 'logout' | 'signup' | 'password_reset' | 'password_change' | 'mfa_enabled' | 'mfa_disabled',
  status: 'success' | 'failure',
  details?: Record<string, any>,
  errorMessage?: string,
  request?: { ip?: string; headers?: Record<string, string> }
): Promise<void> {
  const auditEntry: AuditLogEntry = {
    user_id: userId,
    action,
    category: AuditCategory.AUTHENTICATION,
    severity: status === 'success' ? AuditSeverity.INFO : AuditSeverity.WARNING,
    resource_type: 'user',
    resource_id: userId || undefined,
    details,
    status,
    error_message: errorMessage,
    ip_address: request?.ip || request?.headers?.['x-forwarded-for'],
    user_agent: request?.headers?.['user-agent']
  };
  
  await createAuditLog(auditEntry);
}

/**
 * Creates an audit log for data access events
 * @param userId - User ID
 * @param resourceType - Type of resource accessed
 * @param resourceId - ID of resource accessed
 * @param action - Access action
 * @param status - Success or failure
 * @param details - Additional details
 * @param errorMessage - Error message if failure
 */
export async function logDataAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: 'read' | 'list' | 'export',
  status: 'success' | 'failure',
  details?: Record<string, any>,
  errorMessage?: string
): Promise<void> {
  const auditEntry: AuditLogEntry = {
    user_id: userId,
    action: `${action}_${resourceType}`,
    category: AuditCategory.DATA_ACCESS,
    severity: status === 'success' ? AuditSeverity.INFO : AuditSeverity.WARNING,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    status,
    error_message: errorMessage
  };
  
  await createAuditLog(auditEntry);
}

/**
 * Creates an audit log for data modification events
 * @param userId - User ID
 * @param resourceType - Type of resource modified
 * @param resourceId - ID of resource modified
 * @param action - Modification action
 * @param status - Success or failure
 * @param details - Additional details
 * @param errorMessage - Error message if failure
 */
export async function logDataModification(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: 'create' | 'update' | 'delete',
  status: 'success' | 'failure',
  details?: Record<string, any>,
  errorMessage?: string
): Promise<void> {
  const auditEntry: AuditLogEntry = {
    user_id: userId,
    action: `${action}_${resourceType}`,
    category: AuditCategory.DATA_MODIFICATION,
    severity: status === 'success' ? AuditSeverity.INFO : AuditSeverity.WARNING,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    status,
    error_message: errorMessage
  };
  
  await createAuditLog(auditEntry);
}

/**
 * Creates an audit log for sensitive configuration changes
 * @param userId - User ID
 * @param configType - Type of configuration
 * @param action - Configuration action
 * @param status - Success or failure
 * @param details - Additional details
 * @param errorMessage - Error message if failure
 */
export async function logConfigChange(
  userId: string,
  configType: string,
  action: 'update' | 'enable' | 'disable',
  status: 'success' | 'failure',
  details?: Record<string, any>,
  errorMessage?: string
): Promise<void> {
  const auditEntry: AuditLogEntry = {
    user_id: userId,
    action: `${action}_${configType}`,
    category: AuditCategory.CONFIGURATION,
    severity: AuditSeverity.WARNING, // Configuration changes are always at least WARNING level
    resource_type: 'configuration',
    details,
    status,
    error_message: errorMessage
  };
  
  await createAuditLog(auditEntry);
}

/**
 * Creates an audit log for user management events
 * @param adminUserId - Admin user ID performing the action
 * @param targetUserId - Target user ID being acted upon
 * @param action - User management action
 * @param status - Success or failure
 * @param details - Additional details
 * @param errorMessage - Error message if failure
 */
export async function logUserManagement(
  adminUserId: string,
  targetUserId: string,
  action: 'create' | 'update' | 'delete' | 'suspend' | 'activate' | 'change_role',
  status: 'success' | 'failure',
  details?: Record<string, any>,
  errorMessage?: string
): Promise<void> {
  const auditEntry: AuditLogEntry = {
    user_id: adminUserId,
    action: `${action}_user`,
    category: AuditCategory.USER_MANAGEMENT,
    severity: AuditSeverity.WARNING,
    resource_type: 'user',
    resource_id: targetUserId,
    details,
    status,
    error_message: errorMessage
  };
  
  await createAuditLog(auditEntry);
}

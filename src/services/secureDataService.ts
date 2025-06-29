import { createClient } from '@supabase/supabase-js';
import { safeEncrypt, safeDecrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { withPermission } from '@/utils/serverAuth';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define sensitive fields that should be encrypted
const SENSITIVE_FIELDS = {
  clients: ['tax_id', 'contact_details', 'payment_info'],
  users: ['phone', 'emergency_contact', 'address'],
  inspections: ['client_notes', 'security_codes', 'access_details'],
  teams: ['private_notes']
};

/**
 * Type for tables with sensitive data
 */
type TableWithSensitiveData = keyof typeof SENSITIVE_FIELDS;

/**
 * Interface for data with ID
 */
interface DataWithId {
  id: string;
  [key: string]: any;
}

/**
 * Encrypts sensitive fields in an object based on table configuration
 * @param data - Object containing data to encrypt
 * @param table - Table name to determine which fields to encrypt
 * @returns Object with sensitive fields encrypted
 */
function encryptSensitiveData<T extends object>(data: T, table: TableWithSensitiveData): T {
  const sensitiveFields = SENSITIVE_FIELDS[table];
  if (!sensitiveFields || !sensitiveFields.length) return data;

  const result = { ...data };
  
  for (const field of sensitiveFields) {
    if (field in result && result[field as keyof T] !== null && result[field as keyof T] !== undefined) {
      try {
        // Only encrypt string values
        if (typeof result[field as keyof T] === 'string') {
          (result as any)[field] = safeEncrypt(result[field as keyof T] as string);
        }
      } catch (error) {
        logger.error(`Error encrypting field ${field}:`, error);
      }
    }
  }
  
  return result;
}

/**
 * Decrypts sensitive fields in an object based on table configuration
 * @param data - Object containing data to decrypt
 * @param table - Table name to determine which fields to decrypt
 * @returns Object with sensitive fields decrypted
 */
function decryptSensitiveData<T extends object>(data: T, table: TableWithSensitiveData): T {
  const sensitiveFields = SENSITIVE_FIELDS[table];
  if (!sensitiveFields || !sensitiveFields.length) return data;

  const result = { ...data };
  
  for (const field of sensitiveFields) {
    if (field in result && result[field as keyof T] !== null && result[field as keyof T] !== undefined) {
      try {
        // Only decrypt string values
        if (typeof result[field as keyof T] === 'string') {
          (result as any)[field] = safeDecrypt(result[field as keyof T] as string);
        }
      } catch (error) {
        logger.error(`Error decrypting field ${field}:`, error);
      }
    }
  }
  
  return result;
}

/**
 * Decrypts sensitive fields in an array of objects
 * @param dataArray - Array of objects to decrypt
 * @param table - Table name to determine which fields to decrypt
 * @returns Array of objects with sensitive fields decrypted
 */
function decryptSensitiveDataArray<T extends object>(dataArray: T[], table: TableWithSensitiveData): T[] {
  return dataArray.map(item => decryptSensitiveData(item, table));
}

/**
 * Securely stores data with sensitive fields encrypted
 * @param table - Table name
 * @param data - Data to store
 * @returns Stored data with ID
 */
export const secureStore = withPermission(
  async <T extends object>(table: TableWithSensitiveData, data: T): Promise<T & { id: string }> => {
    // Encrypt sensitive fields
    const encryptedData = encryptSensitiveData(data, table);
    
    // Store in database
    const { data: storedData, error } = await supabase
      .from(table)
      .insert(encryptedData)
      .select()
      .single();
    
    if (error) {
      logger.error(`Error storing data in ${table}:`, error);
      throw new Error(`Failed to store data: ${error.message}`);
    }
    
    // Return decrypted data
    return decryptSensitiveData(storedData, table);
  },
  { resourceType: 'data', action: 'create' }
);

/**
 * Securely retrieves data with sensitive fields decrypted
 * @param table - Table name
 * @param id - ID of record to retrieve
 * @returns Retrieved data with sensitive fields decrypted
 */
export const secureGet = withPermission(
  async <T extends DataWithId>(table: TableWithSensitiveData, id: string): Promise<T> => {
    // Retrieve from database
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      logger.error(`Error retrieving data from ${table}:`, error);
      throw new Error(`Failed to retrieve data: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Record not found in ${table} with id ${id}`);
    }
    
    // Decrypt sensitive fields
    return decryptSensitiveData(data as T, table);
  },
  { resourceType: 'data', action: 'read' }
);

/**
 * Securely retrieves multiple records with sensitive fields decrypted
 * @param table - Table name
 * @param query - Query parameters
 * @returns Array of retrieved data with sensitive fields decrypted
 */
export const secureList = withPermission(
  async <T extends DataWithId>(
    table: TableWithSensitiveData,
    query?: { [key: string]: any }
  ): Promise<T[]> => {
    // Start query
    let queryBuilder = supabase.from(table).select('*');
    
    // Add filters if provided
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }
    
    // Execute query
    const { data, error } = await queryBuilder;
    
    if (error) {
      logger.error(`Error listing data from ${table}:`, error);
      throw new Error(`Failed to list data: ${error.message}`);
    }
    
    // Decrypt sensitive fields in all records
    return decryptSensitiveDataArray(data as T[], table);
  },
  { resourceType: 'data', action: 'list' }
);

/**
 * Securely updates data with sensitive fields encrypted
 * @param table - Table name
 * @param id - ID of record to update
 * @param data - Data to update
 * @returns Updated data with sensitive fields decrypted
 */
export const secureUpdate = withPermission(
  async <T extends object>(
    table: TableWithSensitiveData,
    id: string,
    data: Partial<T>
  ): Promise<T & { id: string }> => {
    // Encrypt sensitive fields
    const encryptedData = encryptSensitiveData(data, table);
    
    // Update in database
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(encryptedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      logger.error(`Error updating data in ${table}:`, error);
      throw new Error(`Failed to update data: ${error.message}`);
    }
    
    // Return decrypted data
    return decryptSensitiveData(updatedData, table);
  },
  { resourceType: 'data', action: 'update' }
);

/**
 * Securely deletes data
 * @param table - Table name
 * @param id - ID of record to delete
 * @returns Success status
 */
export const secureDelete = withPermission(
  async (table: TableWithSensitiveData, id: string): Promise<boolean> => {
    // Delete from database
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      logger.error(`Error deleting data from ${table}:`, error);
      throw new Error(`Failed to delete data: ${error.message}`);
    }
    
    return true;
  },
  { resourceType: 'data', action: 'delete' }
);

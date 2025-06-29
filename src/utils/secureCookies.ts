/**
 * Secure cookie utilities for frontend security
 * Implements secure cookie handling with proper flags and security measures
 */

// Cookie options interface
interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
}

// Default secure cookie options
const defaultSecureOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Set a secure cookie with proper flags
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
export const setSecureCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  // Merge default options with provided options
  const cookieOptions = { ...defaultSecureOptions, ...options };
  
  // Build cookie string
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  // Add expiration
  if (cookieOptions.expires) {
    cookie += `; expires=${cookieOptions.expires.toUTCString()}`;
  } else if (cookieOptions.maxAge) {
    cookie += `; max-age=${cookieOptions.maxAge}`;
  }
  
  // Add path
  if (cookieOptions.path) {
    cookie += `; path=${cookieOptions.path}`;
  }
  
  // Add domain
  if (cookieOptions.domain) {
    cookie += `; domain=${cookieOptions.domain}`;
  }
  
  // Add security flags
  if (cookieOptions.httpOnly) {
    cookie += '; HttpOnly';
  }
  
  if (cookieOptions.secure) {
    cookie += '; Secure';
  }
  
  if (cookieOptions.sameSite) {
    cookie += `; SameSite=${cookieOptions.sameSite}`;
  }
  
  // Set the cookie
  document.cookie = cookie;
};

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getSecureCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    
    // Check if this cookie starts with the name we want
    if (cookie.startsWith(`${encodeURIComponent(name)}=`)) {
      // Return the cookie value
      return decodeURIComponent(
        cookie.substring(name.length + 1, cookie.length)
      );
    }
  }
  
  return null;
};

/**
 * Delete a cookie by setting its expiration to the past
 * @param name Cookie name
 * @param options Cookie options
 */
export const deleteSecureCookie = (
  name: string,
  options: CookieOptions = {}
): void => {
  // Set expiration to the past to delete the cookie
  const deleteOptions: CookieOptions = {
    ...options,
    expires: new Date(0),
    maxAge: undefined,
  };
  
  setSecureCookie(name, '', deleteOptions);
};

/**
 * Set a session cookie that expires when the browser is closed
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
export const setSessionCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  // Session cookies don't have max-age or expires
  const sessionOptions: CookieOptions = {
    ...options,
    maxAge: undefined,
    expires: undefined,
  };
  
  setSecureCookie(name, value, sessionOptions);
};

/**
 * Set a secure cookie with encryption
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
export const setEncryptedCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  // In a real implementation, this would encrypt the value
  // For now, we'll just encode it with base64 as a placeholder
  const encodedValue = btoa(value);
  setSecureCookie(name, encodedValue, options);
};

/**
 * Get a secure cookie and decrypt its value
 * @param name Cookie name
 * @returns Decrypted cookie value or null if not found
 */
export const getEncryptedCookie = (name: string): string | null => {
  const encodedValue = getSecureCookie(name);
  
  if (!encodedValue) {
    return null;
  }
  
  // In a real implementation, this would decrypt the value
  // For now, we'll just decode it from base64 as a placeholder
  try {
    return atob(encodedValue);
  } catch (error) {
    console.error('Error decoding cookie:', error);
    return null;
  }
};

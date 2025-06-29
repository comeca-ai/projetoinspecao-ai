/**
 * Security headers utility for frontend security
 * Implements Content Security Policy (CSP) and other security headers
 */

// Interface for security headers
export interface SecurityHeaders {
  [key: string]: string;
}

/**
 * Generate Content Security Policy (CSP) header
 * @param additionalDirectives Additional CSP directives to include
 * @returns CSP header value
 */
export const generateCSP = (additionalDirectives: Record<string, string[]> = {}): string => {
  // Default CSP directives
  const defaultDirectives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'connect-src': ["'self'", "https://*.supabase.co"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };

  // Merge default directives with additional directives
  const mergedDirectives: Record<string, string[]> = { ...defaultDirectives };
  
  Object.entries(additionalDirectives).forEach(([directive, sources]) => {
    if (mergedDirectives[directive]) {
      mergedDirectives[directive] = [...mergedDirectives[directive], ...sources];
    } else {
      mergedDirectives[directive] = sources;
    }
  });

  // Build CSP string
  return Object.entries(mergedDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

/**
 * Get recommended security headers for the application
 * @param enableCSP Whether to enable Content Security Policy
 * @returns Object containing security headers
 */
export const getSecurityHeaders = (enableCSP = true): SecurityHeaders => {
  const headers: SecurityHeaders = {
    // Prevent browsers from incorrectly detecting non-scripts as scripts
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Only allow HTTPS connections
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Control browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // Prevent MIME type sniffing
    'X-Download-Options': 'noopen',
    
    // Disable DNS prefetching
    'X-DNS-Prefetch-Control': 'off',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Cache control
    'Cache-Control': 'no-store, max-age=0',
  };

  // Add Content Security Policy if enabled
  if (enableCSP) {
    headers['Content-Security-Policy'] = generateCSP();
  }

  return headers;
};

/**
 * Apply security headers to a Response object
 * @param response Response object
 * @param headers Security headers to apply
 * @returns Response with security headers
 */
export const applySecurityHeaders = (
  response: Response,
  headers: SecurityHeaders = getSecurityHeaders()
): Response => {
  const newHeaders = new Headers(response.headers);
  
  // Apply each security header
  Object.entries(headers).forEach(([name, value]) => {
    newHeaders.set(name, value);
  });
  
  // Create a new response with the updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

/**
 * Apply security headers to a document (client-side)
 * This should be called in the app's entry point
 */
export const applyClientSecurityHeaders = (): void => {
  // Set meta tags for security
  const metaTags = [
    { name: 'referrer', content: 'strict-origin-when-cross-origin' },
    { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
    { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
    { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
  ];
  
  // Add meta tags to document head
  metaTags.forEach(attributes => {
    const meta = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
  });
  
  // Add CSP meta tag if not already set by server
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', generateCSP());
    document.head.appendChild(cspMeta);
  }
};

/**
 * Create a middleware function for Next.js API routes to add security headers
 * @param handler API route handler
 * @returns Handler with security headers
 */
export const withSecurityHeaders = (handler: any) => {
  return async (req: Request, ...args: any[]) => {
    // Call the original handler
    const response = await handler(req, ...args);
    
    // Apply security headers
    return applySecurityHeaders(response);
  };
};

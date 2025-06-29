import { getSecurityHeaders } from './utils/securityHeaders';

/**
 * Security middleware for React application
 * This file provides functions to apply security headers to fetch requests
 * and API responses in a React application without Next.js
 */

/**
 * Apply security headers to a fetch request
 * @param request Request object or URL
 * @param init Request init options
 * @returns Modified request init with security headers
 */
export const applySecurityHeadersToRequest = (
  request: RequestInfo,
  init?: RequestInit
): RequestInit => {
  const securityHeaders = getSecurityHeaders();
  const headers = new Headers(init?.headers);
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([name, value]) => {
    headers.set(name, value);
  });
  
  return {
    ...init,
    headers,
  };
};

/**
 * Wrapper for fetch that applies security headers
 * @param url URL to fetch
 * @param init Request init options
 * @returns Promise with fetch response
 */
export const secureFetch = (
  url: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const secureInit = applySecurityHeadersToRequest(url, init);
  return fetch(url, secureInit);
};

/**
 * Apply security headers to a Response object
 * @param response Response object
 * @returns New response with security headers
 */
export const applySecurityHeadersToResponse = (response: Response): Response => {
  const securityHeaders = getSecurityHeaders();
  const headers = new Headers(response.headers);
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([name, value]) => {
    headers.set(name, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

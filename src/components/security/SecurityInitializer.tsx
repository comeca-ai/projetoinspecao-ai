import { useEffect } from 'react';
import { applyClientSecurityHeaders } from '@/utils/securityHeaders';

/**
 * Component that initializes security features when the app loads
 * - Applies client-side security headers
 * - Sets up security event listeners
 * - Configures secure defaults
 */
const SecurityInitializer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Apply security headers via meta tags
    applyClientSecurityHeaders();
    
    // Prevent drag and drop file attacks
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    // Prevent right-click on sensitive elements
    const preventRightClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-sensitive')) {
        e.preventDefault();
      }
    };
    
    // Add security event listeners
    document.addEventListener('dragover', preventDragDrop);
    document.addEventListener('drop', preventDragDrop);
    document.addEventListener('contextmenu', preventRightClick);
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('dragover', preventDragDrop);
      document.removeEventListener('drop', preventDragDrop);
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, []);
  
  // Render children
  return <>{children}</>;
};

export default SecurityInitializer;

import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = true, className = '' }) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-50' 
    : 'flex items-center justify-center';
  
  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;

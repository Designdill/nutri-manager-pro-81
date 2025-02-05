import React from 'react';

export function LoadingState() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-lg">Carregando...</div>
        </div>
      </div>
    </div>
  );
}
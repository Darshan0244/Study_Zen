// src/components/preloader.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export function Preloader() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-primary transition-opacity duration-500 ease-out'
        // Add 'animate-fadeOut' if you define a fade-out animation
      )}
    >
      {/* StudyZen Text */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-pulse">
        StudyZen
      </h1>
      {/* Advanced Loader Effect - Simple example: Spinning circle */}
      <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse-dot bg-primary delay-0"></div>
          <div className="w-4 h-4 rounded-full animate-pulse-dot bg-primary delay-150"></div>
          <div className="w-4 h-4 rounded-full animate-pulse-dot bg-primary delay-300"></div>
      </div>
       {/* You can replace the dots with more complex SVG animations or effects */}
    </div>
  );
}

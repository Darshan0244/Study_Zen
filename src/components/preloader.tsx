// src/components/preloader.tsx
'use client'; // Needed for useState and useEffect

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const NUM_STARS = 50; // Number of stars to generate

export function Preloader() {
  const [stars, setStars] = useState<{ top: string; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const generatedStars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      generatedStars.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        // Random animation delay and duration for more natural twinkling
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 1.5 + 0.5}s`, // Duration between 0.5s and 2s
      });
    }
    setStars(generatedStars);
  }, []); // Empty dependency array ensures this runs only once on mount (client-side)

  return (
    <div
      className={cn(
        'dark', // Force dark mode for the preloader
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-primary transition-opacity duration-500 ease-out overflow-hidden' // Added overflow-hidden
      )}
    >
      {/* Star Container */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, index) => (
          <div
            key={index}
            // Apply star and twinkle classes. Use star styling from globals.css
            className="star twinkle"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* StudyZen Text - Keep it above the stars */}
      <div className="relative z-10 flex flex-col items-center"> {/* Ensure text is above stars */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-pulse">
            StudyZen
          </h1>
          {/* Original Loader Effect */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full animate-pulse-dot bg-primary delay-0"></div>
            <div className="w-4 h-4 rounded-full animate-pulse-dot bg-primary delay-150"></div>
            <div className="w-4 h-4 rounded-full animate-pulse-dot bg-primary delay-300"></div>
          </div>
       </div>
    </div>
  );
}

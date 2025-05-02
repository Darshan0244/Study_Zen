// src/components/preloader.tsx
'use client'; // Needed for useState and useEffect

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Import next/image

const NUM_STARS = 60; // Increased number of stars for a denser field
const LARGE_STAR_PROBABILITY = 0.2; // 20% chance for a star to be large

export function Preloader() {
  const [stars, setStars] = useState<{ top: string; left: string; size: 'small' | 'large'; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const generatedStars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      const isLarge = Math.random() < LARGE_STAR_PROBABILITY;
      generatedStars.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: isLarge ? 'large' : 'small',
        // More variation in animation delay and duration
        delay: `${Math.random() * 8}s`, // Wider range of delays (0s to 8s)
        duration: `${Math.random() * 2.5 + 1}s`, // Duration between 1s and 3.5s
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
            // Apply star, twinkle, and size classes. Use star styling from globals.css
            className={cn(
                'star',
                'twinkle',
                { 'large': star.size === 'large' } // Apply 'large' class if star.size is 'large'
             )}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* StudyZen Text and GIF - Keep it above the stars */}
      <div className="relative z-10 flex flex-col items-center"> {/* Ensure text is above stars */}
          {/* Add the GIF using next/image */}
          <Image
            // Replace the existing GIF URL with the new one
            src="https://i.gifer.com/XHXn.gif"
            alt="Book and Pencil Loading Animation" // Updated alt text
            width={100} // Specify width
            height={100} // Specify height
            className="mb-4" // Add some margin below the GIF
            unoptimized // GIFs often work better unoptimized with next/image
            data-ai-hint="book pencil loading animation" // Updated AI Hint for the image
          />
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

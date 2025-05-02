'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
}

export function Confetti({
  className,
  particleCount = 150, // Default number of particles
  colors = ['#FFDDAB', '#FFA725', '#5F8B4C', '#FFFFFF'], // Default theme colors
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      shape: 'rect' | 'circle';
      speedX: number;
      speedY: number;
      angle: number;
      spin: number;
      opacity: number;
      decay: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Start above the screen
        this.size = Math.random() * 8 + 4; // Size between 4 and 12
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        this.speedX = Math.random() * 6 - 3; // Horizontal speed between -3 and 3
        this.speedY = Math.random() * 5 + 2; // Vertical speed between 2 and 7 (downwards)
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 10 - 5; // Spin speed between -5 and 5
        this.opacity = 1;
        this.decay = Math.random() * 0.01 + 0.005; // Fade out speed
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        this.opacity -= this.decay;

        // Add slight gravity effect
        this.speedY += 0.05;

        // Reset particle if it goes off screen or fades out
        if (this.y > height + this.size || this.opacity <= 0) {
          // Optional: Reset particle to the top for continuous effect
          // this.x = Math.random() * width;
          // this.y = -this.size;
          // this.opacity = 1;
          // this.speedY = Math.random() * 5 + 2;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.opacity); // Ensure opacity doesn't go below 0

        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2); // Rectangular confetti
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      let activeParticles = 0;
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
        if (particle.opacity > 0) {
            activeParticles++;
        }
      });

        // Stop animation if no particles are visible
      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
         // Optional: Clear canvas once animation is fully done if not looping
         // ctx.clearRect(0, 0, width, height);
      }
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, colors]); // Re-run effect if props change

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed inset-0 z-[1000] pointer-events-none', // Ensure it's on top and doesn't block interactions
        className
      )}
      aria-hidden="true" // Hide from screen readers
    />
  );
}

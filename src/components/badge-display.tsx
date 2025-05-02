// src/components/badge-display.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBadges } from '@/hooks/useBadges'; // Import the badge hook
import { cn } from '@/lib/utils';
import { Lock, Award } from 'lucide-react'; // Import icons

export function BadgeDisplay() {
  const { allBadges } = useBadges(); // Get all badges with earned status

  const earnedBadges = allBadges.filter(b => b.earned);
  const unearnedBadges = allBadges.filter(b => !b.earned);

  return (
    <Card className="w-full shadow-lg mb-8 md:mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Award className="h-6 w-6" /> Achievements & Badges
        </CardTitle>
        <CardDescription>Track your progress and celebrate your study milestones!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        {/* Earned Badges Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-green-600 dark:text-green-400">Earned Badges ({earnedBadges.length})</h3>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <TooltipProvider delayDuration={100}>
                {earnedBadges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border bg-card text-center space-y-2",
                        "transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:shadow-primary/20" // Hover effect
                      )}>
                        <badge.icon className={cn("h-10 w-10 mb-1", badge.color || 'text-primary')} />
                        <span className="text-sm font-medium truncate w-full">{badge.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No badges earned yet. Keep studying!</p>
          )}
        </div>

        {/* Unearned Badges Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center text-muted-foreground">Locked Badges ({unearnedBadges.length})</h3>
           {unearnedBadges.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
               <TooltipProvider delayDuration={100}>
                 {unearnedBadges.map((badge) => (
                   <Tooltip key={badge.id}>
                     <TooltipTrigger asChild>
                       <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-muted/50 text-center space-y-2 opacity-60 grayscale cursor-default">
                         <Lock className="h-10 w-10 mb-1 text-muted-foreground" />
                         <span className="text-sm font-medium truncate w-full text-muted-foreground">{badge.name}</span>
                       </div>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p className="font-semibold">{badge.name} (Locked)</p>
                       <p className="text-xs text-muted-foreground">{badge.description}</p>
                     </TooltipContent>
                   </Tooltip>
                 ))}
               </TooltipProvider>
             </div>
            ) : (
                 <p className="text-center text-green-600 dark:text-green-400 py-4 font-semibold">Congratulations! You've earned all available badges!</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

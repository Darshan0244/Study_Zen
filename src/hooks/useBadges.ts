// src/hooks/useBadges.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Badge, BadgeCriteriaData } from '@/lib/badges';
import { ALL_BADGES } from '@/lib/badges';
import { useToast } from '@/hooks/use-toast';
import { Award } from 'lucide-react'; // Import icon for toast

// Define the structure for storing badge progress/data
interface BadgeProgress {
  tasksCompleted: number;
  pomodoroSessionsCompleted: number;
  lastStudyTimestamp?: number; // Timestamp of the last study activity
  studyDaysStreak: number;
  tasksCompletedToday: number; // Count for the current day
  pomodorosCompletedToday: number; // Count for the current day
  lastActivityDate?: string; // YYYY-MM-DD format
  aiPlanGeneratedCount: number;
}

const BADGE_PROGRESS_KEY = 'studyZenBadgeProgress';
const EARNED_BADGES_KEY = 'studyZenEarnedBadges';

export function useBadges() {
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set()); // Store IDs of earned badges
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress | null>(null); // Initialize as null
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { toast } = useToast();

  // Load state from local storage on mount
  useEffect(() => {
    setIsClient(true);
    setIsLoading(true); // Start loading
    const storedProgress = localStorage.getItem(BADGE_PROGRESS_KEY);
    const storedEarnedBadges = localStorage.getItem(EARNED_BADGES_KEY);

    let initialProgress: BadgeProgress = {
        tasksCompleted: 0,
        pomodoroSessionsCompleted: 0,
        studyDaysStreak: 0,
        tasksCompletedToday: 0,
        pomodorosCompletedToday: 0,
        aiPlanGeneratedCount: 0,
     };

    if (storedProgress) {
        try {
            const parsedProgress = JSON.parse(storedProgress);
            // Basic validation
            if (typeof parsedProgress === 'object' && parsedProgress !== null) {
                 initialProgress = { ...initialProgress, ...parsedProgress };
             }
        } catch (error) {
            console.error("Failed to parse badge progress:", error);
         }
     }

    // Reset daily counts if the date has changed
    const today = new Date().toISOString().split('T')[0];
    if (initialProgress.lastActivityDate !== today) {
      initialProgress.tasksCompletedToday = 0;
      initialProgress.pomodorosCompletedToday = 0;
      // Basic streak reset (can be made more robust)
      // const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      // if (initialProgress.lastActivityDate !== yesterday) {
      //     initialProgress.studyDaysStreak = 0; // Reset streak if not yesterday
      // }
    }
     initialProgress.lastActivityDate = today; // Update activity date

    setBadgeProgress(initialProgress); // Set the loaded or default progress


    if (storedEarnedBadges) {
        try {
            const parsedEarnedBadges = JSON.parse(storedEarnedBadges);
             // Ensure it's an array of strings before creating a Set
             if (Array.isArray(parsedEarnedBadges) && parsedEarnedBadges.every(id => typeof id === 'string')) {
                 setEarnedBadges(new Set(parsedEarnedBadges));
             } else {
                 setEarnedBadges(new Set()); // Fallback to empty set
             }
        } catch (error) {
             console.error("Failed to parse earned badges:", error);
             setEarnedBadges(new Set()); // Fallback to empty set on error
        }
    } else {
         setEarnedBadges(new Set()); // Initialize empty if nothing in storage
    }
    setIsLoading(false); // Finish loading
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    // Only save if not loading and progress is not null
    if (isClient && !isLoading && badgeProgress) {
      localStorage.setItem(BADGE_PROGRESS_KEY, JSON.stringify(badgeProgress));
      localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(Array.from(earnedBadges)));
    }
  }, [badgeProgress, earnedBadges, isClient, isLoading]);

  // Function to check and award badges
  const checkAndAwardBadges = useCallback(() => {
    // Ensure progress is loaded and we are on the client
    if (!isClient || isLoading || !badgeProgress) return;

    const criteriaData: BadgeCriteriaData = {
      ...badgeProgress,
      // Ensure daily counts are included (already part of badgeProgress)
    };

    let newlyEarned = false;
    const updatedEarnedBadges = new Set(earnedBadges);

    ALL_BADGES.forEach((badge) => {
      if (!earnedBadges.has(badge.id) && badge.criteria(criteriaData)) {
        updatedEarnedBadges.add(badge.id);
        newlyEarned = true;
        // Show a toast notification for newly earned badge using accent color
        toast({
          title: "Badge Earned!",
          description: `You've earned the "${badge.name}" badge! Check the Badges tab.`,
           // Use orange background and white text for better visibility in dark mode
           className: "bg-orange text-white border-orange", // Use theme orange, white text, and orange border
           duration: 6000, // Show longer
           // Optional: Add an icon using the action prop if desired
           // action: <Award className="h-5 w-5 text-white" />, // Ensure icon color is also contrasting
        });
      }
    });

    if (newlyEarned) {
      setEarnedBadges(updatedEarnedBadges);
    }
  }, [badgeProgress, earnedBadges, toast, isClient, isLoading]);

  // Call checkAndAwardBadges whenever progress changes
  useEffect(() => {
     checkAndAwardBadges();
   }, [badgeProgress, checkAndAwardBadges]); // Dependency on badgeProgress


  // Function to increment task count
  const incrementTasksCompleted = useCallback(() => {
    if (!isClient) return;
    setBadgeProgress((prev) => {
        if (!prev) return null; // Should not happen if called after load, but safeguard
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = prev.lastActivityDate !== today;
        return {
          ...prev,
          tasksCompleted: prev.tasksCompleted + 1,
          tasksCompletedToday: isNewDay ? 1 : prev.tasksCompletedToday + 1,
          lastActivityDate: today, // Update last activity date
           // TODO: Implement streak logic here if needed
           // studyDaysStreak: calculateStreak(prev.studyDaysStreak, prev.lastActivityDate),
        };
    });
  }, [isClient]);

  // Function to increment Pomodoro count
  const incrementPomodoroSessions = useCallback(() => {
     if (!isClient) return;
    setBadgeProgress((prev) => {
        if (!prev) return null;
         const today = new Date().toISOString().split('T')[0];
         const isNewDay = prev.lastActivityDate !== today;
        return {
          ...prev,
          pomodoroSessionsCompleted: prev.pomodoroSessionsCompleted + 1,
          pomodorosCompletedToday: isNewDay ? 1 : prev.pomodorosCompletedToday + 1,
          lastActivityDate: today, // Update last activity date
           // TODO: Implement streak logic here if needed
           // studyDaysStreak: calculateStreak(prev.studyDaysStreak, prev.lastActivityDate),
        };
    });
  }, [isClient]);

  // Function to increment AI plan generation count
   const incrementAiPlanGeneratedCount = useCallback(() => {
       if (!isClient) return;
       setBadgeProgress((prev) => {
           if (!prev) return null;
            const today = new Date().toISOString().split('T')[0];
           return {
               ...prev,
               aiPlanGeneratedCount: prev.aiPlanGeneratedCount + 1,
               lastActivityDate: today, // Update last activity date
               // TODO: Streak logic update if needed
           };
       });
   }, [isClient]);


  // Map earned badge IDs to badge objects
  const earnedBadgeDetails = ALL_BADGES.filter(badge => earnedBadges.has(badge.id));
   const unearnedBadgeDetails = ALL_BADGES.filter(badge => !earnedBadges.has(badge.id));


  return {
    earnedBadges: earnedBadgeDetails, // Return full badge objects
    unearnedBadges: unearnedBadgeDetails,
    badgeProgress, // Can be null initially
    isLoading, // Export loading state
    incrementTasksCompleted,
    incrementPomodoroSessions,
    incrementAiPlanGeneratedCount, // Expose the new increment function
    // Provide all badges for display purposes if needed
    allBadges: ALL_BADGES.map(badge => ({
        ...badge,
        earned: earnedBadges.has(badge.id)
    }))
  };
}

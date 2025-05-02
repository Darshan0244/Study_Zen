// src/components/feedback-display.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, CheckCircle, AlertTriangle, Activity } from 'lucide-react'; // Import icons
import { useBadges } from '@/hooks/useBadges'; // Import badge hook to get progress data
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { cn } from '@/lib/utils'; // Import cn

// Define the structure for feedback items
interface FeedbackItem {
  id: string;
  type: 'positive' | 'suggestion' | 'warning'; // Type of feedback
  title: string;
  message: string;
  icon: React.ElementType; // Icon component (e.g., CheckCircle)
}

export function FeedbackDisplay() {
  // Destructure isLoading from useBadges if available, or manage locally
  const { badgeProgress, isLoading: badgesLoading } = useBadges(); // Assuming useBadges exports isLoading
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Local loading state for feedback generation

   // Generate feedback based on progress
   useEffect(() => {
     // Only generate feedback if badge progress is loaded and available
     if (!badgesLoading && badgeProgress) {
         setIsLoading(true); // Start feedback generation loading
         const generatedFeedback: FeedbackItem[] = [];

         // Simulate delay for effect (optional, can remove if generation is fast)
         const timer = setTimeout(() => {
             // Example feedback logic (using loaded badgeProgress)
             if (badgeProgress.tasksCompleted >= 5) {
               generatedFeedback.push({
                 id: 'tasks_good',
                 type: 'positive',
                 title: 'Great Task Progress!',
                 message: `You've completed ${badgeProgress.tasksCompleted} tasks. Keep up the excellent work!`,
                 icon: CheckCircle,
               });
             } else if (badgeProgress.tasksCompleted > 0 && badgeProgress.tasksCompleted < 5) {
                  generatedFeedback.push({
                      id: 'tasks_start',
                      type: 'suggestion',
                      title: 'Getting Started',
                      message: `You've completed ${badgeProgress.tasksCompleted} task(s). Try breaking larger tasks into smaller steps.`,
                      icon: Lightbulb,
                  });
             }

             if (badgeProgress.pomodoroSessionsCompleted >= 5) {
               generatedFeedback.push({
                 id: 'pomodoro_consistent',
                 type: 'positive',
                 title: 'Focused Study Sessions',
                 message: `You've completed ${badgeProgress.pomodoroSessionsCompleted} Pomodoro sessions. Your focus is paying off!`,
                 icon: CheckCircle,
               });
             } else if (badgeProgress.pomodoroSessionsCompleted > 0 && badgeProgress.pomodoroSessionsCompleted < 5) {
                  generatedFeedback.push({
                      id: 'pomodoro_suggestion',
                      type: 'suggestion',
                      title: 'Utilize Pomodoro',
                      message: `You've used the Pomodoro timer ${badgeProgress.pomodoroSessionsCompleted} time(s). Consider using it more often to maintain focus.`,
                      icon: Lightbulb,
                  });
             }

             // Add feedback based on AI plan usage
             if (badgeProgress.aiPlanGeneratedCount > 0) {
                 generatedFeedback.push({
                     id: 'ai_plan_used',
                     type: 'positive',
                     title: 'Leveraging AI',
                     message: `You've generated ${badgeProgress.aiPlanGeneratedCount} AI study plan${badgeProgress.aiPlanGeneratedCount > 1 ? 's' : ''}. Smart planning!`,
                     icon: CheckCircle,
                 });
             } else {
                  generatedFeedback.push({
                      id: 'ai_plan_suggestion',
                      type: 'suggestion',
                      title: 'Try the AI Planner',
                      message: 'Explore the AI Planner tab to get personalized study schedules and tips based on your tasks.',
                      icon: Lightbulb,
                  });
             }

              // Add a general motivational message if no specific positive/suggestive feedback generated yet
             if (generatedFeedback.filter(f => f.type !== 'warning').length === 0 && badgeProgress.tasksCompleted === 0 && badgeProgress.pomodoroSessionsCompleted === 0) {
                  generatedFeedback.push({
                      id: 'general_motivation_start',
                      type: 'suggestion',
                      title: 'Ready to Start?',
                      message: 'Add some tasks or start a Pomodoro session to begin tracking your progress and earning badges!',
                      icon: Activity,
                  });
             } else if (generatedFeedback.filter(f => f.type === 'positive').length === 0) {
                 generatedFeedback.push({
                     id: 'general_motivation_continue',
                     type: 'suggestion',
                     title: 'Keep Going!',
                     message: 'Stay consistent with your tasks and study sessions to see the best results. You can do it!',
                     icon: Activity,
                 });
             }


             // Placeholder for streak feedback (requires streak logic)
             // if (badgeProgress.studyDaysStreak >= 3) { ... }


             setFeedback(generatedFeedback);
             setIsLoading(false); // Set loading to false after feedback is generated
          }, 500); // Reduced simulated loading time

         return () => clearTimeout(timer); // Cleanup timer on unmount
     } else {
         // If badges are still loading, ensure feedback is empty and local loading is true
         setFeedback([]);
         setIsLoading(true);
     }

   }, [badgeProgress, badgesLoading]); // Re-generate feedback when progress or its loading state changes

  const getVariant = (type: FeedbackItem['type']): 'default' | 'destructive' => {
      switch (type) {
          case 'positive': return 'default'; // Use default style, maybe add custom later
          case 'suggestion': return 'default'; // Use default style
          case 'warning': return 'destructive';
          default: return 'default';
      }
  };

   const getIconColor = (type: FeedbackItem['type']): string => {
       switch (type) {
           case 'positive': return 'text-green-600 dark:text-green-400';
           case 'suggestion': return 'text-blue-600 dark:text-blue-400';
           case 'warning': return 'text-red-600 dark:text-red-400';
           default: return 'text-foreground';
       }
   };

    const getAlertBgColor = (type: FeedbackItem['type']): string => {
       switch (type) {
           case 'positive': return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
           case 'suggestion': return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
           case 'warning': return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
           default: return 'bg-background border-border'; // Default alert background
       }
   };

  return (
    <Card className="w-full shadow-lg mb-8 md:mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Lightbulb className="h-6 w-6" /> Study Insights & Feedback
        </CardTitle>
        <CardDescription>Personalized tips and observations based on your study habits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
         {isLoading || badgesLoading ? ( // Show skeletons if either badge data or feedback generation is loading
            <>
                 <Skeleton className="h-20 w-full rounded-lg" />
                 <Skeleton className="h-20 w-full rounded-lg" />
                 <Skeleton className="h-20 w-full rounded-lg" />
            </>
          ) : feedback.length > 0 ? (
             feedback.map((item, index) => (
                 <React.Fragment key={item.id}>
                    <Alert variant={getVariant(item.type)} className={cn("transition-shadow duration-200 hover:shadow-md", getAlertBgColor(item.type))}>
                         <item.icon className={cn("h-5 w-5 mt-1", getIconColor(item.type))} /> {/* Adjusted icon margin */}
                       <AlertTitle className="font-semibold text-base mb-1">{item.title}</AlertTitle> {/* Adjusted title size/margin */}
                       <AlertDescription className="text-sm"> {/* Ensured text size */}
                         {item.message}
                       </AlertDescription>
                    </Alert>
                     {index < feedback.length - 1 && <Separator className="my-4" />} {/* Add separator between items with margin */}
                </React.Fragment>
             ))
         ) : (
           <p className="text-center text-muted-foreground py-6">No specific feedback available yet. Keep using the app to generate insights!</p>
         )}
      </CardContent>
    </Card>
  );
}

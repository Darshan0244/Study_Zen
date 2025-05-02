// src/components/feedback-display.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, CheckCircle, AlertTriangle, Activity } from 'lucide-react'; // Import icons
import { useBadges } from '@/hooks/useBadges'; // Import badge hook to get progress data
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Define the structure for feedback items
interface FeedbackItem {
  id: string;
  type: 'positive' | 'suggestion' | 'warning'; // Type of feedback
  title: string;
  message: string;
  icon: React.ElementType; // Icon component (e.g., CheckCircle)
}

export function FeedbackDisplay() {
  const { badgeProgress } = useBadges();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

   // Simulate generating feedback based on progress (replace with actual AI/logic later)
   useEffect(() => {
    setIsLoading(true);
    const generatedFeedback: FeedbackItem[] = [];

    // Simulate delay for effect
    const timer = setTimeout(() => {
        // Example feedback logic (replace with more sophisticated analysis)
        if (badgeProgress.tasksCompleted >= 5) {
          generatedFeedback.push({
            id: 'tasks_good',
            type: 'positive',
            title: 'Great Task Progress!',
            message: `You've completed ${badgeProgress.tasksCompleted} tasks. Keep up the excellent work!`,
            icon: CheckCircle,
          });
        } else if (badgeProgress.tasksCompleted < 2 && badgeProgress.tasksCompleted > 0) {
             generatedFeedback.push({
                 id: 'tasks_start',
                 type: 'suggestion',
                 title: 'Getting Started',
                 message: 'You\'re making progress on tasks. Try breaking larger tasks into smaller steps.',
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
        } else if (badgeProgress.pomodoroSessionsCompleted > 0 && badgeProgress.pomodoroSessionsCompleted < 3) {
             generatedFeedback.push({
                 id: 'pomodoro_suggestion',
                 type: 'suggestion',
                 title: 'Utilize Pomodoro',
                 message: 'Consider using the Pomodoro timer more often to maintain focus during study sessions.',
                 icon: Lightbulb,
             });
         }

        // Add a general motivational message if no specific feedback generated yet
        if (generatedFeedback.length === 0) {
             generatedFeedback.push({
                 id: 'general_motivation',
                 type: 'suggestion',
                 title: 'Keep Going!',
                 message: 'Stay consistent with your tasks and study sessions to see the best results. You can do it!',
                 icon: Activity,
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

        // Placeholder for streak feedback (requires streak logic)
        // if (badgeProgress.studyDaysStreak >= 3) { ... }


        setFeedback(generatedFeedback);
        setIsLoading(false); // Set loading to false after feedback is generated
     }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer); // Cleanup timer on unmount

   }, [badgeProgress]); // Re-generate feedback when progress changes

  const getVariant = (type: FeedbackItem['type']): 'default' | 'destructive' | 'default' => {
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

  return (
    <Card className="w-full shadow-lg mb-8 md:mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Lightbulb className="h-6 w-6" /> Study Insights & Feedback
        </CardTitle>
        <CardDescription>Personalized tips and observations based on your study habits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
         {isLoading ? (
            // Show skeletons while loading feedback
            <>
                 <Skeleton className="h-20 w-full rounded-lg" />
                 <Skeleton className="h-20 w-full rounded-lg" />
                 <Skeleton className="h-20 w-full rounded-lg" />
            </>
          ) : feedback.length > 0 ? (
             feedback.map((item, index) => (
                 <React.Fragment key={item.id}>
                    <Alert variant={getVariant(item.type)} className="transition-shadow duration-200 hover:shadow-md">
                         <item.icon className={cn("h-5 w-5", getIconColor(item.type))} /> {/* Use dynamic icon color */}
                       <AlertTitle className="font-semibold">{item.title}</AlertTitle>
                       <AlertDescription>
                         {item.message}
                       </AlertDescription>
                    </Alert>
                     {index < feedback.length - 1 && <Separator />} {/* Add separator between items */}
                </React.Fragment>
             ))
         ) : (
           <p className="text-center text-muted-foreground py-6">No specific feedback available yet. Keep using the app to generate insights!</p>
         )}
      </CardContent>
    </Card>
  );
}

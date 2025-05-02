'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { AiPlanner } from "@/components/ai-planner";
import { BadgeDisplay } from "@/components/badge-display"; // Import BadgeDisplay
import { FeedbackDisplay } from "@/components/feedback-display"; // Import FeedbackDisplay
import { BookOpenCheck, BrainCircuit, Timer, Award, Lightbulb } from 'lucide-react'; // Add Award and Lightbulb icons

export default function Home() {
  return (
    // Removed mx-auto and padding here, rely on container in layout.tsx for consistency
    <div className="flex-1 w-full">
       {/* Use grid with more columns to accommodate new tabs */}
      <Tabs defaultValue="tasks" className="w-full flex flex-col">
         {/* Update grid columns for 5 tabs, adjust gaps */}
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-6 gap-1 sm:gap-2">
           <TabsTrigger value="tasks" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base">
             <BookOpenCheck className="h-4 w-4 sm:h-5 sm:w-5" />
             Tasks
           </TabsTrigger>
           <TabsTrigger value="pomodoro" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base">
             <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
             Pomodoro
           </TabsTrigger>
           <TabsTrigger value="ai-planner" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base">
             <BrainCircuit className="h-4 w-4 sm:h-5 sm:w-5" />
             AI Planner
           </TabsTrigger>
           {/* New Tab for Insights */}
           <TabsTrigger value="insights" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base">
             <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
             Insights
           </TabsTrigger>
           {/* New Tab for Achievements */}
           <TabsTrigger value="achievements" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base">
             <Award className="h-4 w-4 sm:h-5 sm:w-5" />
             Badges
           </TabsTrigger>
        </TabsList>

        {/* Add margin-top to TabsContent */}
        {/* Ensure content takes remaining space and applies padding */}
        {/* Increased mt-6 to mt-8 */}
        {/* Added mt-4 for smaller screens */}
        <TabsContent value="tasks" className="flex-1 mt-4 md:mt-8 p-0 md:p-4">
          <TaskList />
        </TabsContent>
        <TabsContent value="pomodoro" className="flex-1 mt-4 md:mt-8 p-0 md:p-4">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="ai-planner" className="flex-1 mt-4 md:mt-8 p-0 md:p-4">
          <AiPlanner />
        </TabsContent>
         {/* New Content Area for Insights */}
         <TabsContent value="insights" className="flex-1 mt-4 md:mt-8 p-0 md:p-4">
           <FeedbackDisplay />
         </TabsContent>
         {/* New Content Area for Achievements */}
         <TabsContent value="achievements" className="flex-1 mt-4 md:mt-8 p-0 md:p-4">
           <BadgeDisplay />
         </TabsContent>
      </Tabs>
    </div>
  );
}

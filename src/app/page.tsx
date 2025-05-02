'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { AiPlanner } from "@/components/ai-planner";
import { BookOpenCheck, BrainCircuit, Timer } from 'lucide-react';

export default function Home() {
  return (
    // Removed mx-auto and padding here, rely on container in layout.tsx for consistency
    <div className="flex-1 w-full">
      <Tabs defaultValue="tasks" className="w-full flex flex-col"> {/* Make Tabs a flex container */}
        {/* Changed grid layout to always be grid-cols-3 */}
        <TabsList className="grid w-full grid-cols-3 mb-6 gap-1 sm:gap-2"> {/* Reduced gap slightly for smaller screens */}
          <TabsTrigger value="tasks" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base"> {/* Adjusted padding/gap/text size */}
            <BookOpenCheck className="h-4 w-4 sm:h-5 sm:w-5" /> {/* Adjusted icon size */}
            Tasks
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base"> {/* Adjusted padding/gap/text size */}
             <Timer className="h-4 w-4 sm:h-5 sm:w-5" /> {/* Adjusted icon size */}
            Pomodoro
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm md:text-base"> {/* Adjusted padding/gap/text size */}
             <BrainCircuit className="h-4 w-4 sm:h-5 sm:w-5" /> {/* Adjusted icon size */}
            AI Planner
          </TabsTrigger>
        </TabsList>

        {/* Add margin-top to TabsContent to ensure space below TabsList */}
        {/* Ensure content takes remaining space and applies padding */}
        {/* Increased mt-6 to mt-8 for more vertical separation */}
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
      </Tabs>
    </div>
  );
}

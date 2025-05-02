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
        {/* Adjusted grid columns for better responsiveness */}
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 gap-2">
          <TabsTrigger value="tasks" className="flex items-center justify-center gap-2 py-3 text-sm md:text-base">
            <BookOpenCheck className="h-5 w-5" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center justify-center gap-2 py-3 text-sm md:text-base">
             <Timer className="h-5 w-5" />
            Pomodoro Timer
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="flex items-center justify-center gap-2 py-3 text-sm md:text-base">
             <BrainCircuit className="h-5 w-5" />
            AI Planner
          </TabsTrigger>
        </TabsList>

        {/* Add margin-top to TabsContent to ensure space below TabsList */}
        {/* Ensure content takes remaining space and applies padding */}
        <TabsContent value="tasks" className="flex-1 mt-6 p-0 md:p-4">
          <TaskList />
        </TabsContent>
        <TabsContent value="pomodoro" className="flex-1 mt-6 p-0 md:p-4">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="ai-planner" className="flex-1 mt-6 p-0 md:p-4">
          <AiPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}

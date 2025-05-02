'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { AiPlanner } from "@/components/ai-planner";
import { BookOpenCheck, BrainCircuit, Timer } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8 flex-1"> {/* Ensure container takes available space */}
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

        {/* Ensure TabsContent takes up remaining space if needed, added padding */}
        <TabsContent value="tasks" className="flex-1 py-4 md:py-8">
          <TaskList />
        </TabsContent>
        <TabsContent value="pomodoro" className="flex-1 py-4 md:py-8">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="ai-planner" className="flex-1 py-4 md:py-8">
          <AiPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}

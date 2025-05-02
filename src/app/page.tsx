'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { AiPlanner } from "@/components/ai-planner";
import { BookOpenCheck, BrainCircuit, Timer } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 gap-2 md:gap-4">
          <TabsTrigger value="tasks" className="flex items-center gap-2 py-3 text-sm md:text-base">
            <BookOpenCheck className="h-5 w-5" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center gap-2 py-3 text-sm md:text-base">
             <Timer className="h-5 w-5" />
            Pomodoro Timer
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="flex items-center gap-2 py-3 text-sm md:text-base">
             <BrainCircuit className="h-5 w-5" />
            AI Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>
        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="ai-planner">
          <AiPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}

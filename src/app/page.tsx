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
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 gap-2 md:gap-4"> {/* Changed md:grid-cols-3 to sm:grid-cols-3 for earlier wrapping */}
          <TabsTrigger value="tasks" className="flex items-center justify-center gap-2 py-3 text-sm md:text-base"> {/* Added justify-center */}
            <BookOpenCheck className="h-5 w-5" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center justify-center gap-2 py-3 text-sm md:text-base"> {/* Added justify-center */}
             <Timer className="h-5 w-5" />
            Pomodoro Timer
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="flex items-center justify-center gap-2 py-3 text-sm md:text-base"> {/* Added justify-center */}
             <BrainCircuit className="h-5 w-5" />
            AI Planner
          </TabsTrigger>
        </TabsList>

        {/* Added py-8 for vertical padding to increase perceived height */}
        <TabsContent value="tasks" className="py-8">
          <TaskList />
        </TabsContent>
        <TabsContent value="pomodoro" className="py-8">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="ai-planner" className="py-8">
          <AiPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}

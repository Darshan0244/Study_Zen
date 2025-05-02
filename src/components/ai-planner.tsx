'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { generateStudyPlan } from '@/ai/flows/generate-study-plan'; // Import the GenAI function
import type { GenerateStudyPlanInput, GenerateStudyPlanOutput } from '@/ai/flows/generate-study-plan';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the Task interface again or import if defined elsewhere globally
type Priority = 'High' | 'Medium' | 'Low';
interface Task {
  id: string;
  taskName: string;
  deadline: Date | null;
  subject: string;
  priority: Priority;
  completed: boolean;
}

export function AiPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

   // Load tasks from local storage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('studyZenTasks');
     if (storedTasks) {
       try {
         const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
           ...task,
           deadline: task.deadline ? new Date(task.deadline) : null,
         }));
         setTasks(parsedTasks);
       } catch (error) {
         console.error("Failed to parse tasks for AI Planner:", error);
         // Handle error, maybe show a toast or use default empty tasks
       }
     }
  }, []);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setStudyPlan(null); // Clear previous plan

    const activeTasks = tasks.filter(task => !task.completed);

    if (activeTasks.length === 0) {
       toast({
         title: "No Active Tasks",
         description: "Add some tasks or unmark completed ones to generate a plan.",
         variant: "destructive",
       });
      setIsLoading(false);
      return;
    }

    const input: GenerateStudyPlanInput = {
      tasks: activeTasks.map(task => ({
        taskName: task.taskName,
        deadline: task.deadline ? task.deadline.toISOString().split('T')[0] : 'No deadline', // Format date as YYYY-MM-DD
        subject: task.subject,
        priority: task.priority,
      })),
    };

    try {
      const result: GenerateStudyPlanOutput = await generateStudyPlan(input);
      setStudyPlan(result.studyPlan);
       toast({
         title: "Study Plan Generated!",
         description: "AI has created a personalized study plan for you.",
       });
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast({
         title: "Error Generating Plan",
         description: "Could not generate study plan. Please check your connection or API key.",
         variant: "destructive",
      });
      setStudyPlan("Failed to generate study plan. Please ensure your API key is configured correctly and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
           <BrainCircuit className="h-6 w-6" /> AI Study Planner
        </CardTitle>
        <CardDescription>Let AI help you organize your study schedule based on your tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <Alert>
           <Sparkles className="h-4 w-4" />
           <AlertTitle>How it works</AlertTitle>
           <AlertDescription>
             The AI Planner uses your current active (incomplete) tasks, considering their deadlines and priorities, to suggest an optimized study schedule. Make sure your task list is up-to-date for the best results.
           </AlertDescription>
         </Alert>
        <Button onClick={handleGeneratePlan} disabled={isLoading || tasks.filter(t => !t.completed).length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
             <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Study Plan
             </>
          )}
        </Button>

        {studyPlan && (
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">Suggested Study Plan:</h3>
             {/* Use Textarea for potentially long, formatted text. Or render Markdown if possible */}
             <Textarea
                value={studyPlan}
                readOnly
                className="min-h-[200px] bg-muted/30 p-4 rounded-md border whitespace-pre-wrap" // whitespace-pre-wrap preserves formatting
                aria-label="Generated Study Plan"
             />
          </div>
        )}
      </CardContent>
       <CardFooter className="text-sm text-muted-foreground">
          Generated based on {tasks.filter(t => !t.completed).length} active tasks.
       </CardFooter>
    </Card>
  );
}

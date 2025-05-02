// src/components/ai-planner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BrainCircuit, Loader2, Sparkles, ListChecks, CalendarDays, Lightbulb } from 'lucide-react';
import { generateStudyPlan } from '@/ai/flows/generate-study-plan'; // Import the GenAI function
import type { GenerateStudyPlanInput, GenerateStudyPlanOutput } from '@/ai/flows/generate-study-plan';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown'; // Import react-markdown


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
  // Use the structured output type
  const [studyPlan, setStudyPlan] = useState<GenerateStudyPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // Track client mount

   // Load tasks from local storage on mount (client-side only)
  useEffect(() => {
     setIsClient(true); // Now we are on the client
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
          setTasks([]); // Set to empty array on error
       }
     } else {
        setTasks([]); // Set to empty if nothing in storage
     }
  }, []);

  const activeTasks = tasks.filter(task => !task.completed);
  const hasActiveTasks = activeTasks.length > 0;

  const handleGeneratePlan = async () => {
      if (!isClient) return; // Guard against server-side execution

    setIsLoading(true);
    setStudyPlan(null); // Clear previous plan

    if (!hasActiveTasks) {
       toast({
         title: "No Active Tasks",
         description: "Add some tasks or unmark completed ones in the 'Tasks' tab to generate a plan.",
         variant: "destructive",
       });
      setIsLoading(false);
      return;
    }

    const input: GenerateStudyPlanInput = {
      tasks: activeTasks.map(task => ({
        taskName: task.taskName,
        // Provide a default or indicator if deadline is null
        deadline: task.deadline ? task.deadline.toISOString().split('T')[0] : 'Not Set', // Format date as YYYY-MM-DD or indicate null
        subject: task.subject,
        priority: task.priority,
      })),
    };

    try {
      // Result now matches GenerateStudyPlanOutput type
      const result: GenerateStudyPlanOutput = await generateStudyPlan(input);
      setStudyPlan(result);
       toast({
         title: "Study Plan Generated!",
         description: "AI has created a personalized study plan for you below.",
         duration: 5000, // Show toast longer
       });
    } catch (error) {
      console.error('Error generating study plan:', error);
      let errorMessage = "Could not generate study plan. Please try again later.";
      if (error instanceof Error && error.message.includes('API key')) {
           errorMessage = "Could not generate study plan. Please ensure your Google AI API key is configured correctly in the environment variables.";
      } else if (error instanceof Error) {
            errorMessage = `Could not generate study plan: ${error.message}. Please check your connection or try again.`;
       }

      toast({
         title: "Error Generating Plan",
         description: errorMessage,
         variant: "destructive",
         duration: 9000, // Show error longer
      });
      // Display error message in a structured way
      setStudyPlan({ schedule: `**Error:** ${errorMessage}`, suggestions: [] });
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
        <CardDescription>Let AI craft a personalized study schedule and offer helpful suggestions based on your active tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4"> {/* Increased spacing */}
         <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
           <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
           <AlertTitle className="text-blue-800 dark:text-blue-300">How it works</AlertTitle>
           <AlertDescription className="text-blue-700 dark:text-blue-400">
             This AI planner analyzes your current <strong>active (incomplete)</strong> tasks from the 'Tasks' tab. It considers deadlines and priorities to suggest an optimized study schedule and provides general study tips. Keep your task list accurate for the best results!
           </AlertDescription>
         </Alert>

         {!isClient && ( // Show loading state for tasks on initial render
            <div className="flex items-center justify-center p-4 text-muted-foreground">
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading tasks...
            </div>
          )}

         {isClient && !hasActiveTasks && ( // Show message if no active tasks after client load
             <Alert variant="destructive">
                 <ListChecks className="h-4 w-4" />
               <AlertTitle>No Active Tasks Found</AlertTitle>
               <AlertDescription>
                  Please add some tasks or mark existing ones as incomplete in the 'Tasks' tab before generating a plan.
               </AlertDescription>
             </Alert>
         )}

         {isClient && hasActiveTasks && ( // Show button only if client loaded and has tasks
             <div className="flex justify-center"> {/* Center the button */}
                <Button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    size="lg" // Larger button
                >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Plan...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate My Study Plan
                    </>
                )}
                </Button>
            </div>
         )}


        {studyPlan && (
          <div className="mt-6 space-y-6"> {/* Increased margin and spacing for plan */}
             <Separator />

             {/* Schedule Section */}
             <div>
                <h3 className="text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2">
                     <CalendarDays className="h-5 w-5 text-primary" /> Your Study Schedule
                </h3>
                 <Card className="bg-muted/20 dark:bg-muted/30">
                     <CardContent className="p-4">
                         {/* Use ReactMarkdown to render the schedule */}
                         <ReactMarkdown
                             className="prose prose-sm sm:prose-base dark:prose-invert max-w-none [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1"
                            // Add components if needed for custom rendering of markdown elements
                            // components={{ ... }}
                         >
                            {studyPlan.schedule}
                         </ReactMarkdown>
                     </CardContent>
                 </Card>
             </div>

             {/* Suggestions Section */}
            {studyPlan.suggestions && studyPlan.suggestions.length > 0 && !studyPlan.schedule.startsWith('**Error:**') && ( // Only show if suggestions exist and no error
              <div>
                 <h3 className="text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2">
                   <Lightbulb className="h-5 w-5 text-accent" /> AI Suggestions
                 </h3>
                  <Card className="bg-accent/10 dark:bg-accent/20 border-accent/30">
                    <CardContent className="p-4">
                        <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
                        {studyPlan.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                        </ul>
                    </CardContent>
                  </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
       <CardFooter className="text-sm text-muted-foreground mt-6 flex justify-center"> {/* Center footer text */}
          Plan will be based on {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}.
       </CardFooter>
    </Card>
  );
}
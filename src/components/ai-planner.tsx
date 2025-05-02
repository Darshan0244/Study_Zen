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
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state
import { useBadges } from '@/hooks/useBadges'; // Import the badge hook

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
  const [tasksLoading, setTasksLoading] = useState(true); // State for initial task loading
  const { incrementAiPlanGeneratedCount } = useBadges(); // Use the badge hook

   // Load tasks from local storage on mount (client-side only)
  useEffect(() => {
     setIsClient(true); // Now we are on the client
    try {
       const storedTasks = localStorage.getItem('studyZenTasks');
       if (storedTasks) {
         const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
           ...task,
           deadline: task.deadline ? new Date(task.deadline) : null,
         }));
         // Set tasks from storage if valid, otherwise keep empty
         setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
       } else {
         setTasks([]); // Set to empty if nothing in storage
       }
     } catch (error) {
       console.error("Failed to parse tasks for AI Planner:", error);
       setTasks([]); // Set to empty array on error
     } finally {
         setTasksLoading(false); // Mark tasks as loaded (or failed)
     }
  }, []);

  const activeTasks = tasks.filter(task => !task.completed);
  const hasActiveTasks = activeTasks.length > 0;

  const handleGeneratePlan = async () => {
      if (!isClient || tasksLoading) return; // Guard against server-side execution or while tasks are loading

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
       incrementAiPlanGeneratedCount(); // Increment badge counter on success
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
     // Add bottom margin for spacing
    <Card className="w-full shadow-lg mb-8 md:mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
           <BrainCircuit className="h-6 w-6" /> AI Study Planner
        </CardTitle>
        <CardDescription>Let AI craft a personalized study schedule and offer helpful suggestions based on your active tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4"> {/* Increased spacing */}
         <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow duration-200"> {/* Added subtle shadow and hover effect */}
           <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
           <AlertTitle className="text-blue-800 dark:text-blue-300">How it works</AlertTitle>
           <AlertDescription className="text-blue-700 dark:text-blue-400">
             This AI planner analyzes your current <strong>active (incomplete)</strong> tasks from the 'Tasks' tab. It considers deadlines and priorities to suggest an optimized study schedule and provides general study tips. Keep your task list accurate for the best results!
           </AlertDescription>
         </Alert>

         {tasksLoading && ( // Show loading skeleton for tasks on initial render
            <div className="space-y-2 p-4">
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
            </div>
          )}

         {!tasksLoading && !hasActiveTasks && isClient && ( // Show message if no active tasks after client load
             <Alert variant="destructive">
                 <ListChecks className="h-4 w-4" />
               <AlertTitle>No Active Tasks Found</AlertTitle>
               <AlertDescription>
                  Please add some tasks or mark existing ones as incomplete in the 'Tasks' tab before generating a plan.
               </AlertDescription>
             </Alert>
         )}

         {isClient && !tasksLoading && hasActiveTasks && ( // Show button only if client loaded, tasks loaded, and has tasks
             <div className="flex justify-center"> {/* Center the button */}
                 {/* Adjusted button size and added transition/hover effect */}
                <Button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    size="lg" // Make button larger
                    className="w-full sm:w-auto transition-transform duration-150 ease-in-out hover:scale-105 active:scale-100" // Enhanced hover effect
                >
                {isLoading ? (
                    <>
                     {/* Make loader more prominent */}
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Plan...
                    </>
                ) : (
                    <>
                         {/* Make icon slightly larger */}
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate My Study Plan
                    </>
                )}
                </Button>
            </div>
         )}


         {isLoading && !studyPlan && ( // Show skeleton while AI is generating
             <div className="mt-6 space-y-6">
                <Separator />
                <div className="space-y-4">
                     <Skeleton className="h-6 w-1/3 mx-auto" /> {/* Schedule title skeleton */}
                     <Card className="bg-muted/20 dark:bg-muted/30">
                         <CardContent className="p-4 space-y-3">
                              <Skeleton className="h-4 w-1/4" /> {/* Date heading skeleton */}
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6" />
                             <Skeleton className="h-4 w-full" />
                         </CardContent>
                     </Card>
                </div>
                 <div className="space-y-4">
                     <Skeleton className="h-6 w-1/4 mx-auto" /> {/* Suggestions title skeleton */}
                     <Card className="bg-accent/10 dark:bg-accent/20 border-accent/30">
                        <CardContent className="p-4 space-y-2">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6" />
                             <Skeleton className="h-4 w-full" />
                        </CardContent>
                     </Card>
                 </div>
            </div>
          )}


        {!isLoading && studyPlan && ( // Show plan only when not loading and plan exists
          <div className="mt-6 space-y-6 animate-in fade-in duration-500"> {/* Added fade-in animation */}
             <Separator />

             {/* Schedule Section */}
             <div>
                 <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2"> {/* Responsive text size */}
                     <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> Your Study Schedule {/* Responsive icon */}
                 </h3>
                  <Card className="bg-muted/20 dark:bg-muted/30 border border-muted/50 transition-shadow duration-200 hover:shadow-md"> {/* Added border and hover shadow */}
                     <CardContent className="p-4">
                         {/* Use ReactMarkdown to render the schedule */}
                         <ReactMarkdown
                              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1" // Adjusted heading size
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
                  <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2"> {/* Responsive text size */}
                   <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-accent" /> AI Suggestions {/* Responsive icon */}
                 </h3>
                   <Card className="bg-accent/10 dark:bg-accent/20 border border-accent/40 transition-shadow duration-200 hover:shadow-md"> {/* Added border and hover shadow */}
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
       <CardFooter className="text-xs sm:text-sm text-muted-foreground mt-6 flex justify-center text-center"> {/* Responsive text size and center */}
           {isClient && !tasksLoading
             ? `Plan will be based on ${activeTasks.length} active task${activeTasks.length !== 1 ? 's' : ''}.`
             : 'Loading task info...'
           }
       </CardFooter>
    </Card>
  );
}

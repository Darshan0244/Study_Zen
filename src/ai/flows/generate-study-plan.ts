// src/ai/flows/generate-study-plan.ts
'use server';

/**
 * @fileOverview An AI agent that generates a personalized study plan based on tasks, deadlines, and subjects.
 *
 * - generateStudyPlan - A function that handles the study plan generation process.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
  tasks: z
    .array(
      z.object({
        taskName: z.string().describe('The name of the task.'),
        deadline: z
          .string()
          .describe(
            'The deadline for the task (e.g., YYYY-MM-DD or "Not Set").'
          ),
        subject: z.string().describe('The subject of the task.'),
        priority: z
          .enum(['High', 'Medium', 'Low'])
          .describe('The priority of the task.'),
      })
    )
    .describe(
      'A list of *active* tasks with their deadlines, subjects and priorities.'
    ),
});

export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

// Updated Output Schema for better structure
const GenerateStudyPlanOutputSchema = z.object({
  schedule: z
    .string()
    .describe(
      'A day-by-day study schedule based on the tasks, formatted clearly using Markdown (e.g., using headings for dates and bullet points for tasks). Include the priority for each task in the schedule.'
    ),
  suggestions: z
    .array(z.string())
    .describe('A list of actionable study suggestions or tips.'),
});

export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(
  input: GenerateStudyPlanInput
): Promise<GenerateStudyPlanOutput> {
  // Add a check for empty tasks before calling the flow if needed, though handled in frontend too
  if (!input.tasks || input.tasks.length === 0) {
    // Return a default empty plan or throw an error
    return {
      schedule: 'No active tasks provided to generate a schedule.',
      suggestions: ['Add some tasks to get started!'],
    };
  }
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {
    schema: GenerateStudyPlanInputSchema, // Use the input schema defined above
  },
  output: {
    schema: GenerateStudyPlanOutputSchema, // Use the updated output schema
  },
  prompt: `You are a helpful AI assistant specialized in creating effective and personalized study plans for students.

Given the following *active* tasks, create a practical and motivating study plan. The plan should include:
1.  **A clear, day-by-day schedule:**
    *   Format this schedule using Markdown. Use headings (e.g., \`### YYYY-MM-DD\`) for each date.
    *   List the specific task(s) to focus on for each day using bullet points.
    *   Include the task's subject and priority (e.g., \`- History: Read Chapter 3 (High Priority)\`).
    *   Prioritize tasks with earlier deadlines ('Not Set' deadlines should be considered less urgent than set deadlines) and higher priorities.
    *   Break down larger tasks across multiple days if necessary (e.g., 'Start Project X', 'Continue Project X', 'Finalize Project X').
    *   Be realistic about the workload per day.
2.  **Actionable Study Suggestions:**
    *   Provide a list of general study tips relevant to the tasks provided (e.g., time management, focus techniques, subject-specific tips).
    *   Keep suggestions concise and helpful.

Here are the student's active tasks:
{{#each tasks}}
- Task: {{taskName}}
  Subject: {{subject}}
  Deadline: {{deadline}}
  Priority: {{priority}}
{{/each}}

Generate the schedule and suggestions based *only* on these tasks. Ensure the output matches the requested JSON schema with 'schedule' (Markdown string) and 'suggestions' (array of strings) fields.`,
});


const generateStudyPlanFlow = ai.defineFlow<
  typeof GenerateStudyPlanInputSchema,
  typeof GenerateStudyPlanOutputSchema
>(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure output conforms to the schema, especially if the LLM might return null/undefined
    return output ?? { schedule: "Error: Could not generate schedule.", suggestions: ["Error: Could not generate suggestions."] };
  }
);
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
        deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD).'),
        subject: z.string().describe('The subject of the task.'),
        priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task.'),
      })
    )
    .describe('A list of tasks with their deadlines, subjects and priorities.'),
});

export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z
    .string()
    .describe('A personalized study plan, which includes a schedule and suggestions.'),
});

export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {
    schema: z.object({
      tasks: z
        .array(
          z.object({
            taskName: z.string().describe('The name of the task.'),
            deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD).'),
            subject: z.string().describe('The subject of the task.'),
            priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task.'),
          })
        )
        .describe('A list of tasks with their deadlines, subjects and priorities.'),
    }),
  },
  output: {
    schema: z.object({
      studyPlan: z
        .string()
        .describe('A personalized study plan, which includes a schedule and suggestions.'),
    }),
  },
  prompt: `You are a helpful AI assistant that generates personalized study plans for students based on their tasks, deadlines, subjects, and priorities.\n\n  Given the following tasks, create a study plan that helps the student study effectively. Prioritize tasks with earlier deadlines and higher priorities.\n\n  Tasks:\n  {{#each tasks}}\n  - Task: {{taskName}}, Deadline: {{deadline}}, Subject: {{subject}}, Priority: {{priority}}\n  {{/each}}\n\n  Study Plan:`,
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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

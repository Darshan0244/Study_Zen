import type { LucideIcon } from 'lucide-react';
import { Award, CheckCircle, Clock, Star, Target, Zap, Trophy, Brain } from 'lucide-react';

// Define the structure for a badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon; // Use LucideIcon type
  criteria: (data: BadgeCriteriaData) => boolean; // Function to check if badge is earned
  earned?: boolean; // Optional: indicates if the badge has been earned by the user
  color?: string; // Optional: Tailwind color class for the icon/badge background
}

// Define the data structure passed to the criteria function
export interface BadgeCriteriaData {
  tasksCompleted: number;
  pomodoroSessionsCompleted: number;
  studyDaysStreak: number; // How many consecutive days the user has studied (e.g., completed a task or Pomodoro)
  tasksCompletedToday: number;
  pomodorosCompletedToday: number;
  aiPlanGeneratedCount: number;
}

// List of all available badges
export const ALL_BADGES: Badge[] = [
  // Task-related badges
  {
    id: 'task_novice',
    name: 'Task Novice',
    description: 'Complete your first task.',
    icon: Star,
    criteria: (data) => data.tasksCompleted >= 1,
    color: 'text-yellow-500', // Example color
  },
  {
    id: 'task_apprentice',
    name: 'Task Apprentice',
    description: 'Complete 5 tasks.',
    icon: CheckCircle,
    criteria: (data) => data.tasksCompleted >= 5,
    color: 'text-green-500',
  },
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete 25 tasks.',
    icon: Award,
    criteria: (data) => data.tasksCompleted >= 25,
    color: 'text-blue-500',
  },
  {
    id: 'daily_finisher',
    name: 'Daily Finisher',
    description: 'Complete 3 tasks in a single day.',
    icon: Target,
    criteria: (data) => data.tasksCompletedToday >= 3,
    color: 'text-red-500',
  },
  // Pomodoro-related badges
  {
    id: 'pomodoro_starter',
    name: 'Pomodoro Starter',
    description: 'Complete your first Pomodoro work session.',
    icon: Clock,
    criteria: (data) => data.pomodoroSessionsCompleted >= 1,
    color: 'text-orange-500',
  },
  {
    id: 'focused_flow',
    name: 'Focused Flow',
    description: 'Complete 5 Pomodoro work sessions.',
    icon: Zap,
    criteria: (data) => data.pomodoroSessionsCompleted >= 5,
    color: 'text-purple-500',
  },
  {
    id: 'pomodoro_pro',
    name: 'Pomodoro Pro',
    description: 'Complete 20 Pomodoro work sessions.',
    icon: Trophy,
    criteria: (data) => data.pomodoroSessionsCompleted >= 20,
    color: 'text-indigo-500',
  },
   {
    id: 'power_hour',
    name: 'Power Hour',
    description: 'Complete 2 Pomodoro sessions in a single day.',
    icon: Clock, // Reusing icon, maybe find a better one?
    criteria: (data) => data.pomodorosCompletedToday >= 2,
    color: 'text-teal-500',
  },
  // Consistency badges (Placeholder - requires tracking logic)
  // {
  //   id: 'consistent_learner',
  //   name: 'Consistent Learner',
  //   description: 'Study for 3 consecutive days.',
  //   icon: CalendarDays, // Or another suitable icon
  //   criteria: (data) => data.studyDaysStreak >= 3,
  //   color: 'text-lime-500',
  // },
  // AI Planner badges
   {
    id: 'ai_planner_user',
    name: 'AI Planner User',
    description: 'Generate your first AI study plan.',
    icon: Brain,
    criteria: (data) => data.aiPlanGeneratedCount >= 1,
    color: 'text-pink-500',
   },
];

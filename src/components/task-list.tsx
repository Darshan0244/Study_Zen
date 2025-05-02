'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Edit, Plus, X, Check, Calendar as CalendarIconLucide } from 'lucide-react'; // Renamed Calendar import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Keep this for the component
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  taskName: string;
  deadline: Date | null;
  subject: string;
  priority: Priority;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: '1', taskName: 'Read Chapter 3 - History of Ancient Civilizations and their impact on modern society', deadline: new Date(2024, 6, 25), subject: 'History', priority: 'High', completed: false },
  { id: '2', taskName: 'Complete Math Assignment - Calculus problems involving derivatives and integrals', deadline: new Date(2024, 6, 27), subject: 'Math', priority: 'Medium', completed: false },
  { id: '3', taskName: 'Practice French Verbs - Conjugate irregular verbs in present and past tense', deadline: null, subject: 'French', priority: 'Low', completed: true },
  { id: '4', taskName: 'Write Biology Lab Report - Experiment on plant photosynthesis rates', deadline: new Date(2024, 7, 5), subject: 'Biology', priority: 'High', completed: false },
  { id: '5', taskName: 'Study for Physics Quiz - Chapters on kinematics and dynamics', deadline: new Date(2024, 7, 1), subject: 'Physics', priority: 'Medium', completed: false },
  { id: '6', taskName: 'Prepare Literature Presentation - Analysis of themes in "To Kill a Mockingbird"', deadline: new Date(2024, 7, 8), subject: 'Literature', priority: 'Low', completed: false },
];


export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState<Date | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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
         setTasks(parsedTasks.length > 0 ? parsedTasks : initialTasks); // Use initial if storage is empty array
       } catch (error) {
         console.error("Failed to parse tasks from local storage:", error);
         setTasks(initialTasks); // Fallback to initial tasks if parsing fails
         localStorage.setItem('studyZenTasks', JSON.stringify(initialTasks));
       }
    } else {
      setTasks(initialTasks);
      localStorage.setItem('studyZenTasks', JSON.stringify(initialTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    // Only save if tasks array is not the initial default (or differs)
    // This prevents overwriting potentially empty storage with defaults immediately
    if (typeof window !== 'undefined') { // Ensure localStorage is available
        const currentStoredTasks = localStorage.getItem('studyZenTasks');
        if (JSON.stringify(tasks) !== currentStoredTasks) {
            localStorage.setItem('studyZenTasks', JSON.stringify(tasks));
        }
    }
  }, [tasks]);


  const addTask = () => {
    if (!newTaskName.trim() || !newTaskSubject.trim()) {
      toast({
         title: "Missing Information",
         description: "Please provide a task name and subject.",
         variant: "destructive",
       });
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      taskName: newTaskName,
      deadline: newTaskDeadline,
      subject: newTaskSubject,
      priority: newTaskPriority,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskName('');
    setNewTaskSubject('');
    setNewTaskPriority('Medium');
    setNewTaskDeadline(null);
    toast({
        title: "Task Added",
        description: `"${newTask.taskName}" has been added to your list.`,
    });
  };

  const toggleComplete = (id: string) => {
    const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    setTasks(updatedTasks);
     const updatedTask = updatedTasks.find(task => task.id === id);
     if (updatedTask) {
       toast({
         title: `Task ${!updatedTask.completed ? 'marked as incomplete' : 'completed'}`, // Corrected logic based on new state
         description: `"${updatedTask.taskName}" status updated.`,
       });
     }
  };


  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter((task) => task.id !== id));
     if (taskToDelete) {
       toast({
         title: "Task Deleted",
         description: `"${taskToDelete.taskName}" has been removed.`,
         variant: "destructive",
       });
     }
  };

  const startEditing = (task: Task) => {
    setEditingTask({...task});
  };

  const saveEdit = () => {
     if (!editingTask || !editingTask.taskName.trim() || !editingTask.subject.trim()) {
       toast({
          title: "Missing Information",
          description: "Task name and subject cannot be empty.",
          variant: "destructive",
        });
       return;
     }
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id ? editingTask : task
      )
    );
    toast({
        title: "Task Updated",
        description: `"${editingTask.taskName}" has been updated.`,
    });
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return 'border-l-destructive';
      case 'Medium':
        return 'border-l-orange-500'; // Use direct orange
      case 'Low':
        return 'border-l-green-500'; // Use direct green
      default:
        return 'border-l-muted';
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">My Tasks</CardTitle>
        <CardDescription>Manage your assignments and study goals. Scroll down to see all tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Increased spacing */}
        {/* Add Task Form */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-6 p-4 border rounded-lg bg-muted/50 items-end"> {/* Added flex-wrap and items-end */}
          <div className="flex-grow w-full sm:w-auto mb-2 sm:mb-0">
            <Label htmlFor="new-task-name" className="sr-only">New Task Name</Label>
            <Input
              id="new-task-name"
              type="text"
              placeholder="New Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full"
              aria-label="New Task Name"
            />
          </div>
          <div className="w-full sm:w-auto sm:max-w-[150px] mb-2 sm:mb-0"> {/* Max width for subject */}
            <Label htmlFor="new-task-subject" className="sr-only">Subject</Label>
            <Input
              id="new-task-subject"
              type="text"
              placeholder="Subject"
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              className="w-full"
              aria-label="New Task Subject"
            />
          </div>
          <div className="w-full sm:w-auto mb-2 sm:mb-0"> {/* Width auto for select */}
             <Label htmlFor="new-task-priority" className="sr-only">Priority</Label>
            <Select value={newTaskPriority} onValueChange={(value: string) => setNewTaskPriority(value as Priority)}>
              <SelectTrigger id="new-task-priority" className="w-full sm:w-[130px]" aria-label="New Task Priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="w-full sm:w-auto mb-2 sm:mb-0"> {/* Width auto for date picker */}
             <Label htmlFor="new-task-deadline" className="sr-only">Deadline</Label>
             <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="new-task-deadline"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[180px] justify-start text-left font-normal",
                      !newTaskDeadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIconLucide className="mr-2 h-4 w-4" /> {/* Use renamed import */}
                    {newTaskDeadline ? format(newTaskDeadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTaskDeadline ?? undefined}
                    onSelect={(date) => setNewTaskDeadline(date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          <Button onClick={addTask} aria-label="Add New Task" className="w-full sm:w-auto"> {/* Button takes full width on small screens */}
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-4"> {/* Increased spacing between tasks */}
          {tasks.length === 0 ? (
             <p className="text-center text-muted-foreground py-8">No tasks yet. Add one above to get started!</p> /* Increased padding */
          ) : (
             tasks.map((task) => (
              <Card key={task.id} className={`flex items-center p-3 justify-between border-l-4 ${getPriorityColor(task.priority)} ${task.completed ? 'opacity-60 bg-muted/30' : ''} hover:shadow-md transition-shadow duration-200 flex-wrap sm:flex-nowrap`}> {/* Added flex-wrap */}
                <div className="flex items-center gap-3 flex-grow mr-2 overflow-hidden w-full sm:w-auto mb-2 sm:mb-0"> {/* Responsive width and margin */}
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    aria-labelledby={`task-label-${task.id}`}
                    className="flex-shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden min-w-0"> {/* Ensure text container doesn't overflow */}
                    <span id={`task-label-${task.id}`} className={`font-medium break-words ${task.completed ? 'line-through' : ''}`}>{task.taskName}</span> {/* Allow words to break */}
                    <span className="text-xs text-muted-foreground mt-1"> {/* Added margin-top */}
                      {task.subject} - {task.deadline ? format(task.deadline, 'MMM d, yyyy') : 'No deadline'} - P: {task.priority} {/* Abbreviated priority */}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 justify-end w-full sm:w-auto"> {/* Justify end on small screens */}
                   <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => startEditing(task)} aria-label={`Edit task ${task.taskName}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {editingTask && editingTask.id === task.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Task Name
                              </Label>
                              <Input id="edit-name" value={editingTask.taskName} onChange={(e) => setEditingTask({...editingTask, taskName: e.target.value})} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-subject" className="text-right">
                                Subject
                              </Label>
                              <Input id="edit-subject" value={editingTask.subject} onChange={(e) => setEditingTask({...editingTask, subject: e.target.value})} className="col-span-3" />
                             </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-priority" className="text-right">
                                Priority
                              </Label>
                              <Select value={editingTask.priority} onValueChange={(value: string) => setEditingTask({...editingTask, priority: value as Priority})}>
                                <SelectTrigger id="edit-priority" className="col-span-3">
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-deadline" className="text-right">
                                Deadline
                              </Label>
                               <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      id="edit-deadline"
                                      variant={"outline"}
                                      className={cn(
                                        "col-span-3 justify-start text-left font-normal",
                                        !editingTask.deadline && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIconLucide className="mr-2 h-4 w-4" /> {/* Use renamed import */}
                                      {editingTask.deadline ? format(editingTask.deadline, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={editingTask.deadline ?? undefined}
                                      onSelect={(date) => setEditingTask({...editingTask!, deadline: date || null})}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                             </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                               <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={saveEdit}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                   </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-destructive hover:text-destructive/90" aria-label={`Delete task ${task.taskName}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
             ))
           )}

        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground mt-6"> {/* Added margin-top */}
         {tasks.filter(task => !task.completed).length} tasks remaining.
      </CardFooter>
    </Card>
  );
}

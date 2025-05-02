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
import { Trash2, Edit, Plus, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
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
  { id: '1', taskName: 'Read Chapter 3', deadline: new Date(2024, 6, 25), subject: 'History', priority: 'High', completed: false },
  { id: '2', taskName: 'Complete Math Assignment', deadline: new Date(2024, 6, 27), subject: 'Math', priority: 'Medium', completed: false },
  { id: '3', taskName: 'Practice French Verbs', deadline: null, subject: 'French', priority: 'Low', completed: true },
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
         setTasks(parsedTasks);
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
    localStorage.setItem('studyZenTasks', JSON.stringify(tasks));
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
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
     const updatedTask = tasks.find(task => task.id === id);
     if (updatedTask) {
       toast({
         title: `Task ${updatedTask.completed ? 'marked as incomplete' : 'completed'}`,
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
        return 'border-l-accent'; // Use accent color for medium
      case 'Low':
        return 'border-l-secondary'; // Use secondary color for low
      default:
        return 'border-l-muted';
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">My Tasks</CardTitle>
        <CardDescription>Manage your assignments and study goals.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add Task Form */}
        <div className="flex flex-col md:flex-row gap-2 mb-6 p-4 border rounded-lg bg-muted/50">
          <Input
            type="text"
            placeholder="New Task Name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-grow"
            aria-label="New Task Name"
          />
          <Input
            type="text"
            placeholder="Subject"
            value={newTaskSubject}
            onChange={(e) => setNewTaskSubject(e.target.value)}
            className="md:w-1/4"
             aria-label="New Task Subject"
          />
          <Select value={newTaskPriority} onValueChange={(value: string) => setNewTaskPriority(value as Priority)}>
            <SelectTrigger className="md:w-[130px]" aria-label="New Task Priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
           <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "md:w-[180px] justify-start text-left font-normal",
                    !newTaskDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
          <Button onClick={addTask} aria-label="Add New Task">
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
          ) : (
             tasks.map((task) => (
              <Card key={task.id} className={`flex items-center p-3 justify-between border-l-4 ${getPriorityColor(task.priority)} ${task.completed ? 'opacity-60 bg-muted/30' : ''} hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-center gap-3 flex-grow mr-2 overflow-hidden">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    aria-labelledby={`task-label-${task.id}`}
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span id={`task-label-${task.id}`} className={`font-medium truncate ${task.completed ? 'line-through' : ''}`}>{task.taskName}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.subject} - {task.deadline ? format(task.deadline, 'MMM d') : 'No deadline'} - Priority: {task.priority}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
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
                              <Label htmlFor="name" className="text-right">
                                Task Name
                              </Label>
                              <Input id="name" value={editingTask.taskName} onChange={(e) => setEditingTask({...editingTask, taskName: e.target.value})} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="subject" className="text-right">
                                Subject
                              </Label>
                              <Input id="subject" value={editingTask.subject} onChange={(e) => setEditingTask({...editingTask, subject: e.target.value})} className="col-span-3" />
                             </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="priority" className="text-right">
                                Priority
                              </Label>
                              <Select value={editingTask.priority} onValueChange={(value: string) => setEditingTask({...editingTask, priority: value as Priority})}>
                                <SelectTrigger className="col-span-3">
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
                                <Label htmlFor="deadline" className="text-right">
                                Deadline
                              </Label>
                               <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "col-span-3 justify-start text-left font-normal",
                                        !editingTask.deadline && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
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
      <CardFooter className="text-sm text-muted-foreground">
         {tasks.filter(task => !task.completed).length} tasks remaining.
      </CardFooter>
    </Card>
  );
}

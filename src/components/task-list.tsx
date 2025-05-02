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
import { Confetti } from '@/components/confetti'; // Import the Confetti component

type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  taskName: string;
  deadline: Date | null;
  subject: string;
  priority: Priority;
  completed: boolean;
}


export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]); // Initialize with empty array
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState<Date | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // Track client mount
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti

  // Load tasks from local storage on mount
  useEffect(() => {
     setIsClient(true); // Now we are on the client
    const storedTasks = localStorage.getItem('studyZenTasks');
    if (storedTasks) {
      try {
         const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
           ...task,
           deadline: task.deadline ? new Date(task.deadline) : null,
         }));
         // Set tasks from storage if valid, otherwise keep empty
         setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
       } catch (error) {
         console.error("Failed to parse tasks from local storage:", error);
         setTasks([]); // Fallback to empty array if parsing fails
         localStorage.removeItem('studyZenTasks'); // Optional: remove invalid data
       }
    } else {
        setTasks([]); // Initialize with empty array if nothing in storage
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    // Only save on the client side after the initial load
    if (isClient) {
        localStorage.setItem('studyZenTasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);


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
    let taskCompleted = false;
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        if (!task.completed) { // Only trigger confetti if marking as complete
             taskCompleted = true;
           }
        return { ...task, completed: !task.completed };
      }
      return task;
     });

    setTasks(updatedTasks);

     const updatedTask = updatedTasks.find(task => task.id === id);
     if (updatedTask) {
       toast({
         title: `Task ${updatedTask.completed ? 'completed!' : 'marked as incomplete'}`, // Adjusted message
         description: `"${updatedTask.taskName}" status updated.`,
       });

       // Trigger confetti if the task was just marked as complete
       if (taskCompleted) {
         setShowConfetti(true);
         // Hide confetti after a short duration
         setTimeout(() => setShowConfetti(false), 4000); // Show confetti for 4 seconds
       }
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
        return 'border-l-red'; // Use theme red
      case 'Medium':
        return 'border-l-orange'; // Use theme orange
      case 'Low':
        return 'border-l-green'; // Use theme green
      default:
        return 'border-l-muted';
    }
  };


  return (
    <Card className="w-full shadow-lg relative overflow-hidden"> {/* Added relative and overflow-hidden */}
      {/* Conditionally render confetti */}
      {showConfetti && <Confetti />}

      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">My Tasks</CardTitle>
        <CardDescription>Manage your assignments and study goals. Add tasks using the form below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Increased spacing */}
        {/* Add Task Form - Using Grid for better wrapping control */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 p-4 border rounded-lg bg-muted/50 items-end">
           <div className="sm:col-span-2 lg:col-span-1"> {/* Task Name */}
             <Label htmlFor="new-task-name">Task Name</Label>
             <Input
               id="new-task-name"
               type="text"
               placeholder="New Task Name"
               value={newTaskName}
               onChange={(e) => setNewTaskName(e.target.value)}
               className="w-full transition-shadow duration-200 focus:shadow-outline-primary" // Added focus shadow
               aria-label="New Task Name"
             />
           </div>
           <div> {/* Subject */}
             <Label htmlFor="new-task-subject">Subject</Label>
             <Input
               id="new-task-subject"
               type="text"
               placeholder="Subject"
               value={newTaskSubject}
               onChange={(e) => setNewTaskSubject(e.target.value)}
               className="w-full transition-shadow duration-200 focus:shadow-outline-primary" // Added focus shadow
               aria-label="New Task Subject"
             />
           </div>
           <div> {/* Priority */}
             <Label htmlFor="new-task-priority">Priority</Label>
             <Select value={newTaskPriority} onValueChange={(value: string) => setNewTaskPriority(value as Priority)}>
               <SelectTrigger id="new-task-priority" className="w-full transition-shadow duration-200 focus:shadow-outline-primary" aria-label="New Task Priority"> {/* Added focus shadow */}
                 <SelectValue placeholder="Priority" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="High">High</SelectItem>
                 <SelectItem value="Medium">Medium</SelectItem>
                 <SelectItem value="Low">Low</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div> {/* Deadline */}
             <Label htmlFor="new-task-deadline">Deadline</Label>
             <Popover>
                 <PopoverTrigger asChild>
                   <Button
                     id="new-task-deadline"
                     variant={"outline"}
                     className={cn(
                       "w-full justify-start text-left font-normal transition-colors duration-200 hover:border-primary", // Enhanced hover
                       !newTaskDeadline && "text-muted-foreground"
                     )}
                   >
                     <CalendarIconLucide className="mr-2 h-4 w-4" />
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
           <div className="sm:col-span-2 lg:col-span-1 flex items-end"> {/* Add Button - Adjust span for alignment */}
             <Button onClick={addTask} aria-label="Add New Task" className="w-full"> {/* Hover effect from button.tsx */}
               <Plus className="h-4 w-4 mr-1" /> Add Task
             </Button>
           </div>
         </div>

        {/* Task List */}
        <div className="space-y-4"> {/* Increased spacing between tasks */}
          {tasks.length === 0 && isClient ? ( // Only show 'No tasks' after client has loaded
             <p className="text-center text-muted-foreground py-8">No tasks yet. Add one above to get started!</p> /* Increased padding */
          ) : (
             tasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                    `flex items-center p-3 justify-between border-l-4 ${getPriorityColor(task.priority)} flex-wrap sm:flex-nowrap transition-all duration-300 ease-in-out`,
                    task.completed ? 'opacity-60 bg-muted/30' : 'bg-card hover:shadow-lg hover:border-primary/50 hover:scale-[1.01]' // Enhanced hover for non-completed
                )}
              >
                <div className="flex items-center gap-3 flex-grow mr-2 overflow-hidden w-full sm:w-auto mb-2 sm:mb-0"> {/* Responsive width and margin */}
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    aria-labelledby={`task-label-${task.id}`}
                    className="flex-shrink-0 transition-transform duration-200 hover:scale-110" // Hover effect for checkbox
                  />
                  <div className="flex flex-col overflow-hidden min-w-0"> {/* Ensure text container doesn't overflow */}
                    <span id={`task-label-${task.id}`} className={`font-medium break-words ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.taskName}</span> {/* Dim completed text */}
                    <span className="text-xs text-muted-foreground mt-1"> {/* Added margin-top */}
                      {task.subject} - {task.deadline ? format(task.deadline, 'MMM d, yyyy') : 'No deadline'} - P: {task.priority} {/* Abbreviated priority */}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 justify-end w-full sm:w-auto"> {/* Justify end on small screens */}
                   <Dialog open={editingTask?.id === task.id} onOpenChange={(isOpen) => !isOpen && cancelEdit()}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => startEditing(task)} aria-label={`Edit task ${task.taskName}`} className="hover:bg-accent rounded-full"> {/* Enhanced hover */}
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {editingTask && editingTask.id === task.id && ( // Conditionally render content only when needed
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Task Name
                              </Label>
                              <Input id="edit-name" value={editingTask.taskName} onChange={(e) => setEditingTask({...editingTask!, taskName: e.target.value})} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-subject" className="text-right">
                                Subject
                              </Label>
                              <Input id="edit-subject" value={editingTask.subject} onChange={(e) => setEditingTask({...editingTask!, subject: e.target.value})} className="col-span-3" />
                             </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-priority" className="text-right">
                                Priority
                              </Label>
                              <Select value={editingTask.priority} onValueChange={(value: string) => setEditingTask({...editingTask!, priority: value as Priority})}>
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
                             {/* Updated to handle DialogClose properly */}
                            <Button onClick={saveEdit}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                   </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 rounded-full" aria-label={`Delete task ${task.taskName}`}> {/* Enhanced hover */}
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
             ))
           )}
          {/* Loading state indicator if needed */}
          {!isClient && (
               <div className="text-center text-muted-foreground py-8">Loading tasks...</div>
           )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground mt-6"> {/* Added margin-top */}
         {tasks.filter(task => !task.completed).length} task{tasks.filter(task => !task.completed).length !== 1 ? 's' : ''} remaining.
      </CardFooter>
    </Card>
  );
}

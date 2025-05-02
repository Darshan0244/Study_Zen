'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings, Minus, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const WORK_MINUTES_DEFAULT = 25;
const SHORT_BREAK_MINUTES_DEFAULT = 5;
const LONG_BREAK_MINUTES_DEFAULT = 15;
const SESSIONS_BEFORE_LONG_BREAK = 4;

export function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(WORK_MINUTES_DEFAULT);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(SHORT_BREAK_MINUTES_DEFAULT);
  const [longBreakMinutes, setLongBreakMinutes] = useState(LONG_BREAK_MINUTES_DEFAULT);

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Start as null
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
   const [isClient, setIsClient] = useState(false); // State to track client-side mount


   // Load settings and initialize timer on client-side mount
   useEffect(() => {
    setIsClient(true); // Component has mounted on the client

     const savedWork = localStorage.getItem('pomodoroWorkMinutes');
     const savedShort = localStorage.getItem('pomodoroShortBreakMinutes');
     const savedLong = localStorage.getItem('pomodoroLongBreakMinutes');
     const savedSessions = localStorage.getItem('pomodoroSessionsCompleted');

     const currentWorkMin = savedWork ? parseInt(savedWork, 10) : WORK_MINUTES_DEFAULT;
     setWorkMinutes(currentWorkMin);
     setShortBreakMinutes(savedShort ? parseInt(savedShort, 10) : SHORT_BREAK_MINUTES_DEFAULT);
     setLongBreakMinutes(savedLong ? parseInt(savedLong, 10) : LONG_BREAK_MINUTES_DEFAULT);
     setSessionsCompleted(savedSessions ? parseInt(savedSessions, 10) : 0);

     // Set initial timeLeft only after loading settings
     setTimeLeft(currentWorkMin * 60);

     // Preload audio only on the client
     if (typeof window !== "undefined") {
       audioRef.current = new Audio('/sounds/timer-end.mp3'); // Ensure you have this sound file in public/sounds
        if (audioRef.current) {
            audioRef.current.load();
         }
     }

   }, []);

   // Save settings and session count to local storage
   const saveSettings = () => {
       localStorage.setItem('pomodoroWorkMinutes', workMinutes.toString());
       localStorage.setItem('pomodoroShortBreakMinutes', shortBreakMinutes.toString());
       localStorage.setItem('pomodoroLongBreakMinutes', longBreakMinutes.toString());
       localStorage.setItem('pomodoroSessionsCompleted', sessionsCompleted.toString());

       // Update timer if not active and matches the mode being saved
       if (!isActive) {
           if (mode === 'work') setTimeLeft(workMinutes * 60);
           else if (mode === 'shortBreak') setTimeLeft(shortBreakMinutes * 60);
           else if (mode === 'longBreak') setTimeLeft(longBreakMinutes * 60);
       }
       toast({ title: "Settings Saved", description: "Pomodoro timer settings updated." });
   };

    // Update session count in local storage whenever it changes
    useEffect(() => {
        if (isClient) { // Only run on client
            localStorage.setItem('pomodoroSessionsCompleted', sessionsCompleted.toString());
        }
    }, [sessionsCompleted, isClient]);


  const switchMode = useCallback(() => {
    setIsActive(false);
    let nextMode: TimerMode;
    let nextTime: number;
    let notificationTitle = "";
    let notificationDescription = "";
    let newSessionsCompleted = sessionsCompleted;


    if (mode === 'work') {
        newSessionsCompleted = sessionsCompleted + 1;
         setSessionsCompleted(newSessionsCompleted);
      if (newSessionsCompleted > 0 && newSessionsCompleted % SESSIONS_BEFORE_LONG_BREAK === 0) {
        nextMode = 'longBreak';
        nextTime = longBreakMinutes * 60;
        notificationTitle = "Long Break Time!";
        notificationDescription = `Take a ${longBreakMinutes}-minute break. You've earned it!`;
      } else {
        nextMode = 'shortBreak';
        nextTime = shortBreakMinutes * 60;
        notificationTitle = "Short Break Time!";
        notificationDescription = `Take a quick ${shortBreakMinutes}-minute break.`;
      }
    } else {
      nextMode = 'work';
      nextTime = workMinutes * 60;
      notificationTitle = "Back to Work!";
      notificationDescription = `Time for a ${workMinutes}-minute focus session.`;
    }

    setMode(nextMode);
    setTimeLeft(nextTime);
    toast({ title: notificationTitle, description: notificationDescription });

    // Play sound notification only on client
     if (isClient && audioRef.current) {
       audioRef.current.play().catch(error => console.error("Audio play failed:", error));
     }

    // Request notification permission and show notification if granted (only on client)
    if (isClient && 'Notification' in window) {
       Notification.requestPermission().then(permission => {
         if (permission === 'granted') {
           // Ensure you have this icon in public/icons
           new Notification(notificationTitle, { body: notificationDescription, icon: '/icons/zen-icon.png' });
         }
       });
     }

  }, [mode, sessionsCompleted, workMinutes, shortBreakMinutes, longBreakMinutes, toast, isClient]); // Added isClient dependency


  useEffect(() => {
      if (!isClient) return; // Don't run timer logic on server

    if (isActive && timeLeft !== null && timeLeft > 0) { // Check timeLeft > 0
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
           if (prevTime === null || prevTime <= 1) { // Check prevTime <= 1
             clearInterval(intervalRef.current!);
             switchMode();
             return 0; // Return 0 when switching modes
           }
          return prevTime - 1;
        });
      }, 1000);
     } else if (timeLeft === 0 && isActive) { // Handle case where timer reaches 0
        switchMode();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
   }, [isActive, timeLeft, switchMode, isClient]); // Added timeLeft and isClient


  const toggleTimer = () => {
      if (!isClient) return; // Guard against server-side interaction

      // Prevent starting if timeLeft is null or 0
       if (!isActive && (timeLeft === null || timeLeft <= 0)) {
           resetTimer(); // Optionally reset if trying to start at 0
           return;
       }

    setIsActive(!isActive);
     if (!isActive && timeLeft !== null && timeLeft > 0 && 'Notification' in window) {
       Notification.requestPermission(); // Request permission when starting
     }
  };

  const resetTimer = () => {
      if (!isClient) return; // Guard against server-side interaction

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    let resetTime: number;
    switch (mode) {
        case 'work': resetTime = workMinutes * 60; break;
        case 'shortBreak': resetTime = shortBreakMinutes * 60; break;
        case 'longBreak': resetTime = longBreakMinutes * 60; break;
        default: resetTime = workMinutes * 60; // Default case
    }
    setTimeLeft(resetTime);
    toast({ title: "Timer Reset", description: `Timer reset to ${mode} mode.` });
  };

  const formatTime = (seconds: number | null): string => {
      if (seconds === null || !isClient) return '--:--'; // Placeholder if null or on server
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = (): number => {
     switch (mode) {
         case 'work': return workMinutes * 60;
         case 'shortBreak': return shortBreakMinutes * 60;
         case 'longBreak': return longBreakMinutes * 60;
         default: return workMinutes * 60; // Default case
     }
  };

  const progressPercentage = (): number => {
      if (timeLeft === null || !isClient) return 0; // Return 0 if null or on server
    const duration = totalDuration();
    if (duration === 0) return 0; // Avoid division by zero
    return Math.max(0, Math.min(100, ((duration - timeLeft) / duration) * 100)); // Clamp between 0 and 100
  };

   const changeTimeSetting = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
       if (!isClient) return; // Guard
      const newValue = Math.max(1, Math.min(120, value || 1)); // Clamp between 1 and 120 minutes, default to 1 if NaN
      setter(newValue);
   };


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Pomodoro Timer</CardTitle>
        <CardDescription>Stay focused and take effective breaks.</CardDescription>
        <div className="flex flex-wrap justify-center gap-2 mt-4"> {/* Added flex-wrap */}
            <Button variant={mode === 'work' ? 'default' : 'outline'} size="sm" onClick={() => { if(isClient) { setMode('work'); setTimeLeft(workMinutes * 60); setIsActive(false); } }}>Work</Button>
            <Button variant={mode === 'shortBreak' ? 'default' : 'outline'} size="sm" onClick={() => { if(isClient) { setMode('shortBreak'); setTimeLeft(shortBreakMinutes * 60); setIsActive(false); } }}>Short Break</Button>
            <Button variant={mode === 'longBreak' ? 'default' : 'outline'} size="sm" onClick={() => { if(isClient) { setMode('longBreak'); setTimeLeft(longBreakMinutes * 60); setIsActive(false); } }}>Long Break</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8 pt-4"> {/* Increased gap and padding */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56"> {/* Slightly larger on small screens */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
             <circle
               className="text-muted"
               strokeWidth="5"
               stroke="currentColor"
               fill="transparent"
               r="45"
               cx="50"
               cy="50"
             />
             <circle
               className="text-primary transition-all duration-1000 ease-linear" // Added transition
               strokeWidth="5"
               strokeDasharray={2 * Math.PI * 45}
               strokeDashoffset={(2 * Math.PI * 45) * (1 - progressPercentage() / 100)}
               strokeLinecap="round"
               stroke="currentColor"
               fill="transparent"
               r="45"
               cx="50"
               cy="50"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl font-mono font-bold text-foreground">
            {formatTime(timeLeft)}
          </div>
        </div>
        {/* Optional: Add progress bar back if needed */}
        {/* <Progress value={progressPercentage()} className="w-full h-2 mt-4" /> */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4"> {/* Added flex-wrap and adjusted gap */}
          <Button onClick={toggleTimer} size="lg" className="min-w-[120px]" aria-label={isActive ? 'Pause Timer' : 'Start Timer'}>
            {isActive ? <Pause className="h-6 w-6 mr-1" /> : <Play className="h-6 w-6 mr-1" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg" aria-label="Reset Timer">
            <RotateCcw className="h-5 w-5" />
          </Button>
           <Dialog>
             <DialogTrigger asChild>
                <Button variant="outline" size="lg" aria-label="Timer Settings">
                    <Settings className="h-5 w-5" />
                </Button>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Timer Settings</DialogTitle>
               </DialogHeader>
                <div className="grid gap-4 py-4">
                   <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="work-duration" className="text-right">Work (min)</Label> {/* Added text-right */}
                    <Input id="work-duration" type="number" value={workMinutes} onChange={(e) => changeTimeSetting(setWorkMinutes, parseInt(e.target.value))} className="col-span-2" min="1" max="120"/>
                  </div>
                   <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="short-break-duration" className="text-right">Short Break</Label> {/* Added text-right */}
                     <Input id="short-break-duration" type="number" value={shortBreakMinutes} onChange={(e) => changeTimeSetting(setShortBreakMinutes, parseInt(e.target.value))} className="col-span-2" min="1" max="120"/>
                  </div>
                   <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="long-break-duration" className="text-right">Long Break</Label> {/* Added text-right */}
                     <Input id="long-break-duration" type="number" value={longBreakMinutes} onChange={(e) => changeTimeSetting(setLongBreakMinutes, parseInt(e.target.value))} className="col-span-2" min="1" max="120"/>
                   </div>
                </div>
               <DialogFooter>
                    <DialogClose asChild>
                       <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Removed DialogClose wrapper around save button to prevent premature closing if save fails */}
                    <Button onClick={() => { saveSettings(); /* Optionally close here if save is guaranteed */ }}>Save Settings</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground mt-4"> {/* Added margin-top */}
        Sessions Completed Today: {sessionsCompleted}
      </CardFooter>
    </Card>
  );
}

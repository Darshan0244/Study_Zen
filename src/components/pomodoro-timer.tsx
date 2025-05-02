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
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load settings from local storage on mount
   useEffect(() => {
     const savedWork = localStorage.getItem('pomodoroWorkMinutes');
     const savedShort = localStorage.getItem('pomodoroShortBreakMinutes');
     const savedLong = localStorage.getItem('pomodoroLongBreakMinutes');

     setWorkMinutes(savedWork ? parseInt(savedWork, 10) : WORK_MINUTES_DEFAULT);
     setShortBreakMinutes(savedShort ? parseInt(savedShort, 10) : SHORT_BREAK_MINUTES_DEFAULT);
     setLongBreakMinutes(savedLong ? parseInt(savedLong, 10) : LONG_BREAK_MINUTES_DEFAULT);
     // Set initial timeLeft based on potentially loaded workMinutes
     setTimeLeft((savedWork ? parseInt(savedWork, 10) : WORK_MINUTES_DEFAULT) * 60);

     // Preload audio
     if (typeof window !== "undefined") {
       audioRef.current = new Audio('/sounds/timer-end.mp3'); // Ensure you have this sound file
       audioRef.current.load();
     }

   }, []);

   // Save settings to local storage
   const saveSettings = () => {
       localStorage.setItem('pomodoroWorkMinutes', workMinutes.toString());
       localStorage.setItem('pomodoroShortBreakMinutes', shortBreakMinutes.toString());
       localStorage.setItem('pomodoroLongBreakMinutes', longBreakMinutes.toString());
       // Update timer if not active and in work mode
       if (!isActive && mode === 'work') {
            setTimeLeft(workMinutes * 60);
       }
       toast({ title: "Settings Saved", description: "Pomodoro timer settings updated." });
   };


  const switchMode = useCallback(() => {
    setIsActive(false);
    let nextMode: TimerMode;
    let nextTime: number;
    let notificationTitle = "";
    let notificationDescription = "";

    if (mode === 'work') {
        const newSessionsCompleted = sessionsCompleted + 1;
         setSessionsCompleted(newSessionsCompleted);
      if (newSessionsCompleted % SESSIONS_BEFORE_LONG_BREAK === 0) {
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

    // Play sound notification
     if (audioRef.current) {
       audioRef.current.play().catch(error => console.error("Audio play failed:", error));
     }

    // Request notification permission and show notification if granted
    if ('Notification' in window) {
       Notification.requestPermission().then(permission => {
         if (permission === 'granted') {
           new Notification(notificationTitle, { body: notificationDescription, icon: '/icons/zen-icon.png' }); // Ensure you have this icon
         }
       });
     }

  }, [mode, sessionsCompleted, workMinutes, shortBreakMinutes, longBreakMinutes, toast]);


  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            switchMode();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
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
  }, [isActive, switchMode]);


  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    let resetTime: number;
    switch (mode) {
        case 'work': resetTime = workMinutes * 60; break;
        case 'shortBreak': resetTime = shortBreakMinutes * 60; break;
        case 'longBreak': resetTime = longBreakMinutes * 60; break;
    }
    setTimeLeft(resetTime);
    toast({ title: "Timer Reset", description: `Timer reset to ${mode} mode.` });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = (): number => {
     switch (mode) {
         case 'work': return workMinutes * 60;
         case 'shortBreak': return shortBreakMinutes * 60;
         case 'longBreak': return longBreakMinutes * 60;
     }
  };

  const progressPercentage = (): number => {
    const duration = totalDuration();
    if (duration === 0) return 0; // Avoid division by zero
    return ((duration - timeLeft) / duration) * 100;
  };

   const changeTimeSetting = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
      const newValue = Math.max(1, Math.min(120, value)); // Clamp between 1 and 120 minutes
      setter(newValue);
   };


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Pomodoro Timer</CardTitle>
        <CardDescription>Stay focused and take effective breaks.</CardDescription>
        <div className="flex justify-center gap-2 mt-4">
            <Button variant={mode === 'work' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('work'); setTimeLeft(workMinutes * 60); setIsActive(false); }}>Work</Button>
            <Button variant={mode === 'shortBreak' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('shortBreak'); setTimeLeft(shortBreakMinutes * 60); setIsActive(false); }}>Short Break</Button>
            <Button variant={mode === 'longBreak' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('longBreak'); setTimeLeft(longBreakMinutes * 60); setIsActive(false); }}>Long Break</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative w-48 h-48">
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
               className="text-primary"
               strokeWidth="5"
               strokeDasharray="283" // 2 * PI * 45
               strokeDashoffset={283 - (progressPercentage() / 100) * 283}
               strokeLinecap="round"
               stroke="currentColor"
               fill="transparent"
               r="45"
               cx="50"
               cy="50"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-5xl font-mono font-bold text-foreground">
            {formatTime(timeLeft)}
          </div>
        </div>
        {/* <Progress value={progressPercentage()} className="w-full h-2" /> */}
        <div className="flex gap-4">
          <Button onClick={toggleTimer} size="lg" className="w-24" aria-label={isActive ? 'Pause Timer' : 'Start Timer'}>
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
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
                    <Label htmlFor="work-duration">Work (min)</Label>
                    <Input id="work-duration" type="number" value={workMinutes} onChange={(e) => changeTimeSetting(setWorkMinutes, parseInt(e.target.value))} className="col-span-2" min="1" max="120"/>
                  </div>
                   <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="short-break-duration">Short Break (min)</Label>
                     <Input id="short-break-duration" type="number" value={shortBreakMinutes} onChange={(e) => changeTimeSetting(setShortBreakMinutes, parseInt(e.target.value))} className="col-span-2" min="1" max="120"/>
                  </div>
                   <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="long-break-duration">Long Break (min)</Label>
                     <Input id="long-break-duration" type="number" value={longBreakMinutes} onChange={(e) => changeTimeSetting(setLongBreakMinutes, parseInt(e.target.value))} className="col-span-2" min="1" max="120"/>
                   </div>
                </div>
               <DialogFooter>
                    <DialogClose asChild>
                       <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                       <Button onClick={saveSettings}>Save Settings</Button>
                    </DialogClose>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        Sessions Completed: {sessionsCompleted}
      </CardFooter>
    </Card>
  );
}

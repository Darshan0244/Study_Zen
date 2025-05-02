// Fix: Corrected 'use client' syntax
'use client';

import * as React from "react";
import { Moon, Sun, BookOpen } from "lucide-react"; // Added BookOpen for Sepia
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme(); // Get current theme

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
           {/* Conditionally render icon based on theme */}
           {/* Ensure only one icon shows at a time based on the current theme */}
           {theme === 'dark' ? (
             <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
           ) : theme === 'sepia' ? (
              <BookOpen className="h-[1.2rem] w-[1.2rem] transition-all" />
           ) : (
             <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
           )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
           <Sun className="mr-2 h-4 w-4" /> {/* Add icon */}
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
           <Moon className="mr-2 h-4 w-4" /> {/* Add icon */}
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sepia")}>
           <BookOpen className="mr-2 h-4 w-4" /> {/* Add icon */}
          Sepia
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => setTheme("system")}>
           {/* Consider adding a 'System' icon, e.g., Laptop */}
           {/* <Laptop className="mr-2 h-4 w-4" /> */}
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

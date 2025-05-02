'use client';

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react"; // Removed BookOpen, Added Laptop for System
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
           ) : ( // Default to Sun icon for light and system themes
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
         {/* Removed Sepia option */}
         <DropdownMenuItem onClick={() => setTheme("system")}>
           <Laptop className="mr-2 h-4 w-4" /> {/* Add icon for System */}
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

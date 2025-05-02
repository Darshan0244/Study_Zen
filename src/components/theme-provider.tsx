'use client';

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

// Define the themes we explicitly support
const supportedThemes = ["light", "dark", "sepia", "system"];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
     <NextThemesProvider
        {...props}
        // Ensure only supported themes are passed, defaults to system if props.themes is undefined
        themes={props.themes ?? supportedThemes}
    >
        {children}
    </NextThemesProvider>
  )
}

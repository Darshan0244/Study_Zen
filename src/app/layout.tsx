
'use client'; // Add 'use client' because we need state and effects

import type { Metadata } from 'next';
import { Inter, Roboto_Mono, Permanent_Marker } from 'next/font/google'; // Import Permanent_Marker
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Footer } from "@/components/footer";
import { Preloader } from '@/components/preloader'; // Import the Preloader component
import { NotebookText } from 'lucide-react'; // Import the new icon

// Configure Inter font
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// Configure Roboto Mono font
const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

// Configure Permanent Marker font
const permanentMarker = Permanent_Marker({
    variable: '--font-permanent-marker',
    weight: '400', // Permanent Marker only has a 400 weight
    subsets: ['latin'],
});


// Cannot export metadata from a client component.
// If metadata is needed, it should be moved to a server component parent
// or handled differently. For now, removing it as layout needs to be client-side.
// export const metadata: Metadata = {
//   title: 'StudyZen - Your Productivity Planner',
//   description: 'Plan your tasks, track your study sessions, and boost your productivity.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timer to hide the preloader after 3.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          inter.variable,
          robotoMono.variable,
          permanentMarker.variable // Add permanent marker variable
        )}
      >
        {isLoading ? (
          <Preloader />
        ) : (
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
            <div className="relative flex flex-col flex-1">
               <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                  <div className="mr-4 flex items-center">
                    <a href="/" className="mr-6 flex items-center space-x-2">
                      {/* Replace SVG with NotebookText icon */}
                      <NotebookText className="h-6 w-6 text-primary"/>
                      <span className="font-bold sm:inline-block">
                        StudyZen
                      </span>
                    </a>
                  </div>
                  <ModeToggle />
                </div>
              </header>
              <main className="flex-1 container w-full py-6 md:py-10 px-4 md:px-6">{children}</main>
            </div>
            <Footer />
            <Toaster />
           </ThemeProvider>
        )}
      </body>
    </html>
  );
}


import type {Metadata} from 'next';
import { Inter, Roboto_Mono } from 'next/font/google'; // Import Inter and Roboto_Mono from next/font/google
import './globals.css';
import {cn} from '@/lib/utils';
import {Toaster} from '@/components/ui/toaster';
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

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

export const metadata: Metadata = {
  title: 'StudyZen - Your Productivity Planner',
  description: 'Plan your tasks, track your study sessions, and boost your productivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable, // Use Inter variable
          robotoMono.variable // Use Roboto Mono variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
             <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 flex items-center">
                  <a href="/" className="mr-6 flex items-center space-x-2">
                      {/* Replaced SVG with a simple icon representation */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2 C6.48 2 2 6.48 2 12 s4.48 10 10 10 10-4.48 10-10 S17.52 2 12 2 Z M12 18 c-3.31 0-6-2.69-6-6 s2.69-6 6-6 6 2.69 6 6 -2.69 6-6 6 Z M12 6 v6 l4 2"/></svg> {/* Simple clock/zen like icon */}
                      <span className="font-bold sm:inline-block">
                        StudyZen
                      </span>
                  </a>
                </div>
                <ModeToggle />
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
         </ThemeProvider>
      </body>
    </html>
  );
}

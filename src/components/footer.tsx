import React from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-4 md:px-8 border-t bg-background">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          &copy; {currentYear} StudyZen. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Darshan0244/Study_Zen" // Replace with your actual repo link
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/d-darshan-36077327a/" // Replace with your LinkedIn profile
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
           <a
            href="https://ddarshanportfolio.vercel.app/" // Replace with your portfolio link
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Developer Portfolio"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

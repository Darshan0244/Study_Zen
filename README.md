# 📝 StudyZen - Productivity Planner

StudyZen is a Next.js application designed to help students plan their tasks, manage their study sessions using a Pomodoro timer, track their progress with badges and insights, and generate personalized study plans with the help of AI.


![Screenshot 1](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20095114.png)
![Screenshot 2](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20095442.png)
![Screenshot 3](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20095501.png)
![Screenshot 4](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20095632.png)
![Screenshot 6](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20101215.png)
![Screenshot 7](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20101229.png)
![Screenshot 5](https://github.com/Darshan0244/Study_Zen/blob/57aa73f2f5215eed872dca33e1cec3ae02e7e341/Assets/Screenshot%202025-05-03%20095705.png)

## Features

*   **Task Management:** Add, edit, delete, and mark tasks as complete. Tasks can be assigned a subject, priority (High, Medium, Low), and deadline. Includes celebratory confetti on task completion.
*   **Pomodoro Timer:** A customizable Pomodoro timer with work, short break, and long break modes to enhance focus and manage study sessions effectively.
*   **AI Study Planner:** Leverages Google's Gemini AI (via Genkit) to analyze active tasks and generate a personalized day-by-day study schedule and actionable suggestions.
*   **Achievements & Badges:** Earn virtual badges for completing tasks, using the Pomodoro timer, and generating AI plans. Track your progress and milestones.
*   **Study Insights:** Get personalized feedback and tips based on your study habits and badge progress.
*   **Persistence:** Tasks, Pomodoro settings, and badge progress are saved in the browser's local storage.
*   **Responsive Design:** Fully responsive UI that works seamlessly on desktop and mobile devices.
*   **Theme Toggle:** Light and Dark mode support.
*   **Preloader:** Smooth loading experience with an initial preloader animation featuring a writing rabbit GIF and twinkling stars.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration:** [Google AI (Gemini) via Genkit](https://firebase.google.com/docs/genkit)
*   **State Management:** React Hooks (`useState`, `useEffect`) & Local Storage
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Date Handling:** [date-fns](https://date-fns.org/)
*   **Markdown Rendering:** [react-markdown](https://github.com/remarkjs/react-markdown)
*   **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)
*   **Language:** TypeScript

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm
*   A Google AI API Key (for the AI Planner feature)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd studyzen
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Google AI API key:
    ```.env.local
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
    ```
    *Note: You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    This command starts the Next.js development server (usually on `http://localhost:9002`).

5.  **(Optional) Run the Genkit development flow server:**
    If you want to interact with or test the Genkit flows directly (e.g., using the Genkit developer UI), run:
    ```bash
    npm run genkit:dev
    # or use watch mode
    npm run genkit:watch
    ```
    The Genkit UI will typically be available at `http://localhost:4000`. *Note: The Next.js app calls the AI flow directly as a server function, so running the Genkit server separately is usually only needed for debugging the flow itself.*

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

*   `src/app/`: Main application routes and layout (Next.js App Router).
*   `src/components/`: Reusable UI components (TaskList, PomodoroTimer, AiPlanner, BadgeDisplay, FeedbackDisplay, etc.).
    *   `src/components/ui/`: ShadCN UI components.
*   `src/ai/`: Genkit AI integration files.
    *   `src/ai/flows/`: Genkit flows (e.g., study plan generation).
    *   `src/ai/ai-instance.ts`: Genkit configuration.
*   `src/hooks/`: Custom React hooks (useToast, useBadges, useMobile).
*   `src/lib/`: Utility functions and badge definitions.
*   `public/`: Static assets (images, icons).
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `next.config.ts`: Next.js configuration.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

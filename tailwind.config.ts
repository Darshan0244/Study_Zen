import type { Config } from "tailwindcss";

export default {
    darkMode: ["class", '[class="sepia"]'], // Add 'sepia' class for theme targeting
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
            // Base color variables
             white: 'hsl(var(--white))',
             red: 'hsl(var(--red))',
             blue: 'hsl(var(--blue))',
             orange: 'hsl(var(--orange))',
             green: 'hsl(var(--green))',

             // Additional Colors mapped from CSS variables
             teal: 'hsl(var(--teal))',
             lavender: 'hsl(var(--lavender))',
             'gray-blue': 'hsl(var(--gray-blue))',
             gold: 'hsl(var(--gold))',
             coral: 'hsl(var(--coral))',
             'lime-green': 'hsl(var(--lime-green))',
             'sky-blue': 'hsl(var(--sky-blue))',
             rose: 'hsl(var(--rose))',
             'warm-gray': 'hsl(var(--warm-gray))',
             'off-white': 'hsl(var(--off-white))',
             stone: 'hsl(var(--stone))',

  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
                '6': 'hsl(var(--chart-6))', // Add chart colors
                '7': 'hsl(var(--chart-7))',
                '8': 'hsl(var(--chart-8))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
            // Add pulse-dot animation for preloader
            'pulse-dot': {
                '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                '50%': { opacity: '0.5', transform: 'scale(0.8)' },
            },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
            // Add pulse-dot animation utility
            'pulse-dot': 'pulse-dot 1.4s infinite ease-in-out both',
  		},
        // Add typography styles for markdown
        typography: ({ theme }: { theme: (key: string) => any }) => ({ // Need to type theme function
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.foreground / 0.9'),
              '--tw-prose-headings': theme('colors.foreground'),
              '--tw-prose-lead': theme('colors.muted.foreground'),
              '--tw-prose-links': theme('colors.primary'),
              '--tw-prose-bold': theme('colors.foreground'),
              '--tw-prose-counters': theme('colors.muted.foreground'),
              '--tw-prose-bullets': theme('colors.muted.foreground'),
              '--tw-prose-hr': theme('colors.border'),
              '--tw-prose-quotes': theme('colors.foreground'),
              '--tw-prose-quote-borders': theme('colors.border'),
              '--tw-prose-captions': theme('colors.muted.foreground'),
              '--tw-prose-code': theme('colors.foreground'),
              '--tw-prose-pre-code': theme('colors.foreground'), // Adjusted for dark mode
              '--tw-prose-pre-bg': theme('colors.muted / 0.5'), // Adjusted for dark mode
              '--tw-prose-th-borders': theme('colors.border'),
              '--tw-prose-td-borders': theme('colors.border'),
              '--tw-prose-invert-body': theme('colors.foreground'), // Inverted
              '--tw-prose-invert-headings': theme('colors.foreground'), // Inverted
              '--tw-prose-invert-lead': theme('colors.muted.foreground'), // Inverted
              '--tw-prose-invert-links': theme('colors.primary'), // Inverted
              '--tw-prose-invert-bold': theme('colors.foreground'), // Inverted
              '--tw-prose-invert-counters': theme('colors.muted.foreground'), // Inverted
              '--tw-prose-invert-bullets': theme('colors.muted.foreground'), // Inverted
              '--tw-prose-invert-hr': theme('colors.border'), // Inverted
              '--tw-prose-invert-quotes': theme('colors.foreground'), // Inverted
              '--tw-prose-invert-quote-borders': theme('colors.border'), // Inverted
              '--tw-prose-invert-captions': theme('colors.muted.foreground'), // Inverted
              '--tw-prose-invert-code': theme('colors.foreground'), // Inverted
              '--tw-prose-invert-pre-code': theme('colors.foreground'), // Inverted
              '--tw-prose-invert-pre-bg': theme('colors.muted / 0.7'), // Adjusted dark pre background
              '--tw-prose-invert-th-borders': theme('colors.border'), // Inverted
              '--tw-prose-invert-td-borders': theme('colors.border'), // Inverted
               h3: { // Specific styling for h3 in markdown
                fontSize: theme('fontSize.lg'), // Slightly smaller than default prose h3
                marginTop: theme('spacing.4'),
                marginBottom: theme('spacing.2'),
              },
              ul: {
                 marginTop: theme('spacing.2'),
                 marginBottom: theme('spacing.2'),
              },
               li: {
                 marginTop: theme('spacing.1'),
                 marginBottom: theme('spacing.1'),
              },
              p: { // Control paragraph margins if needed
                 marginTop: theme('spacing.2'),
                 marginBottom: theme('spacing.2'),
              }
            },
          },
           // Add sepia variant for prose
           sepia: {
             css: {
               '--tw-prose-body': 'hsl(var(--foreground))',
               '--tw-prose-headings': 'hsl(var(--foreground))',
               '--tw-prose-lead': 'hsl(var(--muted-foreground))',
               '--tw-prose-links': 'hsl(var(--primary))',
               '--tw-prose-bold': 'hsl(var(--foreground))',
               '--tw-prose-counters': 'hsl(var(--muted-foreground))',
               '--tw-prose-bullets': 'hsl(var(--muted-foreground))',
               '--tw-prose-hr': 'hsl(var(--border))',
               '--tw-prose-quotes': 'hsl(var(--foreground))',
               '--tw-prose-quote-borders': 'hsl(var(--border))',
               '--tw-prose-captions': 'hsl(var(--muted-foreground))',
               '--tw-prose-code': 'hsl(var(--foreground))',
               '--tw-prose-pre-code': 'hsl(var(--foreground))',
               '--tw-prose-pre-bg': 'hsl(var(--muted))',
               '--tw-prose-th-borders': 'hsl(var(--border))',
               '--tw-prose-td-borders': 'hsl(var(--border))',
               // Invert colors are not typically used with sepia, but define them if needed
               '--tw-prose-invert-body': 'hsl(var(--foreground))',
               // ... Add other invert variables if sepia needs dark mode variants
             },
           },
        }),
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")], // Add typography plugin
} satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6', // Blue-500
          DEFAULT: '#1E3A8A', // Blue-900 (Deep Corporate Blue)
          dark: '#172554', // Blue-950
        },
        secondary: {
          light: '#38BDF8',
          DEFAULT: '#0284C7', // Sky-600
          dark: '#0369A1',
        },
        accent: '#F59E0B',
        bg: {
          main: '#F1F5F9', // Slate-100 (More visible grey)
          card: '#FFFFFF',
        },
        text: {
          main: '#1E293B', // Slate-800
          muted: '#64748B', // Slate-500
          light: '#94A3B8', // Slate-400
        }
      },
      fontFamily: {
        sans: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

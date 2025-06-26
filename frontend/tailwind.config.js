/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New, more sophisticated color palette
        'background': '#0f172a', // Rich slate background
        'surface': '#1e293b',    // Surface color for cards
        'muted': '#334155',      // For borders and subtle elements
        'subtle': '#475569',      // For less important text or icons
        'text-primary': '#f8fafc',  // Clean, bright text
        'text-secondary': '#94a3b8',// For subtitles and descriptions
        'accent': {
          DEFAULT: '#38bdf8',      // A vibrant, modern blue
          hover: '#0ea5e9',
          focus: 'rgba(56, 189, 248, 0.4)',
        },
      },
      animation: {
        'background-pan': 'move-background 200s linear infinite',
      },
      keyframes: {
        'move-background': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(1000px, 1000px)' },
        }
      }
    },
  },
  plugins: [],
}
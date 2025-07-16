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
          50: '#f6f3ff',
          100: '#ede5ff',
          200: '#dcc8ff',
          300: '#c4a3ff',
          400: '#ab7aff',
          500: '#954eda', // Main primary color
          600: '#8144c5', // Darker shade for hover
          700: '#6d3aa6',
          800: '#5a3087',
          900: '#4a286d',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}
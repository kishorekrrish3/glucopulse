/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        metabolic: {
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          blue: '#0EA5E9',
          purple: '#8B5CF6'
        }
      }
    },
  },
  plugins: [],
}

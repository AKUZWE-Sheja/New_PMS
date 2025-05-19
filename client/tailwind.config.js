/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'error-red': 'var(--error-red)',
        'success-green': 'var(--success-green)',
        'warning-amber': 'var(--warning-amber)',
      },
    },
  },
  plugins: [],
}
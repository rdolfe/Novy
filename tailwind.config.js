/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2a2d30',
          lavender: '#a589bf',
        },
        secondary: {
          magenta: '#e395c8',
          teal: '#349b9e'
        },
        palette: {
          gray: '#7d8d8b',
          mint: '#c2e1d6',
          pink: '#efd9e6',
          lilac: '#b9afd7'
        }
      },
    },
  },
  plugins: [],
}
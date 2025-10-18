/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Include all Vue/JS files
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#6B7A8F",
        "background-light": "#F9F9F9",
        "background-dark": "#101922",
        "card-light": "#FEFEFE",
        "card-dark": "#1A242E",
        "text-primary-light": "#333333",
        "text-primary-dark": "#E0E0E0",
        "text-secondary-light": "#666666",
        "text-secondary-dark": "#A0AEC0",
        "border-light": "#E0E0E0",
        "border-dark": "#3A444E"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html',
     './src/**/*.{js,ts,jsx,tsx}',
      './src/styles.css', ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'Roboto', 'Open Sans', 'sans-serif'],
        georgia: ['Georgia', 'serif'],
        arial: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

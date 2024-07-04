/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'], // Example of adding a custom font
      },
      colors: {
        hoverpurple: '#5932EA',
        zinc: '#D9D9D9'
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}

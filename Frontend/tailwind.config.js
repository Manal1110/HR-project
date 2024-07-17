/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'], // Example of adding a custom font
      },
      colors: {
        hoverpurple: '#5932EA',
        zinc: '#D9D9D9',
        lightpurple: '#EFEFFC',
        midpurple: '#E7E7FF',
        darkpurple: '#01008A',
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Updated to use 'class'
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'], // Custom font
      },
      colors: {
        hoverpurple: '#5932EA',
        zinc: '#D9D9D9',
        lightpurple: '#EFEFFC',
        midpurple: '#E7E7FF',
        darkpurple: '#01008A',
        iconb: '#5A639C',
        iconf: '#FB9AD1'
        
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.8s ease-in-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

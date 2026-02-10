/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'brand-light': '#8ECAE6',
        'brand-blue': '#219EBC',
        'brand-dark': '#023047',
        'brand-yellow': '#FFB703',
        'brand-orange': '#FB8500',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

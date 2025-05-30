/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#4f46e5",
        brandLight: "#e0e7ff",
        brandDark: "#121827",   // a darker background for deep dark mode
        brandGrayLight: "#f3f4f6",
        brandGrayDark: "#374151",
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'colors': 'background-color, border-color, color, fill, stroke',
        'opacity-transform': 'opacity, transform',
      },
    },
  },
  plugins: [
    forms,
  ],
};

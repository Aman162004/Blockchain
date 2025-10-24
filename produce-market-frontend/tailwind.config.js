/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e5efff',
          200: '#cddbff',
          300: '#a8c0ff',
          400: '#7a9aff',
          500: '#5775ff',
          600: '#3b51ff',
          700: '#2f3fe6',
          800: '#2633ba',
          900: '#1f2a96',
        },
        neon: '#00F0FF',
        darkbg: '#0b1020',
        darkcard: '#101736',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.4)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

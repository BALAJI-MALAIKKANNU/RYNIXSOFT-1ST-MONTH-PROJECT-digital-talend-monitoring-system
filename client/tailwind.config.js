/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: '#0d2137',
        accent: '#378ADD',
        success: '#1D9E75',
        warning: '#BA7517',
        danger: '#E24B4A',
        muted: '#6B7280',
        surface: '#F9FAFB',
        surfaceDark: '#1A1F2E',
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite'
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 }
        }
      }
    },
  },
  plugins: [forms],
}

const sharedConfig = require('@repo/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...sharedConfig.theme?.extend,
      colors: {
        ...sharedConfig.theme?.extend?.colors,
        hk: {
          primary: '#4F46E5',
          secondary: '#FF6B6B',
          accent: '#51CF66',
          dark: '#1E293B',
          light: '#F8FAFC',
          bg: '#FAFBFC',
        },
      },
      animation: {
        'blob-float': 'blob-float 10s infinite alternate ease-in-out',
        'bounce-slow': 'bounce-slow 3s infinite ease-in-out',
        'bounce-slow-delay': 'bounce-slow 3s infinite ease-in-out 1.5s',
      },
      keyframes: {
        'blob-float': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(20px, -20px) scale(1.1)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
};

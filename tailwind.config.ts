import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F6',
        charcoal: '#0F172A',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.32, 0.72, 0, 1)',
        'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.12)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bar-fill': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1) both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.12) both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'bar-fill': 'bar-fill 0.6s cubic-bezier(0.32, 0.72, 0, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;

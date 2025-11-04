/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary: Warm sepia/amber (readable on dark)
        primary: {
          50: '#fef9f3',
          100: '#fef3e7',
          200: '#fde4c3',
          300: '#fcd09f',
          400: '#faad57',
          500: '#f8890f',
          600: '#df7c0e',
          700: '#ba670c',
          800: '#955209',
          900: '#7a4408',
        },
        // Surface: Dark warm neutrals (heritage aesthetic)
        surface: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Accent: Rich amber/gold (jazzy warmth)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        // Heritage serif for headlines
        serif: ['Georgia', 'Garamond', 'serif'],
        // Modern sans for body
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        // Monospace for studio elements
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      borderRadius: {
        // Softer, rounded aesthetic
        'brand': '12px',
        'brand-lg': '16px',
        'brand-xl': '24px',
      },
      boxShadow: {
        // Warm, atmospheric shadows
        'warm': '0 4px 6px -1px rgba(120, 53, 15, 0.1), 0 2px 4px -1px rgba(120, 53, 15, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(120, 53, 15, 0.1), 0 4px 6px -2px rgba(120, 53, 15, 0.05)',
        'warm-xl': '0 20px 25px -5px rgba(120, 53, 15, 0.1), 0 10px 10px -5px rgba(120, 53, 15, 0.04)',
      }
    }
  },
  plugins: [],
};

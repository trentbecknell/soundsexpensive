/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary: Warm sepia tones (film-inspired heritage)
        primary: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f3d9c1',
          300: '#e9bb94',
          400: '#dd9763',
          500: '#d4773f',
          600: '#c66134',
          700: '#a54d2d',
          800: '#85402a',
          900: '#6d3625',
        },
        // Surface: Warm neutrals (boutique craft aesthetic)
        surface: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4dc',
          300: '#d6cfc3',
          400: '#b8aea0',
          500: '#9a8d7d',
          600: '#7d7164',
          700: '#655b50',
          800: '#4a4239',
          900: '#2b2b2b', // Brand charcoal from logo
        },
        // Accent: Jazz club warmth (amber & gold)
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
        },
        // Cinematic: Deep atmospheric tones
        cinematic: {
          50: '#f8f7f5',
          100: '#edeae5',
          200: '#d8d2c8',
          300: '#bfb5a5',
          400: '#a1937f',
          500: '#8a7a64',
          600: '#766855',
          700: '#615547',
          800: '#4e453a',
          900: '#3d352d',
        }
      },
      fontFamily: {
        // Heritage serif for headlines (like logo wordmark)
        serif: ['Georgia', 'Garamond', 'serif'],
        // Modern sans for body (balanced, readable)
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        // Monospace for studio/technical elements (like tape stamp)
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      borderRadius: {
        // Softer, rounded aesthetic (matching reel seal)
        'brand': '12px',
        'brand-lg': '16px',
        'brand-xl': '24px',
      },
      boxShadow: {
        // Warm, atmospheric shadows (film grain inspired)
        'warm': '0 4px 6px -1px rgba(109, 54, 37, 0.1), 0 2px 4px -1px rgba(109, 54, 37, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(109, 54, 37, 0.1), 0 4px 6px -2px rgba(109, 54, 37, 0.05)',
        'warm-xl': '0 20px 25px -5px rgba(109, 54, 37, 0.1), 0 10px 10px -5px rgba(109, 54, 37, 0.04)',
      }
    }
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm wood brown for primary actions
        primary: {
          50: '#faf8f5',
          100: '#f5f1e8',
          200: '#e8dcc8',
          300: '#d4c0a0',
          400: '#b89968',
          500: '#8B6F47', // Rich wood brown
          600: '#765d3a',
          700: '#5d4a2e',
          800: '#4a3a24',
          900: '#3a2e1c',
        },
        // Light greys and warm whites for backgrounds
        surface: {
          50: '#FFFFFF', // Pure white
          100: '#FAFAFA', // Off-white
          200: '#F5F5F5', // Light grey
          300: '#E8E8E8', // Soft grey
          400: '#D4D4D4', // Medium grey
          500: '#A3A3A3', // Mid grey
          600: '#737373', // Slate grey
          700: '#525252', // Dark grey for text
          800: '#404040', // Almost black text
          900: '#262626', // Text black
        },
        // Soft sage/earth green accents
        accent: {
          50: '#f6f8f6',
          100: '#e8ede8',
          200: '#d4ddd4',
          300: '#b3c4b3',
          400: '#8fa88f',
          500: '#6B8E6B', // Soft sage green
          600: '#577357',
          700: '#455c45',
          800: '#364836',
          900: '#2a372a',
        },
        // Warm terracotta for high-fit matches
        amber: {
          50: '#fdf8f6',
          100: '#f8ede8',
          200: '#f0d9cd',
          300: '#e5bca8',
          400: '#d89876',
          500: '#C87850', // Warm terracotta
          600: '#b05f3d',
          700: '#924d31',
          800: '#783f29',
          900: '#5f3322',
        }
      }
    }
  },
  plugins: [],
};

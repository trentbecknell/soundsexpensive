/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Teal for primary actions and highlights
        primary: {
          50: '#f0f9fa',
          100: '#d9f0f2',
          200: '#b8e3e7',
          300: '#8bd0d6',
          400: '#68b9c1',
          500: '#499FA4', // Main teal
          600: '#3d8489',
          700: '#366b70',
          800: '#2f595d',
          900: '#2a4a4e',
        },
        // Charcoal to Slate for backgrounds and surfaces
        surface: {
          50: '#f8f9f9',
          100: '#f1f3f3',
          200: '#e3e6e6',
          300: '#d4d8d7',
          400: '#BEC6C3', // Slate for mid-tones
          500: '#9ca5a3',
          600: '#7a8481',
          700: '#5e6866',
          800: '#4a5551',
          900: '#3D4A55', // Charcoal for dark elements
        },
        // Tangerine for accents and warm highlights
        accent: {
          50: '#fef8f1',
          100: '#fceede',
          200: '#f9dcbc',
          300: '#f4c594',
          400: '#eeae6e',
          500: '#E9BC8B', // Main tangerine
          600: '#d69961',
          700: '#b67845',
          800: '#92603a',
          900: '#775032',
        },
        // Additional amber scale for emphasis
        amber: {
          50: '#fef8f1',
          100: '#fceede',
          200: '#f9dcbc',
          300: '#f4c594',
          400: '#eeae6e',
          500: '#E9BC8B',
          600: '#d69961',
          700: '#b67845',
          800: '#92603a',
          900: '#775032',
        }
      }
    }
  },
  plugins: [],
};

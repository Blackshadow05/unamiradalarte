/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        secondary: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fad5ff',
          300: '#f5b3ff',
          400: '#ed82ff',
          500: '#e052ff',
          600: '#c730e8',
          700: '#a821c4',
          800: '#8b1ca0',
          900: '#731b83',
        },
        accent: {
          50: '#fff0f9',
          100: '#ffe3f4',
          200: '#ffc6ea',
          300: '#ff94d6',
          400: '#ff52b8',
          500: '#ff1a9b',
          600: '#f0047f',
          700: '#c70065',
          800: '#a40553',
          900: '#880a47',
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in': 'slide-in 0.8s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(2rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'art-gradient': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        'hero-gradient': 'linear-gradient(135deg, #731b83 0%, #a821c4 30%, #ec4899 70%, #db2777 100%)',
        'warm-gradient': 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
      }
    },
  },
  plugins: [],
};
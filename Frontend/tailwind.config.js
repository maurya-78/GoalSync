/** @type {import('tailwindcss').Config} */

export default {

  content: [

    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",

  ],

  theme: {

    extend: {

      // ==========================================
      // COLORS
      // ==========================================

      colors: {

        primary: {

          50: '#eef2ff',

          100: '#e0e7ff',

          200: '#c7d2fe',

          300: '#a5b4fc',

          400: '#818cf8',

          500: '#6366f1',

          600: '#4f46e5',

          700: '#4338ca',

          800: '#3730a3',

          900: '#312e81',
          950: '#1e1b4b',

        },

        slate: {

          950: '#020617',

          900: '#0f172a',

          800: '#1e293b',

        },

      },

      // ==========================================
      // FONTS
      // ==========================================

      fontFamily: {

        mono: ['JetBrains Mono', 'monospace'],

        sans: ['Inter', 'sans-serif'],

      },

      // ==========================================
      // SHADOWS
      // ==========================================

      boxShadow: {

        // Existing glow shadow

        'glow-primary': '0 0 25px rgba(99, 102, 241, 0.35)',

        // Card shadows

        'card-light': '0 4px 20px rgba(0, 0, 0, 0.08)',

        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.35)',

      },

    },

  },

  plugins: [],

};
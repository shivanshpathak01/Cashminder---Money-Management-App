/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Finance-focused color scheme
        primary: {
          DEFAULT: '#00C6FF', // Electric Blue
          50: '#E6F9FF',
          100: '#CCF3FF',
          200: '#99E7FF',
          300: '#66DBFF',
          400: '#33CFFF',
          500: '#00C6FF',
          600: '#00A0CC',
          700: '#007A99',
          800: '#005366',
          900: '#002D33',
        },
        secondary: {
          DEFAULT: '#32FF7E', // Neon Green
          50: '#E9FFF2',
          100: '#D3FFE6',
          200: '#A7FFCD',
          300: '#7BFFB3',
          400: '#4FFF9A',
          500: '#32FF7E',
          600: '#00FF5E',
          700: '#00CC4B',
          800: '#009938',
          900: '#006626',
        },
        // Dark mode colors
        dark: {
          bg: '#0A0F1A', // Deep Navy
          card: '#1C1F26', // Space Gray
          accent: '#2C303A', // Slightly lighter dark
          border: '#3D3D3D',
          text: {
            primary: '#F1F2F6', // White
            secondary: '#A4B0BE', // Cool Gray
            muted: '#57606F', // Muted Gray
          }
        },
        // Light mode colors
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          accent: '#F1F5F9',
          border: '#E2E8F0',
          text: {
            primary: '#1E293B',
            secondary: '#475569',
            muted: '#64748B',
          }
        },
        // Semantic colors
        success: {
          DEFAULT: '#00FFAB',
          light: '#00FFAB',
          dark: '#00CC88',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFCA28',
          dark: '#FFB300',
        },
        danger: {
          DEFAULT: '#FF4D4D',
          light: '#FF6B6B',
          dark: '#FF3333',
        },
        info: {
          DEFAULT: '#18DCFF',
          light: '#41E2FF',
          dark: '#00D2FF',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0A0F1A, #1C1F26)',
        'blue-gradient': 'linear-gradient(135deg, #00C6FF, #0072FF)',
        'green-gradient': 'linear-gradient(135deg, #32FF7E, #00C6FF)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

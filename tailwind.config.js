/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B5D3A',
          50: '#f0f9f4',
          100: '#dcf3e7',
          200: '#bbe7d0',
          300: '#8ad5ab',
          400: '#4bbd80',
          500: '#2B5D3A',
          600: '#1e4a2b',
          700: '#1a3e25',
          800: '#183521',
          900: '#162f1e',
        },
        secondary: {
          DEFAULT: '#4A90E2',
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dcff',
          300: '#7cc2ff',
          400: '#36a8ff',
          500: '#4A90E2',
          600: '#1d6fc0',
          700: '#18599a',
          800: '#184b7e',
          900: '#18406a',
        },
        accent: {
          DEFAULT: '#F5A623',
          50: '#fffbf0',
          100: '#fff6e0',
          200: '#ffeab8',
          300: '#ffd885',
          400: '#ffc147',
          500: '#F5A623',
          600: '#d4881f',
          700: '#b06e1a',
          800: '#925a18',
          900: '#784c15',
        },
      },
    },
  },
  plugins: [],
}
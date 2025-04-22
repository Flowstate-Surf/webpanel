/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-slide': 'fade-slide 0.4s ease-out',
      },
      keyframes: {
        'fade-slide': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'default': {
          100: '#ffffff',
          900: '#1a202c',
        },
        'slate': {
          100: '#f1f5f9',
          900: '#0f172a',
        },
        'purple': {
          100: '#f3e8ff',
          900: '#581c87',
        },
        'green': {
          100: '#dcfce7',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
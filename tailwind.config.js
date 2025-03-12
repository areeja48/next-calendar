// tailwind.config.js
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // Enables class-based dark mode support
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-sans)', 'sans-serif'],
          mono: ['var(--font-mono)', 'monospace'],
        },
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
        },
      },
    },
    plugins: [],
  }
  
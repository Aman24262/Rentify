/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          indigo: 'var(--primary)',
          purple: 'var(--primary)',
          cyan: 'var(--primary-cyan, #06B6D4)',
        },
        background: {
          main: 'var(--bg)',
          card: 'var(--surface-solid)',
          soft: 'var(--bg-soft)',
          surface: 'var(--surface)',
          dark: 'var(--bg)',
        },
        text: {
          primary: 'var(--text)',
          secondary: 'var(--text-muted)',
          white: 'var(--text-white, #F8FAFC)',
        },
        border: {
          default: 'var(--border)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
        'purple-indigo': 'linear-gradient(to right, #7C3AED, #4F46E5)',
      },
      boxShadow: {
        'glow-purple': '0 0 25px rgba(124,58,237,0.35)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

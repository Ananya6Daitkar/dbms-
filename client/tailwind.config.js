/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0e1a',
        'neon-green': '#00ff88',
        'neon-purple': '#a855f7',
        'neon-blue': '#3b82f6',
        'dark-blue': '#1e3a8a',
        'glass-white': 'rgba(59, 130, 246, 0.1)',
        'glass-border': 'rgba(59, 130, 246, 0.3)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6' },
          '100%': { boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6' },
        },
      },
    },
  },
  plugins: [],
}

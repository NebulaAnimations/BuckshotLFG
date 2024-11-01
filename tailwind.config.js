/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scan': 'scan 10s linear infinite',
        'subtle-flicker': 'subtle-flicker 5s infinite',
        'blink': 'blink 1s step-end infinite',
        'slideIn': 'slideIn 0.5s ease-out forwards',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' }
        },
        'subtle-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        slideIn: {
          '0%': { 
            transform: 'translateX(-10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
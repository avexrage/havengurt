/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        logo: ['"Frankfurter Medium"', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#115AA6',   // THE HAVEN COLOR
          black: '#000000',  // THE GURT COLOR
          darkBlue: '#0C4278', // Darker shade for hovers
          lightBlue: '#E0F2FE', // Very light blue for backgrounds
          bg: '#FFFFFF',     // Clean White Background
          text: '#334155',   // Slate 700 for body text (softer than pure black)
        },
        // Product Specific Colors
        product: {
          carica: '#FFD734',
          original: '#A5E5FF',
          naga: '#D43259',
          lowsugar: '#7ED957'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 90, 166, 0.08)',
        'card': '0 10px 40px -10px rgba(17, 90, 166, 0.05)',
        'glow': '0 0 20px rgba(17, 90, 166, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    }
  },
  plugins: [],
}

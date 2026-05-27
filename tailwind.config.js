/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          base:  '#0d1117',
          card:  '#161b26',
          raise: '#1c2333',
          line:  '#21262d',
        },
        ai: {
          DEFAULT: '#60a5fa',
          light:   '#93c5fd',
          dark:    '#1d4ed8',
          muted:   'rgba(96,165,250,0.14)',
          border:  'rgba(96,165,250,0.22)',
        },
        tech: {
          DEFAULT: '#c084fc',
          light:   '#d8b4fe',
          dark:    '#7c3aed',
          muted:   'rgba(192,132,252,0.14)',
          border:  'rgba(192,132,252,0.22)',
        },
        fin: {
          DEFAULT: '#34d399',
          light:   '#6ee7b7',
          dark:    '#059669',
          muted:   'rgba(52,211,153,0.14)',
          border:  'rgba(52,211,153,0.22)',
        },
        gold: '#fbbf24',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs:    ['12px', '18px'],
        sm:    ['13px', '20px'],
        base:  ['15px', '24px'],
        lg:    ['17px', '26px'],
        xl:    ['19px', '28px'],
        '2xl': ['22px', '32px'],
        '3xl': ['27px', '36px'],
      },
      lineHeight: {
        reading: '1.75',
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-out forwards',
        'slide-up':   'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'tab-line':   'tabLine 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        tabLine: { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
        'card-hover': '0 2px 8px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)',
        'glow-ai':   '0 0 0 1px rgba(96,165,250,0.25),  0 4px 24px rgba(96,165,250,0.08)',
        'glow-tech': '0 0 0 1px rgba(192,132,252,0.25), 0 4px 24px rgba(192,132,252,0.08)',
        'glow-fin':  '0 0 0 1px rgba(52,211,153,0.25),  0 4px 24px rgba(52,211,153,0.08)',
        'glow-gold': '0 0 0 1px rgba(251,191,36,0.3),   0 8px 32px rgba(251,191,36,0.1)',
      },
    },
  },
  plugins: [],
}

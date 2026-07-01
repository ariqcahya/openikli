import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          soft: '#DBEAFE',
          text: '#1E40AF',
        },
        success: {
          DEFAULT: '#16A34A',
          soft: '#DCFCE7',
          text: '#166534',
        },
        warning: {
          DEFAULT: '#D97706',
          soft: '#FEF3C7',
          text: '#92400E',
        },
        danger: {
          DEFAULT: '#DC2626',
          soft: '#FEE2E2',
          text: '#991B1B',
        },
        map: {
          sangatBaik: '#15803D',
          baik: '#65A30D',
          cukup: '#F59E0B',
          kurang: '#EA580C',
          sangatKurang: '#DC2626',
          noData: '#CBD5E1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

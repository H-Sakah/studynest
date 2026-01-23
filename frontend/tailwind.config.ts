import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-yellow-300',
    'bg-cyan-300',
    'bg-purple-300',
    'bg-gray-300',
    'bg-blue-300',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        customBeige: '#f5ebe0',
        customBrown: '#e3d5ca',
        customGray: '#edede9',
      },
    },
  },
  plugins: [],
} satisfies Config;

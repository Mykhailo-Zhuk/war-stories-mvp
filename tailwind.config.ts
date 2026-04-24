import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111',
        foreground: '#f5f5f5',
        card: '#1e1e1e',
        'card-foreground': '#f5f5f5',
        border: '#2a2a2a',
        muted: '#888',
        'muted-foreground': '#666',
        accent: '#1f6feb',
        'accent-foreground': '#fff',
        destructive: '#E5484D',
        success: '#4CAF50',
        warning: '#F5A623',
        purple: '#7C5CFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        button: '6px',
      },
    },
  },
  plugins: [],
}
export default config

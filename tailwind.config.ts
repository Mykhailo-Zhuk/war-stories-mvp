import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zhuk Design System Colors
        zhuk: {
          // Background colors
          'bg-primary': '#1a1a1a',
          'bg-secondary': '#1e1e1e',
          'bg-tertiary': '#2a2a2a',
          'bg-hover': '#2a2a2a',
          
          // Text colors
          'text-primary': '#ffffff',
          'text-secondary': '#c9c9c9',
          'text-tertiary': '#888888',
          'text-quaternary': '#666666',
          'text-disabled': '#555555',
          
          // Border colors
          'border-primary': '#333333',
          'border-secondary': '#444444',
          'border-hover': '#555555',
          
          // Accent colors
          'accent-primary': '#7C5CFC',
          'accent-secondary': '#8B6DFF',
          'accent-hover': '#9B7DFF',
          
          // Status colors
          'accent-success': '#4CAF50',
          'accent-warning': '#F5A623',
          'accent-error': '#E5484D',
          'accent-info': '#2196F3',
          
          // Priority colors
          'priority-urgent': '#E5484D',
          'priority-high': '#F5A623',
          'priority-medium': '#7C5CFC',
          'priority-low': '#888888',
          'priority-none': '#444444',
          
          // Status colors
          'status-backlog': '#666666',
          'status-todo': '#888888',
          'status-in-progress': '#F5A623',
          'status-done': '#4CAF50',
          'status-cancelled': '#E5484D',
          
          // Current session
          'current-session': '#4ADE80',
        },
      },
      fontSize: {
        // Zhuk Design System Typography
        'zhuk-page-title': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'zhuk-section-heading': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'zhuk-card-title': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'zhuk-body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'zhuk-small': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'zhuk-xs': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'zhuk-xxs': ['11px', { lineHeight: '14px', fontWeight: '400' }],
        'zhuk-button': ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },
      spacing: {
        // Zhuk Design System Spacing
        'zhuk-1': '4px',
        'zhuk-2': '8px',
        'zhuk-3': '12px',
        'zhuk-4': '16px',
        'zhuk-5': '20px',
        'zhuk-6': '24px',
        'zhuk-8': '32px',
        'zhuk-10': '40px',
        'zhuk-12': '48px',
      },
      borderRadius: {
        'zhuk-sm': '4px',
        'zhuk-md': '6px',
        'zhuk-lg': '8px',
        'zhuk-xl': '12px',
        'zhuk-2xl': '16px',
      },
      boxShadow: {
        'zhuk-card': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'zhuk-elevation': '0 4px 12px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
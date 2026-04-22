import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linear: {
          bg: "#0d1117",
          bgSecondary: "#161b22",
          text: "#c9d1d9",
          textSecondary: "#8b949e",
          accent: "#1f6feb",
          border: "#30363d",
          success: "#238636",
          error: "#da3633",
          warning: "#d29922",
        },
      },
    },
  },
  plugins: [],
}

export default config

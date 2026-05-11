import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        line: "#D9DEE8",
        panel: "#F7F9FC",
        accent: "#0F766E",
        warn: "#B45309"
      }
    }
  },
  plugins: []
};

export default config;


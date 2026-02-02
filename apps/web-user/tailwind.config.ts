import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: ["rounded-t-lg", "rounded-b-lg", "rounded-lg", "border-b-0", "border-t-0"],
  theme: {
    fontSize: {
      "2xs": ["11px", "14px"],
      xs: ["12px", "16px"],
      "2sm": ["13px", "18px"],
      sm: ["14px", "20px"],
      base: ["16px", "24px"],
      lg: ["18px", "28px"],
      xl: ["20px", "28px"],
      "2xl": ["24px", "32px"],
    },
    extend: {
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
        full: "9999px",
      },
      colors: {
        white: {
          DEFAULT: "#FFFFFF",
        },
        black: {
          DEFAULT: "#000000",
        },
        gray: {
          50: "#F6F6F6",
          100: "#ECEDED",
          200: "#D9DADB",
          300: "#BDBFC0",
          400: "#9B9B97",
          500: "#808386",
          600: "#686864",
          700: "#4E4E4B",
          800: "#343432",
          900: "#21272C",
        },
        primary: {
          DEFAULT: "#FF653E",
          50: "#FFEFEB",
          100: "#FFD2C7",
          200: "#FFAD99",
          300: "#FF896B",
        },
        blue: {
          DEFAULT: "#E7F2FF",
          dark: "#1773DF",
          sky: "#6BAFFF",
          light: "#EFF6FF",
        },
        green: {
          DEFAULT: "#5FBF87",
          50: "#F0F9F4",
          100: "#CCEBD9",
          200: "#ABDEC0",
          300: "#8AD0A8",
        },
        red: {
          DEFAULT: "#F23A3E",
          50: "#FEECEC",
          100: "#FCCACB",
          200: "#F99FA1",
          300: "#F67476",
        }
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(100%)",
          },
          to: {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

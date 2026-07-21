/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Stitch Template Palette & Executive Precision Integration
        "on-primary-fixed-variant": "#003ea8",
        "on-error-container": "#93000a",
        "surface-container": "#ededf9",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#0053db",
        "on-primary-container": "#eeefff",
        "secondary-container": "#d0e1fb",
        "on-primary-fixed": "#00174b",
        "primary": "#004ac6", // Main Brand Blue
        "inverse-on-surface": "#f0f0fb",
        "surface-variant": "#e1e2ed",
        "secondary": "#505f76",
        "surface-container-low": "#f3f3fe",
        "primary-fixed-dim": "#b4c5ff",
        "on-surface-variant": "#434655",
        "primary-fixed": "#dbe1ff",
        "on-primary": "#ffffff",
        "on-surface": "#191b23",
        "background": "#faf8ff", // Light Background
        "surface": "#faf8ff",
        "on-background": "#191b23",
        "on-secondary-fixed-variant": "#38485d",
        "error-container": "#ffdad6",
        "on-tertiary-container": "#ffede6",
        "on-error": "#ffffff",
        "tertiary-container": "#bc4800",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e7e7f3",
        "surface-dim": "#d9d9e5",
        "inverse-surface": "#2e3039",
        "outline": "#737686",
        "secondary-fixed-dim": "#b7c8e1",
        "tertiary": "#943700",
        "secondary-fixed": "#d3e4fe",
        "tertiary-fixed": "#ffdbcd",
        "on-tertiary": "#ffffff",
        "outline-variant": "#c3c6d7",
        "on-secondary-fixed": "#0b1c30",
        "primary-container": "#2563eb",
        "tertiary-fixed-dim": "#ffb596",
        "inverse-primary": "#b4c5ff",
        "surface-container-highest": "#e1e2ed",
        "on-tertiary-fixed-variant": "#7d2d00",
        "surface-bright": "#faf8ff",
        "error": "#ba1a1a",
        "on-secondary-container": "#54647a",
        "on-tertiary-fixed": "#360f00",

        // Executive Precision Colors
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae2fd",
          300: "#7cc8fc",
          400: "#38a9fa",
          500: "#0e8ce4",
          600: "#026fc1",
          700: "#03589c",
          800: "#074c80",
          900: "#0c406b",
          950: "#082949",
        },
        financial: {
          income: "#10b981",
          expense: "#ef4444",
          savings: "#0ea5e9",
          budget: "#f59e0b",
          neutral: "#64748b",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "soft-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "soft-md": "0 4px 20px rgba(0, 0, 0, 0.05)",
        "soft-lg": "0 10px 30px rgba(0, 0, 0, 0.06)",
        "soft-xl": "0 20px 40px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      spacing: {
        "base": "4px",
        "stack-lg": "32px",
        "stack-sm": "8px",
        "sidebar-width": "280px",
        "stack-md": "16px",
        "container-max": "1440px",
        "gutter": "24px",
        "margin-desktop": "40px",
        "margin-mobile": "16px"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        drawerSlideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        }
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out forwards",
        slideUp: "slideUp 0.25s ease-out forwards",
        slideDown: "slideDown 0.2s ease-out forwards",
        zoomIn: "zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        drawerSlideIn: "drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }
    },
  },
  plugins: [],
}

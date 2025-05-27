import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xxs: "10px",
      },
      boxShadow: {
        input:
          "`0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        minimize: {
          "0%": { height: "450px" },
          "100%": { height: "56px" },
        },
        maximize: {
          "0%": { height: "56px" },
          "100%": { height: "450px" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "accordion-down": {
          backgroundPosition: "0 0",
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
            backgroundPosition: "-200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "slide-out": "slide-out 0.2s ease-in",
        minimize: "minimize 0.2s ease-in-out",
        maximize: "maximize 0.2s ease-in-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
      },
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          "custom-dark": "#091021",
        },
      },
    },
  },
  plugins: [
    typography,
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ addUtilities }) {
      addUtilities({
        ".safe-bottom-inset": {
          "padding-bottom": "16px",
          "padding-bottom": "calc(16px + env(safe-area-inset-bottom))",
          "padding-bottom": "calc(16px + constant(safe-area-inset-bottom))",
        },
        ".safe-top-inset": {
          "padding-top": "16px",
          "padding-top": "calc(16px + env(safe-area-inset-top))",
          "padding-top": "calc(16px + constant(safe-area-inset-top))",
        },
      });
    },
  ],
};

function addVariablesForColors({ addBase, theme }) {
  function flattenColors(colors) {
    const result = {};
    for (const [key, value] of Object.entries(colors)) {
      if (typeof value === "string") {
        result[key] = value;
      } else {
        for (const [subKey, subValue] of Object.entries(value)) {
          result[`${key}-${subKey}`] = subValue;
        }
      }
    }
    return result;
  }

  const allColors = flattenColors(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

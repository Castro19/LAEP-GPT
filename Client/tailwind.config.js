import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: "true",
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

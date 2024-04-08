const typography = require("@tailwindcss/typography");

module.exports = {
  content: ["./src/**/*.jsx"], // Adjust depending on your file types
  theme: {
    extend: {},
  },
  plugins: [typography],
  darkMode: "class",
};

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // Add or update these rules
    "react/jsx-uses-react": "off", // Not needed with React 17+ JSX Transform
    "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX Transform
    "react/prop-types": "off", // Optional: Disable if you're not using prop-types
    "no-unused-vars": ["warn", { varsIgnorePattern: "React" }], // Adjust based on your needs
  },
};

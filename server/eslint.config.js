import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";

// Add these two imports for TypeScript support
import parserTs from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";

export default [
  // Configuration for JS files (if you still have some JS files)
  {
    languageOptions: {
      globals: globals.node,
      // Keep using the default parser for JS files
    },
    files: ["**/*.js"],
    ...pluginJs.configs.recommended,
    rules: {
      // JS-specific rules can go here
    },
  },

  // Configuration for TS files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: globals.node,
      parser: parserTs,
      parserOptions: {
        project: "./tsconfig.json", // Make sure you have a tsconfig.json
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      prettier: pluginPrettier,
      "@typescript-eslint": pluginTs,
    },
    extends: [
      "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
      "prettier", // Ensure Prettier and ESLint play nicely
    ],
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          trailingComma: "es5",
        },
      ],
      // You can apply or override TS-specific rules here
      // E.g., "@typescript-eslint/no-unused-vars": "warn"
    },
  },
];

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";
import { fixupConfigRules } from "@eslint/compat";

export default [
  {
    languageOptions: { globals: globals.node },
    files: ["**/*.js"],
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          trailingComma: "es5",
        },
      ],
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-empty": "warn",
    },
  },
];

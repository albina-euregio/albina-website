import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "public/**",
      "app/**/*.js",
      "eslint.config.mjs"
    ]
  },
  prettier,
  react,
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: reactHooks.configs.recommended.rules
  },
  {
    plugins: {
      "jsx-a11y": a11y
    }
  },
  {
    rules: {
      "no-console": ["error", { allow: ["info", "warn", "error", "assert"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "React" }
      ],
      "require-await": "error",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/prefer-enum-initializers": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-includes": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-regexp-exec": "warn",
      "@typescript-eslint/prefer-string-starts-ends-with": "warn",
      "react/no-string-refs": "warn",
      "react/prop-types": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "jsx-a11y/anchor-is-valid": "off", // TODO: enable rule
      "jsx-a11y/click-events-have-key-events": "off", // TODO: enable rule
      "jsx-a11y/no-noninteractive-element-interactions": "off" // TODO: enable rule
    }
  }
);

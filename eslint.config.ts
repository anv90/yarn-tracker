import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Apply ESLint's recommended rules for JavaScript
  eslint.configs.recommended,

  // Apply typescript-eslint's recommended rules with type checking
  ...tseslint.configs.recommendedTypeChecked,

  // Configure the TypeScript parser to find your tsconfig.json
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Add or override specific rules for your project
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/require-await": "off",
      "no-console": "warn",
    },
  },

  // Tell ESLint to skip generated files
  {
    ignores: ["dist/**", "client-dist/**", "node_modules/**", "drizzle/**", "*.config.ts"],
  },
  {
    files: ["src/client/**"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-base-to-string": "off",
    },
  },
);

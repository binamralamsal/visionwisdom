//  @ts-check
import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    rules: {
      "@typescript-eslint/no-throw-literal": "error",
    },
  },
];

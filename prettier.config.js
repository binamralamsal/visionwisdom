// @ts-check

/** @type {import('prettier').Config & import('@trivago/prettier-plugin-sort-imports').PluginConfig & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  // Tailwind plugin options
  tailwindFunctions: ["cn", "cva"],
  tailwindAttributes: ["classNames", "toastOptions"],
  // Import sorting options
  importOrder: [
    "^react",
    "^@tanstack",
    "^[./].*(?<!\\.(c|le|sc)ss)$",
    "\\.(c|le|sc)ss$",
    "^@/components",
    "~@?\\w",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderSortByLength: "asc",
};

export default config;

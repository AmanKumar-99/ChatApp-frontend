module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json", // required for certain rules (type-aware)
  },
  env: {
    browser: true,
    es2022: true,
    node: false,
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {},
    },
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "prettier",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  rules: {
    // your preferred rules; sensible defaults follow
    "prettier/prettier": "error",
    "react/prop-types": "off", // using TypeScript for props validation
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/no-unresolved": "error",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
}

module.exports = {
  root: true,
  env: {
    "browser": true,
    "es2021": true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    "no-cond-assign": ["error", "except-parens"],
    "no-control-regex": "off",
    "@typescript-eslint/no-unused-vars": ["error", { args: "none"}],
    "@typescript-eslint/no-explicit-any": "off",
  }
}

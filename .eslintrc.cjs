module.exports = {
  rules: {
    "no-console": ["error", { "allow": ["warn", "error"] }]
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit/eslint-config-ts/recommended",
    "@electron-toolkit/eslint-config-prettier"
  ]
};

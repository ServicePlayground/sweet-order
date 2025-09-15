module.exports = {
  root: false,
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "import/no-unresolved": "off"
  }
};

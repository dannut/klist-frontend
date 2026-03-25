export default [
  {
    files: ["src/js/**/*.js"],
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn",
      "semi": ["error", "always"],
      "eqeqeq": "error"
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        navigator: "readonly",
        URLSearchParams: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly"
      }
    }
  }
];

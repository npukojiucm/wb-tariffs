export default {
    root: true,
    env: {
        node: true,
        es2023: true,
    },

    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
        project: "./tsconfig.json",
        sourceType: "module",
    },

    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],

    rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_"}],
        "no-console": "warn",
    },

    ignorePatterns: ["dist", "node_modules"],
};

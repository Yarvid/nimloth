module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:prettier/recommended",
      ],
      rules: {
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
          },
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix: "app",
            style: "kebab-case",
          },
        ],
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
    {
      files: ["*.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
  ],
};

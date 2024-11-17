module.exports = {
    root: true,
    ignorePatterns: [
      "projects/**/*",
      "dist/**/*",
      "coverage/**/*"
    ],
    overrides: [
      {
        files: ["*.ts"],
        extends: [
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:@angular-eslint/recommended",
          "plugin:@angular-eslint/template/process-inline-templates",
          "plugin:prettier/recommended"
        ],
        rules: {
          "@angular-eslint/directive-selector": [
            "error",
            {
              type: "attribute",
              prefix: "app",
              style: "camelCase"
            }
          ],
          "@angular-eslint/component-selector": [
            "error",
            {
              type: "element",
              prefix: "app",
              style: "kebab-case"
            }
          ],
          "@typescript-eslint/explicit-function-return-type": ["error", {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true
          }],
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_"
          }],
          "no-console": ["warn", {
            allow: ["warn", "error"]
          }],
          "curly": "error",
          "eqeqeq": ["error", "always"],
          "prefer-const": "error",
          "no-var": "error",
          "@angular-eslint/no-empty-lifecycle-method": "warn",
          "@typescript-eslint/naming-convention": [
            "error",
            {
              selector: "interface",
              format: ["PascalCase"],
              prefix: ["I"]
            },
            {
              selector: "enum",
              format: ["PascalCase"],
              prefix: ["E"]
            }
          ]
        }
      },
      {
        files: ["*.html"],
        extends: [
          "plugin:@angular-eslint/template/recommended",
          "plugin:@angular-eslint/template/accessibility"
        ],
        rules: {
          "@angular-eslint/template/no-negated-async": "error",
          "@angular-eslint/template/accessibility-alt-text": "error",
          "@angular-eslint/template/click-events-have-key-events": "error"
        }
      }
    ]
  }
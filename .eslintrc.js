module.exports = {
  "extends": [
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "react/prop-types": 0,
    "@typescript-eslint/consistent-type-assertions": "off"
  }
};

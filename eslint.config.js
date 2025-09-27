/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals", 
  ],
  parserOptions: {
    ecmaVersion: 2025,
    sourceType: "module",
  },
  rules: {
    
    "no-console": "warn",
    "react/react-in-jsx-scope": "off",
  },
};

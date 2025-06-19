import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended", "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended"]
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser }, rules: { "react/react-in-jsx-scope": "off" } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
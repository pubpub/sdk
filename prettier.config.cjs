module.exports = {
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  plugins: [require("prettier-plugin-svelte"), require("prettier-plugin-tailwindcss")],
  pluginSearchDirs: ["."],
  overrides: [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}

import { defineConfig } from 'tsup'

const config = defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: true,
  entry: ['src'],
  minify: false,
})

export default config

import { defineConfig } from 'tsup'

const config = defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  entry: ['src'],
})

export default config

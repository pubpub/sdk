// @ts-check
import { defineConfig } from 'tsup'

const config = defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  metafile: true,
  entry: ['src'],
  minify: false,
  sourcemap: true,
  treeshake: {
    preset: 'smallest',
  },
  splitting: true,
})

export default config

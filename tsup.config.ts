import { build, defineConfig } from 'tsup'
import size from '@size-limit/esbuild'

const config = defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: true,
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

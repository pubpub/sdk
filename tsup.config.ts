import { defineConfig } from 'tsup'
import { copyFile } from 'fs/promises'
import readdirp from 'readdirp'

const config = defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: true,
  entry: ['src'],
  minify: true,
})

export default config

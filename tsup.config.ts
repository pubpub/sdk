import { defineConfig } from 'tsup'
import { copyFile } from 'fs/promises'
import readdirp from 'readdirp'

const config = defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  entry: ['src'],
  onSuccess: async () => {
    const dir = await readdirp.promise(
      new URL('./dist', import.meta.url).pathname
    )
    // copy each .d.ts file to a .d.cts file
    await Promise.all(
      dir

        .filter((file) => file.path.endsWith('.d.ts'))
        .map(async (file) => {
          await copyFile(
            new URL(`./dist/${file.path}`, import.meta.url).pathname,
            new URL(
              `./dist/${file.path.replace('.ts', '')}.cts`,
              import.meta.url
            ).pathname
          )
        })
    )
  },
})

export default config

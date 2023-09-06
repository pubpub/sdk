import * as esbuild from 'esbuild'
import path from 'path'
import fs from 'fs'

export const tsRestPlugin: esbuild.Plugin = {
  name: 'ts-rest',
  setup(build) {
    build.onResolve({ filter: /.*(schemas|contract)\/.*/ }, async (args) => {
      const { path: importPath, ...rest } = args
      try {
        const resolved = path.resolve(
          path.dirname(rest.importer),
          `${importPath}.ts`
        )

        return {
          path: resolved,
          namespace: 'schemas',
        }
      } catch (e) {
        return {
          path: importPath,
        }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'schemas' }, async (args) => {
      const contents = await fs.promises.readFile(args.path, 'utf8')

      const removedZod = contents
        .replace(/import.*?'zod';/g, '')
        .replace(/extendZodWithOpenApi\(z\);/g, '')
        .replace(/import.*zod-openapi.*;/, '')
      console.log(removedZod)

      return {
        contents: removedZod.toString(),
        loader: 'ts',
        resolveDir: path.dirname(args.path),
      }
    })
  },
}

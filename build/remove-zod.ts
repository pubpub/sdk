import esbuild from 'esbuild'
import * as babelParser from '@babel/parser'
import gen from '@babel/generator'
import trav from '@babel/traverse'
import { z } from 'zod'

const traverse = (trav as any).default as typeof trav
const generate = (gen as any).default as typeof gen

import fs from 'fs'
import path from 'path'
import { copy } from 'fs-extra'

function findRecursiveFiles(dir: string): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  const bigFiles = files.flatMap((file) => {
    const res = path.resolve(dir, file.name)
    if (file.isDirectory()) {
      return findRecursiveFiles(res).flat()
    } else {
      return res
    }
  })
  return bigFiles as string[]
}

async function findFilesWithZod(dir: string) {
  const files = findRecursiveFiles(dir).filter(
    (file) => file && /\.c?js$/.test(file)
  ) as string[]

  console.log(files)
  // return filename and contents of the files that have zod in m

  const filesWithZod = (
    await Promise.all(
      files.map(async (file) => {
        const content = await fs.promises.readFile(file, 'utf8')

        if (content.includes('zod')) {
          return { file, content }
        }
      })
    )
  ).filter(Boolean)

  return filesWithZod
}

export async function cleanZod(filePath: string) {
  let contents = await fs.promises.readFile(filePath, 'utf8')

  // Parse the code into an AST using Babel
  const ast = babelParser.parse(contents, {
    sourceType: 'module',
    plugins: ['typescript'], // Add more plugins if needed
  })
  let insideRouterFunction = false
  let zodImportNames: string[] = []

  const zodMethods = [
    ...Object.keys(z),
    ...Object.keys(z.object({})),
    'omit',
    'extend',
    'pick',
    'partial',
  ]

  try {
    traverse(ast, {
      // Remove imports from zod
      ImportDeclaration(path) {
        if (path.node.source.value === 'zod') {
          path.node.specifiers.forEach((spec) => {
            if (spec.type !== 'ImportSpecifier') {
              return
            }

            if (!('name' in spec.imported)) {
              return
            }

            zodImportNames.push(spec.imported.name)
          })
          path.remove()
        }
      },

      CallExpression(path) {
        // Check if we are calling a function named "router"
        if (
          path.node.callee &&
          'property' in path.node.callee &&
          path.node.callee.property &&
          'name' in path.node.callee.property &&
          path.node.callee.property.name === 'router'
        ) {
          insideRouterFunction = true
        }

        if (
          'callee' in path.node &&
          path.node.callee &&
          'object' in path.node.callee &&
          path.node.callee.object &&
          'name' in path.node.callee.object &&
          (zodImportNames.includes(path.node.callee.object.name) ||
            zodMethods.includes(path.node.callee.property.name))
        ) {
          const parent = path.findParent(
            (p) =>
              p.node?.type === 'VariableDeclaration' &&
              'name' in p.node &&
              p?.node.name !== 'PubPub'
          )

          if (!parent) {
            return
          }
          parent.remove()
          //          parent.replaceWith(babelParser.parseExpression('undefined'))
          return
          if (
            [
              // 'ConditionalExpression',
              // 'MemberExpression',
              // 'CallExpression',
            ].includes(path.parentPath.type)
          ) {
            return
          }
          // if (['AssignmentExpression'].includes(path.parentPath.type)) {
          //   path.parentPath.remove()
          //   return
          // }
          // if (path.parentPath.node === null) {
          //   return
          // }
          console.log('AAAAA')
          console.log({ type: path.parentPath.type, path: path.parentPath })
          path.parentPath.replaceWith(babelParser.parseExpression('undefined'))
        }
      },

      ObjectExpression: {
        enter(path) {
          if (insideRouterFunction) {
            // Mark the current object expression to be checked for "body" and "responses" fields
            path.node.shouldCheckProperties = true
          }
        },
        exit() {
          insideRouterFunction = false
        },
      },

      // Remove schema declarations and body/responses fields
      ObjectProperty(path) {
        const key = path.node.key

        const shouldRemove = path.findParent(
          (p) => p.node?.shouldCheckProperties
        )

        if (!shouldRemove) {
          return
        }

        if (
          shouldRemove &&
          key &&
          'name' in key &&
          ['pathParams', 'query', 'body', 'responses'].includes(key.name)
        ) {
          if (key.name === 'responses') {
            const obj = babelParser.parseExpression('{}')
            path.node.value = obj
            // .replaceWithSourceString('responses: {}')
            //          path.remove()
            return
          }
          path.remove()
        }
      },

      VariableDeclarator(path) {
        if (
          path.node.init &&
          'callee' in path.node.init &&
          path.node.init.callee &&
          'object' in path.node.init.callee &&
          path.node.init.callee.object &&
          'name' in path.node.init.callee.object &&
          zodImportNames.includes(path.node.init.callee.object.name)
        ) {
          path.parentPath.remove()
        }
      },
    })
  } catch (e) {
    console.error(e)
  }

  // Generate code back from the modified AST
  const { code } = generate(ast, {})

  await fs.promises.writeFile(filePath, code)
}

await fs.promises.rm(new URL('../.dist-test', import.meta.url).pathname, {
  recursive: true,
  force: true,
})

await copy(
  new URL('../dist', import.meta.url).pathname,
  new URL('../.dist-test', import.meta.url).pathname
)

const filesWithZod = await findFilesWithZod(
  new URL('../.dist-test', import.meta.url).pathname
)

const result = await Promise.all(
  filesWithZod.map(async (file) => {
    if (!file) {
      return
    }
    console.log(file.file)
    await cleanZod(file.file)
  })
)

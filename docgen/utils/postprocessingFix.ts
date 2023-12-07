import { replace } from './replace'
import {
  PLACEHOLDER_TYPE,
  runPrettierAndRemovePlaceholderTypes,
} from './runPrettierAndRemovePlaceholderTypes'

/**
 * Run some dirty fixes on the markdown after it has been processed by remark
 */
export async function postprocessingFix(markdown: string, outputPath: string) {
  const prettiered = await runPrettierAndRemovePlaceholderTypes(
    markdown,
    outputPath,
  )

  const modelTypes = new Map()

  /**
   * some ugly global replaces
   */
  const placeHoldersRemoved = replace(prettiered, [
    [/(\s+)(layout\??):(?:.|\n)+?(\1\w+:)/g, '$1$2: Layout$3'],
    [
      /(\n\s*?\| )string\1boolean\1string\[\](?:.|\n)+?\1undefined/g,
      ' StringFilter',
    ],
    [
      /(\n\s*?\| )number\1boolean\1\{(?:.|\n)+?\1undefined/g,
      ' NumberOrDateFilter',
    ],
    [
      /(\s+?)(draft|review|submission|discussion|page|member|collection|pub|collectionPub|attribution|release|community|user)(s?): (\{\n(?:\n|.)+?\1\})(\[\])?/g,
      (_, space, name: string, s: string, bod: string, arr: string) => {
        // we want to add these to the bottom later
        const upperCaseName = `${name[0].toUpperCase()}${name.slice(1)}`

        modelTypes.set(upperCaseName, bod)

        return `${space}${name}${s}?: ${upperCaseName}${arr || ''}`
      },
    ],
    [
      /(\s+?)(draft|review|submission|discussion|page|member|collection|pub|user|attribution|collectionPub|release|community)(s?)\?:\n(\s+?\| )(\{\n(?:\n|.)+?\})(\[\])?\n\4undefined/g,
      (
        _,
        space,
        name: string,
        s: string,
        space2: string,
        bod: string,
        arr: string,
      ) => {
        // we want to add these to the bottom later
        const upperCaseName = `${name[0].toUpperCase()}${name.slice(1)}`

        if (!modelTypes.has(upperCaseName)) {
          modelTypes.set(upperCaseName, bod)
        }

        return `${space}${name}${s}?: ${upperCaseName}${arr || ''}`
      },
    ],
    /**
     * This replaces e.g. `collectionPubs?: { /** very big  thing *\/}
     * with
     * `collectionPubs?: CollectionPub[]`
     */
    // [
    //   /(\w)(\w+)\?:\n(\s+\| )(\{(?:\n|.)+?)\3undefined/g,

    //   (_, first, rest: string, tab, model) => {
    //     // we want to add these to the bottom later
    //     modelTypes.set(`${first.toUpperCase()}${rest}`, model)

    //     return `${first}${rest}?: ${first.toUpperCase()}${rest.replace(
    //       /s$/,
    //       '[]',
    //     )}`
    //   },
    // ],
  ])

  const text = `
${placeHoldersRemoved}

### Other types

${[...modelTypes.entries()]
  .map(([name, model]) => {
    return `
#### ${name}

~~~ts
${PLACEHOLDER_TYPE}${model}
~~~
`
  })
  .join('')}

`

  const finalText = runPrettierAndRemovePlaceholderTypes(text, outputPath)

  return finalText
}

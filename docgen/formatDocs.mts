import { readFileSync, writeFileSync } from 'fs'
import { processFile } from './utils/processFile'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkToc from 'remark-toc'
import { replace } from './utils/replace'

const CLIENT_PATH = new URL('./docs/interfaces/Client.md', import.meta.url)
  .pathname

/**
 * We need to process these things separately as they have nested routes, and they do not get properly generated by Typedoc
 *
 * It will look like a big mess otherwise
 */
const PUB_PATH = new URL('./docs/interfaces/Pub.md', import.meta.url).pathname
const COLLECTION_PATH = new URL(
  './docs/interfaces/Collection.md',
  import.meta.url,
).pathname

const DOCSNIPPETS_PATH = new URL('./doc-snippets/', import.meta.url)

const getDocSnippet = (name: string) =>
  readFileSync(new URL(name, DOCSNIPPETS_PATH).pathname, { encoding: 'utf-8' })

function formatDocs() {
  const pub = processFile({
    inputPath: PUB_PATH,
    subsectionName: 'pubpub.pub',
    sectionsToExtract: { 'pubpub.pub.doi': true, 'pubpub.pub.text': true },
  })

  const collection = processFile({
    inputPath: COLLECTION_PATH,
    subsectionName: 'pubpub.collection',
    sectionsToExtract: { 'pubpub.collection.doi': true },
  })

  const main = processFile({
    inputPath: CLIENT_PATH,
    subsectionName: (name) => (/pubpub\./.test(name) ? name : `pubpub.${name}`),
    replaceSectionWith: [
      ['pubpub.collection.doi', collection['pubpub.collection.doi']],
      ['pubpub.pub.doi', pub['pubpub.pub.doi']],
      ['pubpub.pub.text', pub['pubpub.pub.text']],
    ],
  })

  const [, mainClean] = main.match(/## Properties\n((?:.|\n)+)/) ?? []

  const querying = getDocSnippet('./querying.md')
  const starting = getDocSnippet('./starting.md')
  const readmeSnippet = getDocSnippet('./readme.md')

  const readmeReplaced = replace(readmeSnippet, [
    [/## API/, `## API\n${mainClean}`],
    [/### Querying/, `${querying}`],
    [/### Starting/, `${starting}`],
  ])

  const a = unified()
    .use(remarkParse)
    .use(remarkToc, {
      heading: 'Contents',
      maxDepth: 4,
    })
    .use(remarkStringify)
    .processSync(readmeReplaced)

  const finalREADME = new URL('../readme.md', import.meta.url).pathname

  const withWarning = `
<!--
THIS FILE IS GENERATED. DO NOT EDIT IT DIRECTLY. EDIT THE TEMPLATE IN \`docgen/snippets/readme.md\` INSTEAD.
 -->

${a}
`
  writeFileSync(finalREADME, withWarning)
}

formatDocs()

/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Heading,
  Code,
  Root,
  RootContent,
  List,
  Paragraph,
  InlineCode,
} from 'mdast'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { headingRange } from './headingRange'
import { multiLine } from './multiLine'
import { unEscape } from './unescape'
import { convert } from 'unist-util-is'
import { toString } from 'mdast-util-to-string'
import { PLACEHOLDER_TYPE } from './runPrettierAndRemovePlaceholderTypes'

const isList = convert((node): node is List => node.type === 'list')
const isHeading = convert((node): node is Heading => node.type === 'heading')

/**
 * Remove source sections, not very useful
 */
const removeSource = () => (tree: Root) => {
  headingRange(
    tree,
    (value) => value === 'Source',
    () => [],
  )
}

/**
 * This formats the parameters section
 *
 * It removes all the subproperties and formats the parameters as a code block
 *
 * TODO: find a way to keep descriptions of properties
 */
const formatParameters = () => (tree: Root) => {
  // Reformat Parameters
  headingRange(
    tree,
    (value) => value === 'Parameters',
    (heading, section) => {
      const formattedSection = section.flatMap((sectionChild) => {
        if (!isList(sectionChild)) {
          return
        }

        return sectionChild.children.flatMap((child) => {
          const textChild = toString(child)

          const isSubProperty = /^\w+\..*?:/.test(textChild)

          if (isSubProperty) {
            return []
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, name, text] =
            textChild.match(/^(\w+\??): ((?:.|\n)*)/) ?? []

          if (!name || !text) {
            return []
          }

          return [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'inlineCode',
                  value: name,
                },
              ],
            } as Paragraph,
            {
              type: 'code',
              lang: 'ts',
              value: `${PLACEHOLDER_TYPE}${unEscape(text)}`,
            } as Code,
          ]
        })
      })
      return [heading, ...formattedSection]
    },
  )
}

/**
 * This formats the returns section
 *
 * Mostly just forces it to be a multiline code block, rather than a single line
 */
const formatReturns = () => (tree: Root) => {
  headingRange(
    tree,
    (value) => value === 'Returns',
    (heading, section) => {
      const returns = section[0]

      const returnsValue = multiLine(unEscape(toString(returns)))

      return [
        heading,
        {
          type: 'code',
          lang: 'ts',
          value: `${PLACEHOLDER_TYPE}${returnsValue}`,
        } as Code,
      ]
    },
  )
}

/**
 * This removes the "Type declaration" heading and bumps all the headings below it up one level
 */
const removeTypeDeclaration = () => (tree: Root) => {
  headingRange(
    tree,
    (value, heading) => heading.depth > 2 && value === 'Type declaration',
    (start, section) => {
      const bumpedHeadings = section
        .map((node) => {
          if (node.type === 'heading') {
            return {
              ...node,
              depth: node.depth - 1,
            } as Heading
          }
          return node
        })
        .filter(Boolean)

      return bumpedHeadings
    },
  )
}

/**
 * This moves the summary above the code preview
 *
 * It also moves the parameters and returns sections to the bottom
 * so that e.g. the description is above the parameters
 *
 * Parameters and returns are kind of large, no one will read the description
 * if they have to scroll past them
 */
const reorderSections = () => (tree: Root) => {
  headingRange(
    tree,
    (value, heading) => heading.depth === 4 && /^[a-z]/.test(value),
    (heading, section) => {
      const secondHeading = section.findIndex(
        (node) => node.type === 'heading' && node.depth === 5,
      )

      const restOfFirstPart = section.slice(0, secondHeading)

      const secondPart = section.slice(secondHeading)

      const sorted = restOfFirstPart.sort((a, b) => {
        if (a.type === 'code') {
          return 1
        }

        if (b.type === 'code') {
          return -1
        }

        return 0
      })

      let inRelevantSection = false
      const sectionContent: RootContent[] = []
      const relevantHeadings = ['Parameters', 'Returns']

      const withoutRelevantHeadings = secondPart.reduce((acc, curr) => {
        if (
          curr.type === 'heading' &&
          relevantHeadings.includes(toString(curr))
        ) {
          inRelevantSection = true
        }

        if (
          inRelevantSection &&
          curr.type === 'heading' &&
          heading.depth === curr.depth - 1 &&
          !relevantHeadings.includes(toString(curr))
        ) {
          inRelevantSection = false
        }

        if (inRelevantSection) {
          sectionContent.push(curr)
          return acc
        }

        acc.push(curr)
        return acc
      }, [] as RootContent[])

      return [
        heading,
        ...sorted,
        ...withoutRelevantHeadings,
        ...sectionContent,
      ].filter(Boolean)
    },
  )
}

/**
 * remove the big code block at the start of a property section
 * and rename the subproperties to be parent.property
 *
 * e.g.
 * ```md
 *
 * ### collectionPubs
 * ~~~ts
 * collectionPubs?: {
 * // big ass code block
 * }
 * ~~~
 *
 * #### create
 *
 * ```
 *
 * to
 *
 * ```md
 *
 * ### collectionPubs
 *
 * #### `PubPubSDK.collectionPubs.create`
 *
 * ```
 */
const removeCodeblockAndRenameSubproperties =
  ({
    subsectionName = '', // baseName = 'pubpub',
  }: {
    subsectionName?: string | ((name: string) => string)
    baseName?: string
  }) =>
  (tree: Root) => {
    headingRange(
      tree,
      (value, heading) => heading.depth > 2 && /^[a-z]/.test(value),
      (heading, section) => {
        const [, ...rest] = section

        const subbedHeading =
          typeof subsectionName === 'function'
            ? subsectionName(toString(heading))
            : `${subsectionName ? `${subsectionName}.` : ''}${toString(
                heading,
              )}`

        const changedSection = [
          {
            ...heading,
            children: [
              {
                type: 'inlineCode',
                value: subbedHeading,
              },
            ],
          } as Heading,

          ...rest.flatMap((node) => {
            if (!node) {
              return []
            }
            if (!isHeading(node)) {
              return node
            }

            if (node.depth > 4) {
              return node
            }
            return {
              ...node,
              children: [
                {
                  type: 'inlineCode',
                  value: `${subbedHeading}.${toString(node)}`,
                } as InlineCode,
              ],
            } as Heading
          }),
        ].filter(Boolean)

        return changedSection
      },
    )
  }

export const replaceSections =
  ({ replaceSectionWith }: { replaceSectionWith?: ReplaceSectionWith[] }) =>
  (tree: Root) => {
    if (!replaceSectionWith) {
      return
    }

    replaceSectionWith.forEach(([predicate, replacement]) => {
      headingRange(tree, predicate, (heading) => {
        const [heading2] = replacement

        const depthDiff = heading.depth - (heading2 as Heading).depth

        const depthCorrectedReplacement = replacement.map((node) => {
          if (!isHeading(node)) {
            return node
          }

          node.depth += depthDiff
          return node
        })

        return depthCorrectedReplacement
      })
    })
  }

const extractSections = <E extends ExtractSections>(
  tree: Root,
  { sectionsToExtract }: { sectionsToExtract: E },
) => {
  return Object.entries(sectionsToExtract).reduce((acc, [key, value]) => {
    headingRange(tree, value === true ? key : value, (heading, section) => {
      const total = [heading, ...section]
      acc[key] = total
      return total
    })

    return acc
  }, {})
}

export type HeadingTest = (
  value: string,
  heading: Heading,
) => boolean | null | undefined | void

export type ReplaceSectionWith = [HeadingTest | string, RootContent[]]

export type ExtractSections = Record<string, HeadingTest | true>

export function processMarkdown<
  E extends ExtractSections | undefined = undefined,
>(
  markdown: string,
  {
    sectionsToExtract,
    subsectionName = '',
    replaceSectionWith,
  }: {
    sectionsToExtract?: E
    subsectionName?: string | ((name: string) => string)
    replaceSectionWith?: ReplaceSectionWith[]
  },
): E extends undefined ? string : { [K in keyof E]: RootContent[] } {
  let extractedSections = {} as any

  const processor = unified()
    .use(remarkParse)
    .use(removeSource)
    .use(formatParameters)
    .use(formatReturns)
    .use(removeTypeDeclaration)
    .use(reorderSections)
    .use(removeCodeblockAndRenameSubproperties, {
      subsectionName,
    })
    .use(replaceSections, {
      replaceSectionWith,
    })
    .use(() => (tree: Root) => {
      if (!sectionsToExtract) {
        return
      }
      const extracted = extractSections(tree, {
        sectionsToExtract,
      })

      extractedSections = extracted
    })
    .use(remarkStringify)

  const text = processor.processSync(markdown).toString()

  if (sectionsToExtract !== undefined) {
    return extractedSections as any
  }

  return text as any
}

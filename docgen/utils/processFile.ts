/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, rmSync } from 'fs'
import { postprocessingFix } from './postprocessingFix'
import { preprocessingFix } from './preProcessingFix'
import type { ExtractSections, ReplaceSectionWith } from './processMarkdown'
import { processMarkdown } from './processMarkdown'
import type { RootContent } from 'mdast'

export async function processFile<
  E extends ExtractSections | undefined = undefined,
>({
  inputPath,
  sectionsToExtract,
  subsectionName,
  replaceSectionWith,
}: {
  inputPath: string
  sectionsToExtract?: E
  subsectionName?: string | ((name: string) => string)
  replaceSectionWith?: ReplaceSectionWith[]
}): Promise<
  E extends undefined
    ? string
    : {
        [K in keyof E]: RootContent[]
      }
> {
  const inputMarkdown = readFileSync(inputPath, { encoding: 'utf-8' })

  const preprocessedMarkdown = preprocessingFix(inputMarkdown)

  if (sectionsToExtract) {
    const processed = processMarkdown(preprocessedMarkdown, {
      subsectionName,
      replaceSectionWith,
      sectionsToExtract,
    })
    return processed
  }

  const processed = processMarkdown(preprocessedMarkdown, {
    subsectionName,
    replaceSectionWith,
  })

  const TEMP = new URL('../TEMP.md', import.meta.url).pathname
  const postProcessedMarkdown = await postprocessingFix(processed, TEMP)

  rmSync(TEMP)

  return postProcessedMarkdown as any
}

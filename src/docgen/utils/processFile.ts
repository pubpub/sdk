/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, rmSync } from 'fs'
import { postprocessingFix } from './postprocessingFix'
import { preprocessingFix } from './preProcessingFix'
import type { ExtractSections, ReplaceSectionWith } from './processMarkdown'
import { processMarkdown } from './processMarkdown'
import type { RootContent } from 'mdast'

export function processFile<E extends ExtractSections | undefined = undefined>({
  inputPath,
  sectionsToExtract,
  subsectionName,
  replaceSectionWith,
  noPrefix,
  noPostprocessing,
  noPreprocessing,
}: {
  inputPath: string
  sectionsToExtract?: E
  subsectionName?: string | ((name: string) => string)
  replaceSectionWith?: ReplaceSectionWith[]
}): E extends undefined
  ? string
  : {
      [K in keyof E]: RootContent[]
    } {
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

  const TEMP = 'TEMP.md'
  const postProcessedMarkdown = postprocessingFix(processed, TEMP)

  rmSync(TEMP)

  return postProcessedMarkdown as any
}

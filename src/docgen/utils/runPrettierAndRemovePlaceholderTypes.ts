import { execSync } from 'child_process'
import { writeFileSync, readFileSync } from 'fs'
import { replace } from './replace'

export const PLACEHOLDER_TYPE = 'type REMOVEME = ' as const

/**
 * 1. Write the markdown to the output path
 * 2. Run prettier on the output path
 * 3. Read prettiered file
 * 4. Replace the placeholder types with empty strings
 * 5. Write the file again
 * 6. Return the contents of the file
 */
export function runPrettierAndRemovePlaceholderTypes(
  markdown: string,
  outputPath: string,
) {
  writeFileSync(outputPath, markdown)

  execSync(`prettier --write ${outputPath}`)

  const file = readFileSync(outputPath, { encoding: 'utf-8' })

  const placeHoldersRemoved = replace(file, [
    [
      // we insert these so that prettier will format codeblocks correctly, but we should get rid of them if we don't need them
      new RegExp(`${PLACEHOLDER_TYPE.trim()} ?`, 'g'),
      '',
    ],
  ])

  writeFileSync(outputPath, placeHoldersRemoved)
  return placeHoldersRemoved
}

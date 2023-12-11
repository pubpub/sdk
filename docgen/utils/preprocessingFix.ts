import { replace } from './replace'

/**
 * Things we want to do before processing the file with remark
 * e.g. some ugly global replaces
 */
export function preprocessingFix(markdown: string) {
  return replace(markdown, [
    [/•/g, '-'],
    // readonly prevents formatting
    [/readonly /g, ''],
    // prettier doesn't like  &'s
    [/\{\} & /g, ''],
  ])
}

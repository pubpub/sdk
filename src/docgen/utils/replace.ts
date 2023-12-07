/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Easier way to do multiple replaces
 */
export function replace(
  text: string,
  replacers: (
    | [string, string]
    | [RegExp, string]
    | [RegExp, (substring: string, ...args: any[]) => string]
  )[],
) {
  return replacers.reduce((acc, [regex, replacement]) => {
    // @ts-expect-error - TS doesn't know that the second argument to replace can be a function
    return acc.replace(regex, replacement)
  }, text)
}

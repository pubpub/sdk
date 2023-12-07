/**
 * Removes escape characters and backticks from a given text.
 *
 * @param text - The text to unescape.
 * @returns The unescaped text.
 */
export function unEscape(text: string): string {
  return text.replace(/\\+/g, '').replace(/`/g, '')
}

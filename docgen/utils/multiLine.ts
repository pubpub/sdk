/**
 * Replaces occurrences of '{' or ';' in the given text with the same character followed by a newline character.
 *
 * @param text - The input text.
 * @returns The modified text with newlines inserted after '{' or ';'.
 */
export function multiLine(text: string) {
  return text.replace(/([{;])/g, '$1\n')
}

import { SourceFile } from './types.js'

export const extensionToPandocFormat = {
  docx: 'docx+citations',
  epub: 'epub',
  html: 'html',
  md: 'markdown+tex_math_dollars',
  odt: 'odt',
  txt: 'markdown_strict',
  xml: 'jats',
  tex: 'latex',
} as const

export const bibliographyFormats = [
  'bib',
  'bibtex',
  'copac',
  'json',
  'yaml',
  'enl',
  'xml',
  'wos',
  'medline',
  'mods',
  'nbib',
  'ris',
] as const

export const exclusiveFileLabels = ['document', 'bibliography']

export const extensionFor = (fileName: string) => {
  const pieces = fileName.split('.')
  return pieces[pieces.length - 1]
}

const fileIsValidDocument = (file: SourceFile) =>
  Object.keys(extensionToPandocFormat).includes(extensionFor(file.clientPath))

export const getPotentialLabelsForFile = (file: SourceFile) => {
  const isDoc = fileIsValidDocument(file)
  return [
    isDoc && 'document',
    isDoc && 'supplement',
    isDoc && 'preamble',
    bibliographyFormats.some(
      (format) => format === extensionFor(file.clientPath)
    ) && 'bibliography',
  ].filter((x) => x)
}

export const labelFiles = (files: SourceFile[]) => {
  const bibliography = files.find(
    (file) => extensionFor(file.clientPath) === 'bib' && !file.label
  )
  const doc = files.find((file) => fileIsValidDocument(file) && !file.label)
  return files.map((file) => {
    if (file === doc) {
      return { ...file, label: 'document' as const }
    }
    if (file === bibliography) {
      return { ...file, label: 'bibliography' as const }
    }
    return file
  })
}

export type DocJson = { type: 'doc'; attrs: any; content: any[] }

export type CompressedChange = {
  s: Record<string, any>[]
  t: { '.sv': string } // This is a special Firebase value
  cId: string
  id: string
}

export type CompressedKeyable = CompressedChange | CompressedChange[]

type MissingImageWarning = {
  type: 'missingImage'
  path: string
  sourceFile?: string
  error?: string
  unableToFind?: true
  unableToUpload?: true
}

type MissingCitationWarning = {
  type: 'missingCitation'
  id: string
}

export type ResourceWarning = MissingImageWarning | MissingCitationWarning
export enum ReferenceableNodeType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Table = 'table',
  Math = 'math',
}

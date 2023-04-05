import { Node, Fragment, Slice } from 'prosemirror-model'
import { Step, ReplaceStep } from 'prosemirror-transform'
import {
  compressStateJSON,
  compressStepJSON,
  // @ts-expect-error pubpub no typey
} from 'prosemirror-compress-pubpub'
import uuid from 'uuid'
import { DatabaseReference, child, set } from 'firebase/database'
import { buildSchema } from './schema'

import { CompressedChange, CompressedKeyable, ResourceWarning } from './types'

export const firebaseTimestamp = { '.sv': 'timestamp' }

export const storeCheckpoint = async (
  firebaseRef: DatabaseReference,
  doc: Node,
  keyNumber: number
) => {
  const checkpoint = {
    d: compressStateJSON({ doc: doc.toJSON() }).d,
    k: keyNumber,
    t: firebaseTimestamp,
  }
  await Promise.all([
    set(child(firebaseRef, `checkpoints/${keyNumber}`), checkpoint),
    set(child(firebaseRef, 'checkpoint'), checkpoint),
    set(child(firebaseRef, `checkpointMap/${keyNumber}`), firebaseTimestamp),
  ])
}

export const flattenKeyables = (
  keyables: Record<string, CompressedKeyable>
): CompressedChange[] => {
  const orderedKeys = Object.keys(keyables).sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  )
  return orderedKeys.reduce((changes: CompressedChange[], key: string) => {
    const entry = keyables[key]
    if (Array.isArray(entry)) {
      return [...changes, ...entry]
    }
    return [...changes, entry]
  }, [])
}

export const createFirebaseChange = (
  steps: readonly Step[],
  clientId: string
): CompressedChange => {
  return {
    id: uuid.v4(), // Keyable Id
    cId: clientId, // Client Id
    s: steps.map((step) => compressStepJSON(step.toJSON())),
    t: firebaseTimestamp,
  }
}

export const getFirebaseConnectionMonitorRef = (ref: DatabaseReference) => {
  return child(ref.root, '.info/connected')
}

export type Doc = {
  rawMetadata?:
    | {
        [k: string]: any
      }
    | undefined
  doc: any
  warnings: ResourceWarning[]
  pandocErrorOutput: any
  proposedMetadata: ProposedMetadata
}

export type ProposedMetadata = {
  slug?: string
  title?: string
  description?: string
  attributions?: {
    name: string
    users:
      | Record<
          'id' | 'slug' | 'fullName' | 'initials' | 'avatar',
          string | undefined
        >[]
      | null
  }[]
  customPublishedAt?: string
  metadata?: Record<string, unknown>
}

export const writeDocumentToPubDraft = async (
  draftRef: DatabaseReference,
  document: Doc,
  {
    schema,
    initialDocKey,
    postProcessor,
  }: {
    schema?: ReturnType<typeof buildSchema>
    initialDocKey?: number
    /**
     * A function that takes the document and returns a new document.
     *
     * This allows you to do custom post-processing on the document to do things that the PubPub importer does not allow yet,
     * e.g. setting captions on Figures from an imported Word document.
     *
     */
    postProcessor?: (
      doc: Fragment,
      schema: ReturnType<typeof buildSchema>
    ) => Fragment
  } = {}
) => {
  const key = initialDocKey ? initialDocKey + 1 : 0

  const documentSchema = schema || buildSchema()
  const hydratedDocument = Node.fromJSON(documentSchema, document)
  let possiblyPostProcessedDocument: Fragment = hydratedDocument.content

  if (postProcessor) {
    try {
      possiblyPostProcessedDocument = postProcessor(
        hydratedDocument.content,
        documentSchema
      )
    } catch (err) {
      console.error('Error post-processing document', err)
    }
  }

  const documentSlice = new Slice(
    Fragment.from(possiblyPostProcessedDocument),
    0,
    0
  )
  const replaceStep = new ReplaceStep(0, 0, documentSlice)
  const change = createFirebaseChange([replaceStep], 'bulk-importer')
  await set(child(child(draftRef, 'changes'), key.toString()), change)
}

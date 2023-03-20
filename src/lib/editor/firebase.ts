import { Node, Fragment, Slice } from 'prosemirror-model'
import { Step, ReplaceStep } from 'prosemirror-transform'
import {
  compressStateJSON,
  compressStepJSON,
  // @ts-expect-error pubpub no typey
} from 'prosemirror-compress-pubpub'
import uuid from 'uuid'
import firebase from 'firebase'
import { buildSchema } from './schema'

import { CompressedChange, CompressedKeyable, ResourceWarning } from './types'

export const firebaseTimestamp = { '.sv': 'timestamp' }

export const storeCheckpoint = async (
  firebaseRef: firebase.database.Reference,
  doc: Node,
  keyNumber: number
) => {
  const checkpoint = {
    d: compressStateJSON({ doc: doc.toJSON() }).d,
    k: keyNumber,
    t: firebaseTimestamp,
  }
  await Promise.all([
    firebaseRef.child(`checkpoints/${keyNumber}`).set(checkpoint),
    firebaseRef.child('checkpoint').set(checkpoint),
    firebaseRef.child(`checkpointMap/${keyNumber}`).set(firebaseTimestamp),
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

export const getFirebaseConnectionMonitorRef = (
  ref: firebase.database.Reference
) => {
  return ref.root.child('.info/connected')
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
  draftRef: firebase.database.Reference,
  document: Doc,
  {
    schema,
    initalDocKey,
  }: {
    schema?: ReturnType<typeof buildSchema>
    initalDocKey?: string
  } = {}
) => {
  const key = initalDocKey ?? 0

  const documentSchema = schema || buildSchema()
  const hydratedDocument = Node.fromJSON(documentSchema, document)
  const documentSlice = new Slice(Fragment.from(hydratedDocument.content), 0, 0)
  const replaceStep = new ReplaceStep(0, 0, documentSlice)
  const change = createFirebaseChange([replaceStep], 'bulk-importer')
  await draftRef.child('changes').child(key.toString()).set(change)
}

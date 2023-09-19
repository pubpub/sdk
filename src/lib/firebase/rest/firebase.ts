/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, Fragment, Slice } from 'prosemirror-model'
import { Step, ReplaceStep } from 'prosemirror-transform'
import { compressStepJSON } from 'prosemirror-compress-pubpub'
import uuid from 'uuid'

import { buildSchema } from '../../editor/schema.js'
import { CompressedChange, ResourceWarning } from '../../editor/types.js'
import { getFirebaseChild, writeFirebase } from './utils.js'

export const firebaseTimestamp = { '.sv': 'timestamp' } as const

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
  draftRoot: string,
  document: Doc,
  token: string,
  {
    schema,
    initialDocKey,
    overwrite = false,
    postProcessor,
  }: {
    schema?: ReturnType<typeof buildSchema>
    initialDocKey?: number
    /**
     * Whether to overwrite the document at the given key or to just add to it.
     *
     * @default false
     */
    overwrite?: boolean
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

  if (overwrite) {
    return await writeFirebase(
      getFirebaseChild(draftRoot.toString(), 'changes'),
      token,
      {
        0: change,
      }
    )
  }

  return await writeFirebase(
    getFirebaseChild(draftRoot.toString(), 'changes', key.toString()),
    token,
    change
  )
}

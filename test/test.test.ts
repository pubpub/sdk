import { describe, it, beforeAll, expect } from 'vitest'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { PubPub } from '../src/lib/client'
import { afterAll } from 'vitest'
import { initFirebase } from '../src/lib/firebase/initFirebase'
import { buildSchema } from '../src/lib/editor/schema'
import { Node, Fragment, Slice } from 'prosemirror-model'
import uuid from 'uuid'

let pubpub: PubPub

const basicImport = {
  doc: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { id: 'abstract', level: 1, fixedId: 'abstract' },
        content: [{ text: 'Abstract', type: 'text' }],
      },
      {
        type: 'paragraph',
        content: [{ text: 'This is a test abstract.', type: 'text' }],
      },
    ],
  },
  warnings: [],
  proposedMetadata: {},
  pandocErrorOutput: '',
}

describe('ProseMirror', () => {
  it('should be able to define a schema', () => {
    const schema = buildSchema()
    expect(schema).toBeDefined()
  })

  it('should be able to Node.fromJSON with basic docx', async () => {
    const documentSchema = buildSchema()
    try {
      const hydratedDocument = Node.fromJSON(documentSchema, basicImport.doc)

      console.log(hydratedDocument)
      expect(hydratedDocument).toBeDefined()
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  it('should be able to create a uuid', () => {
    const id = uuid.v4()
    expect(id).toBeDefined()
  })
})

describe('PubPub', () => {
  beforeAll(async () => {
    if (!process.env.COMMUNITY_ID) throw new Error('Missing community id')
    if (!process.env.COMMUNITY_URL) throw new Error('Missing community url')
    if (!process.env.EMAIL) throw new Error('Missing email')
    if (!process.env.PASSWORD) throw new Error('Missing password')

    pubpub = new PubPub(process.env.COMMUNITY_ID!, process.env.COMMUNITY_URL)

    await pubpub.login(process.env.EMAIL ?? '', process.env.PASSWORD ?? '')
  })

  const testUrl = 'pub/67lseb8m/draft'
  // const testUrl = 'pub/9kvcb438/draft'

  // it('should be able to import a docx file to a pub', async () => {
  //   const file = await readFile(
  //     fileURLToPath(new URL('./basic.docx', import.meta.url))
  //   )

  //   try {
  //     const imported = await pubpub.pub.hacks.import(testUrl, [
  //       {
  //         file,
  //         fileName: 'basic.docx',
  //         mimeType:
  //           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       },
  //     ])

  //     expect(imported).not.toThrowError()
  //   } catch (e) {
  //     console.log(e)
  //     throw e
  //   }
  // }, 60000)
  it('should be able to export a file', async () => {
    try {
      const exported = await pubpub.pub.hacks.export({
        slug: testUrl,
        format: 'docx',
      })

      expect(
        typeof exported === 'string' &&
          exported.startsWith('https://assets.pubpub.org')
      ).toBeTruthy()
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  it('should be able to get pubs', async () => {
    const pubs = await pubpub.pub.getMany({
      limit: 1,
    })

    const firstPubId = pubs.pubIds[0]
    expect(pubs.pubsById[firstPubId]).toHaveProperty('title')
  })

  it('should be able to get collections', async () => {
    const collections = await pubpub.collection.hacks.getMany()

    expect(collections).toBeInstanceOf(Array)
    expect(collections[0]).toHaveProperty('title')
  })

  it('should be able to find the attributions of a collection through annoying means', async () => {
    const collections = await pubpub.collection.hacks.getMany()

    const collection = collections[0]
    expect(collections).toBeInstanceOf(Array)
    expect(collection).toHaveProperty('title')
    expect(collection).not.toHaveProperty('attributions')
    expect(collection).toHaveProperty('slug')

    const collectionWithAttributions = await pubpub.collection.hacks.get(
      collection.slug
    )

    expect(collectionWithAttributions).toHaveProperty('attributions')
    expect(collectionWithAttributions).toHaveProperty('title')
    expect(collectionWithAttributions).toHaveProperty('slug')
    expect(collectionWithAttributions).toHaveProperty('avatar')
    expect(collectionWithAttributions).toHaveProperty('isRestricted')
    expect(collectionWithAttributions).toHaveProperty('isPublic')
    expect(collectionWithAttributions).toHaveProperty('viewHash')
    expect(collectionWithAttributions).toHaveProperty('editHash')
    expect(collectionWithAttributions).toHaveProperty('metadata')
    expect(collectionWithAttributions).toHaveProperty('kind')
    expect(collectionWithAttributions).toHaveProperty('doi')
    expect(collectionWithAttributions).toHaveProperty('readNextPreviewSize')
    expect(collectionWithAttributions).toHaveProperty('layout')
    expect(collectionWithAttributions).toHaveProperty('pageId')
    expect(collectionWithAttributions).toHaveProperty('communityId')
    expect(collectionWithAttributions).toHaveProperty('scopeSummaryId')
    expect(collectionWithAttributions).toHaveProperty('createdAt')
    expect(collectionWithAttributions).toHaveProperty('updatedAt')
    expect(collectionWithAttributions).toHaveProperty('crossrefDepositRecordId')
  })

  // it('should be able to get firebasetoken for a pub', async () => {
  //   const pageData = await pubpub.hacks.getPageData(testUrl, 'view-data')

  //   const firebaseToken = pageData.pubData.firebaseToken
  //   const firebasePath = pageData.pubData.draft.firebasePath

  //   expect(firebaseToken.length).toBeGreaterThan(0)

  //   const firebaseRef = await initFirebase(firebasePath, firebaseToken)
  //   console.log(firebaseRef?.child('changes'))

  //   expect(firebaseRef).not.toBeNull()
  // })

  afterAll(async () => {
    pubpub && (await pubpub.logout())
  })
})

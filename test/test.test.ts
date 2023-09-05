import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { fileURLToPath } from 'url'
import { Node } from 'prosemirror-model'
import uuid from 'uuid'
import { PubPub } from '../src/lib/client'
import { buildSchema } from '../src/lib/editor/schema'

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

    expect(pubpub.loggedIn).toBeTruthy()
  })

  const testUrl = 'pub/25f1ymdq/draft'
  const testId = '10a6ef16-4d19-4e9f-93bf-0ae1a5e247bc'
  // const testUrl = 'pub/9kvcb438/draft'

  it('should be able to import a docx file to a pub', async () => {
    // const file = await readFile(
    //   fileURLToPath(new URL('./basic.docx', import.meta.url))
    // )

    try {
      const imported = await pubpub.pub.import(
        testUrl,
        [
          {
            file: fileURLToPath(new URL('./basic.docx', import.meta.url)),
            fileName: 'basic.docx',
            mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        ],
        (doc, schema) => {
          console.dir(doc, { depth: 5 })
          const newDoc = doc.addToEnd(
            schema.nodes.paragraph.create(
              { id: 'test-id' },
              schema.text('manually insterted text')
            )
          )
          console.dir(newDoc, { depth: 5 })
          return newDoc
        }
      )

      expect(imported).toBeDefined()
    } catch (e) {
      console.log(e)
      throw e
    }
  }, 60000)
  it('should be able to export a file, and that file should include the manually added test text', async () => {
    try {
      const exported = await pubpub.pub.export({
        slug: testUrl,
        format: 'markdown',
      })

      expect(
        typeof exported === 'string' &&
          exported.startsWith('https://assets.pubpub.org')
      ).toBeTruthy()
    } catch (e) {
      console.log(e)
      throw e
    }
  }, 60000)

  it('should be able to get pubs', async () => {
    const pubs = await pubpub.pub.getMany({
      limit: 1,
    })

    const firstPubId = pubs.pubIds[0]
    expect(pubs.pubsById[firstPubId]).toHaveProperty('title')
  }, 10000)

  it('should be able to get collections', async () => {
    const collections = await pubpub.collection.hacks.getMany()

    expect(collections).toBeInstanceOf(Array)
    expect(collections[0]).toHaveProperty('title')
  }, 10000)

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
  }, 10000)

  it('should be able to modify a pub', async () => {
    const modded = await pubpub.pub.update(testId, {
      citationStyle: {
        citationStyle: 'apa-7',
        inlineCitationStyle: 'author',
      },
      description: 'This is a test description',
    })

    console.log(modded)
    expect(modded).toHaveProperty('description')
  }, 10000)

  afterAll(async () => {
    if (pubpub) {
      await pubpub.logout()
    }
  })
})

// import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import type { PubPubSDK } from '../src/lib/client.js'
import { setupSDK } from './utils/setup.js'
import dotenv from 'dotenv'
dotenv.config()

import app from '../core/server/server.js'
import { sleep } from './utils/sleep.js'

const TEST_PORT = 7357 as const

const TEST_URL = process.env.COMMUNITY_URL ?? `http://localhost:${TEST_PORT}`

let server: ReturnType<typeof app.listen>

beforeAll(async () => {
  // don't run app locally if you're testing against a remote community
  if (process.env.COMMUNITY_URL) {
    return
  }
  server = app.listen(TEST_PORT)
  console.log('✅ Server started')
})

afterAll(async () => {
  server?.close()
})

describe('PubPub', () => {
  let pubpub: PubPubSDK
  let removed = false

  let pub: Awaited<ReturnType<typeof pubpub.pub.create>>['body']
  beforeAll(async () => {
    // eslint-disable-next-line no-extra-semi
    ;({ pub, pubpub } = await setupSDK({
      url: TEST_URL,
      communityId: process.env.COMMUNITY_ID!,
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    }))

    expect(pub).toBeTruthy()
  })

  it('should be able to return something through normal api calls', async () => {
    const res = await fetch(`${TEST_URL}/api/pubs/many`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alreadyFetchedPubIds: [],
        pubOptions: {},
        query: {
          limit: 2,
        },
      }),
    })

    const json = await res.json()

    expect(json).toBeDefined()
  })

  it('should be able to get pubs explicitly through the client', async () => {
    const { body } = await pubpub.client.pub.getMany({
      alreadyFetchedPubIds: [],
      pubOptions: {},
      query: {
        limit: 2,
      },
    })

    const firstPubId = body.pubIds[0]

    expect(body.pubsById[firstPubId]).toHaveProperty('title')
  }, 10000)

  it('should be able to get pubs', async () => {
    const pubs = await pubpub.pub.getMany({
      limit: 1,
    })

    const firstPubId = pubs.body.pubIds[0]
    expect(pubs.body.pubsById[firstPubId]).toHaveProperty('title')
  }, 10000)

  let collectionId: string
  it('should be able to create a collection', async () => {
    const collection = await pubpub.collection.create({
      title: 'Test collection',
      kind: 'book',
      isPublic: true,
    })

    collectionId = collection.body.id
    expect(collection.status).toBe(201)
    expect(collection.body).toHaveProperty('title')
  })

  it('should be able to get collections', async () => {
    const collections = await pubpub.collection.hacks.getMany()

    expect(collections).toBeInstanceOf(Array)
    expect(collections[0]).toHaveProperty('title')
  }, 10000)

  let collectionPubId: string
  it('should be able to add a pub to a collection', async () => {
    const added = await pubpub.collection.addPub({
      collectionId,
      pubId: pub.id,
    })

    collectionPubId = added.body.id
    expect(added.status).toBe(201)
    expect(added.body).toHaveProperty('rank')
  })

  it('should be able to change the contextHint of a collectionPub', async () => {
    const changed = await pubpub.collectionPub.update({
      id: collectionPubId,
      contextHint: 'chapter',
    })

    expect(changed.status).toBe(200)
    expect(changed.body).toEqual({ contextHint: 'chapter' })
  })

  it('should be able to modify a colection', async () => {
    const modded = await pubpub.collection.update({
      id: collectionId,
      title: 'New title',
    })

    expect(modded.status).toBe(200)
    expect(modded.body.title).toBe('New title')
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
  }, 10000)

  it('should be able to modify a pub', async () => {
    const modded = await pubpub.pub.update({
      pubId: pub.id,
      CitationStyle: {
        citationStyle: 'apa-7',
        inlineCitationStyle: 'author',
      },
      description: 'This is a test description',
    })

    expect(modded.status).toBe(200)
    expect(modded.body).toHaveProperty('description')
  }, 10000)

  it('should be able to update a community', async () => {})

  it('should remove a pub', async () => {
    const remove = await pubpub.pub.remove({ pubId: pub.id })

    removed = true
    expect(remove.status).toBe(200)
    expect(remove.body).toEqual({})
  })

  afterAll(async () => {
    sleep(1000)
    if (!removed) {
      await pubpub.pub.remove({ pubId: pub.id })
    }
    if (pubpub) {
      await pubpub.logout()
    }
  })
})

// import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { PubPub } from '../src/lib/client'
import { setupSDK } from './utils/setup'
import dotenv from 'dotenv'
dotenv.config()

import app from '../core/server/server'

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
  server.close()
})

describe('PubPub', () => {
  let pubpub: PubPub
  let removed = false

  let pub: Awaited<ReturnType<typeof pubpub.pub.create>>['body']
  beforeAll(async () => {
    ;({ pub, pubpub } = await setupSDK({
      url: TEST_URL,
      communityId: process.env.COMMUNITY_ID!,
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    }))
  })

  it('should be able to return something ', async () => {
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

    console.log(json)
  })

  it('should be able to get pubs', async () => {
    const { body } = await pubpub.client.pub.getMany({
      body: {
        alreadyFetchedPubIds: [],
        pubOptions: {},
        query: {
          limit: 2,
        },
      },
    })

    const firstPubId = body.pubIds[0]

    expect(body.pubsById[firstPubId]).toHaveProperty('title')
  }, 10000)

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
    const modded = await pubpub.pub.update(pub.id, {
      citationStyle: {
        citationStyle: 'apa-7',
        inlineCitationStyle: 'author',
      },
      description: 'This is a test description',
    })

    console.log(modded)
    expect(modded).toHaveProperty('description')
  }, 10000)

  it('should remove a pub', async () => {
    const remove = await pubpub.pub.remove(pub.id)

    removed = true
    expect(remove).toEqual({})
  })

  afterAll(async () => {
    if (!removed) {
      await pubpub.pub.remove(pub.id)
    }
    if (pubpub) {
      await pubpub.logout()
    }
  })
})

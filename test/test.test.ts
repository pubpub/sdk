import type { PubPubSDK } from '../src/lib/client.js'
import { setupSDK } from './utils/setup.js'
import app from '../core/server/server.js'
import { sleep } from './utils/sleep.js'
import { resolve } from 'path'

import dotenv from 'dotenv'

dotenv.config({
  path: resolve(__dirname, '../../.env'),
})

const TEST_PORT = 7357 as const

const TEST_URL = `http://localhost:${TEST_PORT}`

let server: ReturnType<typeof app.listen>

beforeAll(async () => {
  // // don't run app locally if you're testing against a remote community
  // if (process.env.COMMUNITY_URL) {
  //   return
  // }
  server = app.listen(TEST_PORT)
  console.log('✅ Server started')
}, 30000)

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
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    }))

    expect(pub).toBeTruthy()
  }, 30000)

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

  it('should be able to get a community', async () => {
    const {
      body: [community],
    } = await pubpub.community.getCommunities()

    const { body: communtiy2 } = await pubpub.community.get({
      params: {
        id: community.id,
      },
    })

    expect(communtiy2.id).toEqual(community.id)
  })

  it('should be able to get pubs', async () => {
    const { body: pubs } = await pubpub.pub.getMany({
      query: {
        limit: 1,
      },
    })

    const first = pubs[0]
    expect(first).toHaveProperty('title')
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
    const { body: collections } = await pubpub.collection.getMany()

    expect(Array.isArray(collections)).toBeTruthy()
    expect(collections[0]).toHaveProperty('title')
  }, 10000)

  let collectionPubId: string
  it('should be able to add a pub to a collection', async () => {
    const added = await pubpub.collectionPub.create({
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

  it('should be able to get collections with attributions', async () => {
    const { body: collections } = await pubpub.collection.getMany({
      query: { include: ['attributions'] },
    })

    const collection = collections[0]
    expect(Array.isArray(collections)).toBeTruthy()
    expect(collection).toHaveProperty('title')
    expect(collection.attributions).toEqual([])

    const { body: createdAttribution } =
      await pubpub.collectionAttribution.create({
        collectionId: collection.id,
        name: 'Test attribution',
        roles: ['Guy'],
      })

    const { body: collectionWithAttributions } = await pubpub.collection.get({
      params: { slugOrId: collection.slug },
    })

    expect(collectionWithAttributions.attributions?.[0]?.id).toEqual(
      createdAttribution.id,
    )

    await pubpub.collectionAttribution.remove({
      id: createdAttribution.id,
      collectionId: collection.id,
    })
  }, 10000)

  it('should be able to modify a pub', async () => {
    const modded = await pubpub.pub.update({
      pubId: pub.id,
      description: 'This is a test description',
    })

    expect(modded.status).toBe(200)
    expect(modded.body).toHaveProperty('description')
  }, 10000)

  // it('should be able to update a community', async () => {})

  let importedPubId: string
  it('should be able to import a pub', async () => {
    const { body } = await pubpub.pub.text.import({
      files: [
        {
          blob: new Blob(['heya'], { type: 'text/plain' }),
          filename: 'hey.txt',
        },
        {
          blob: new Blob(['heya'], { type: 'text/plain' }),
          filename: 'hey.txt',
        },
      ],
      title: 'imported pub',
    })
    const { doc, pub } = body

    expect(JSON.stringify(doc)?.includes('heya')).toBeTruthy()
    expect(pub).toHaveProperty('title')
    expect(pub.title).toBe('imported pub')

    importedPubId = pub.id
  }, 20000)

  it('should be able to import to a pub', async () => {
    const { body } = await pubpub.pub.text.importToPub(
      {
        files: [
          {
            blob: new Blob([':D'], { type: 'text/plain' }),
            filename: 'happy.txt',
          },
        ],
        method: 'append',
      },
      {
        params: {
          pubId: importedPubId,
        },
      },
    )

    const { doc, pub } = body

    expect(pub.id).toEqual(importedPubId)

    const stringDoc = JSON.stringify(doc)
    expect(stringDoc).toContain(':D')
    expect(stringDoc).toContain('heya')
  }, 20000)

  it('should be able to query things', async () => {
    const { body: pubs } = await pubpub.pub.getMany({
      query: {
        title: {
          contains: 'imported',
        },
      },
    })

    const first = pubs[0]
    expect(first).toHaveProperty('title')
    expect(first.title).toBe('imported pub')

    await pubpub.pub.remove({ pubId: first.id })
  })

  it('can get pubs created in the last minute', async () => {
    const oneMinuteAgo = new Date(Date.now() - 1000 * 60)
    const result = await pubpub.pub.getMany({
      query: {
        createdAt: {
          gt: oneMinuteAgo,
        },
      },
    })
    console.dir(result, { depth: null })

    result.body.forEach((pub) => {
      expect(Number(new Date(pub.createdAt!))).toBeGreaterThan(
        Number(oneMinuteAgo),
      )
    })
  })

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

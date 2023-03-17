import { describe, it, beforeAll, expect } from 'vitest'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { PubPub } from '../src/lib/client'
import { afterAll } from 'vitest'

let pubpub: PubPub

describe('PubPub', () => {
  beforeAll(async () => {
    if (!process.env.COMMUNITY_ID) throw new Error('Missing community id')
    if (!process.env.COMMUNITY_URL) throw new Error('Missing community url')
    if (!process.env.EMAIL) throw new Error('Missing email')
    if (!process.env.PASSWORD) throw new Error('Missing password')

    pubpub = new PubPub(process.env.COMMUNITY_ID!, process.env.COMMUNITY_URL)

    await pubpub.login(process.env.EMAIL ?? '', process.env.PASSWORD ?? '')
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

  const testUrl = 'pub/67lseb8m/draft'

  it('should be able to get firebasetoken for a pub', async () => {
    const pageData = await pubpub.hacks.getPageData(testUrl, 'view-data')

    const firebaseToken = pageData.pubData.firebaseToken

    expect(firebaseToken.length).toBeGreaterThan(0)
  })

  afterAll(async () => {
    pubpub && (await pubpub.logout())
  })
})

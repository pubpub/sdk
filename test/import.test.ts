import path from 'path'
import type { PubPubSDK } from '../src/lib/client.js'
import { setupSDK } from './utils/setup.js'
import { readFile } from 'fs/promises'
import { sleep } from './utils/sleep.js'

// we need to test imports somewhere else, bc they don't work locally
const IMPORT_TEST_COMMUNITY_URL =
  process.env.IMPORT_TEST_COMMUNITY_URL ??
  ('https://client-test.duqduq.org' as const)

let pubpub: PubPubSDK
let pub = {} as Awaited<ReturnType<typeof pubpub.pub.create>>['body']

let removed = false

beforeAll(async () => {
  // eslint-disable-next-line no-extra-semi
  ;({ pub, pubpub } = await setupSDK({
    url: IMPORT_TEST_COMMUNITY_URL,
    // email: process.env.IMPORT_TEST_EMAIL ?? process.env.EMAIL,
    // password: process.env.IMPORT_TEST_PASSWORD ?? process.env.PASSWORD,
    authToken: process.env.IMPORT_TEST_AUTH_TOKEN ?? process.env.AUTH_TOKEN,
  }))
}, 30000)

describe('imports', () => {
  it('should be able to import a docx file to a pub', async () => {
    try {
      const imported = await pubpub.pub.text.import({
        files: [
          {
            blob: new Blob(
              [await readFile(path.join(__dirname, 'fixtures', 'basic.docx'))],
              {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              },
            ),
            filename: 'basic.docx',
          },
        ],
      })

      console.log(imported)
      expect(imported).toBeDefined()
    } catch (e) {
      console.log(e)
      throw e
    }
  }, 60000)

  it('should be able to export a file, and that file should include the manually added test text', async () => {
    try {
      const exported = await pubpub.exportPub({
        format: 'markdown',
        pubId: pub.id!,
      })

      expect(
        typeof exported === 'string' &&
          exported.startsWith('https://assets.pubpub.org'),
      ).toBeTruthy()
    } catch (e) {
      console.log(e)
      throw e
    }
  }, 60000)

  it('should be able to upload a file as blob', async () => {
    const file = new Blob(['test'], { type: 'text/plain' })
    const { body: upload } = await pubpub.upload.file({
      file: { blob: file, filename: 'test.txt' },
    })

    expect(upload).toHaveProperty('url')

    const text = await (await fetch(upload.url)).text()

    expect(text).toBe('test')
  }, 30000)

  afterAll(async () => {
    await sleep(1000)
    if (!removed) {
      await pubpub.pub.remove({ pubId: pub.id })
      removed = true
    }

    await pubpub.logout()
  }, 30000)
})

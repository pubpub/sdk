import path from 'path'
import { PubPubSDK } from '../src/lib/client.js'
import { setupSDK } from './utils/setup.js'
import { readFile } from 'fs/promises'
import { sleep } from './utils/sleep.js'

// we need to test imports somewhere else, bc they don't work locally
const IMPORT_TEST_COMMUNITY_URL =
  process.env.IMPORT_TEST_COMMUNITY_URL ??
  ('https://client-test.pubpub.org' as const)

const IMPORT_TEST_COMMUNITY_ID =
  process.env.IMPORT_TEST_COMMUNITY_ID ??
  ('94873d35-f9ca-4e2d-9c33-681dc893d302' as const)

describe('imports', () => {
  let pubpub: PubPubSDK
  let pub = {} as Awaited<ReturnType<typeof pubpub.pub.create>>['body']

  let removed = false
  let draftPath = ''

  beforeAll(async () => {
    // eslint-disable-next-line no-extra-semi
    ;({ pub, pubpub, draftPath } = await setupSDK({
      url: IMPORT_TEST_COMMUNITY_URL,
      communityId: IMPORT_TEST_COMMUNITY_ID,
      email: process.env.IMPORT_TEST_EMAIL ?? process.env.EMAIL,
      password: process.env.IMPORT_TEST_PASSWORD ?? process.env.PASSWORD,
    }))
  })

  it('should be able to import a docx file to a pub', async () => {
    try {
      const imported = await pubpub.pub.import(
        draftPath,
        [
          {
            file: await readFile(
              path.join(__dirname, 'fixtures', 'basic.docx')
            ), //fileURLToPath(new URL('./basic.docx', import.meta.url)),
            fileName: 'basic.docx',
            mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        ],
        (doc, schema) => {
          const newDoc = doc.addToEnd(
            schema.nodes.paragraph.create(
              { id: 'test-id' },
              schema.text('manually insterted text')
            )
          )
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
        slug: draftPath.replace('/draft', ''),
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

  afterAll(async () => {
    await sleep(1000)
    if (!removed) {
      await pubpub.pub.remove({ pubId: pub.id })
      removed = true
    }

    await pubpub.logout()
  })
})

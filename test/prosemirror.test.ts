import { Node } from 'prosemirror-model'
import uuid from 'uuid'
import { buildSchema } from '../src/lib/editor/schema'

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

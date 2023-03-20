import { NodeSpec } from 'prosemirror-model'
const codeSchema: { [key: string]: NodeSpec } = {
  code_block: {
    content: 'text*',
    group: 'block',
    attrs: {
      lang: { default: null },
      id: { default: null },
    },
    code: true,
    selectable: false,
  },
}

export default codeSchema

// import { DOMOutputSpec } from 'prosemirror-model'
// import { counter } from './reactive/counter'
// import { structuredCitation } from './reactive/structuredCitation'

export default {
  footnote: {
    atom: true,
    reactive: true,
    attrs: {
      id: { default: null },
      href: { default: null },
      value: { default: '' },
      structuredValue: { default: '' },
    },
    // reactiveAttrs: {
    //   count: counter(),
    //   citation: structuredCitation('structuredValue'),
    // },
    inline: true,
    group: 'inline',
  },
}

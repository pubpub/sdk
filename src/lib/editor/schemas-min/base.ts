import { DOMOutputSpec, NodeSpec } from 'prosemirror-model'

export const baseNodes: { [key: string]: NodeSpec } = {
  doc: {
    content: 'block+',
    attrs: {
      meta: { default: {} },
    },
  },
  paragraph: {
    selectable: false,
    // reactive: true,
    content: 'inline*',
    group: 'block',
    attrs: {
      id: { default: null },
      class: { default: null },
      textAlign: { default: null },
      rtl: { default: null },
    },
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    attrs: {
      id: { default: null },
    },
    selectable: false,
  },
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    selectable: true,
  },
  heading: {
    attrs: {
      level: { default: 1 },
      fixedId: { default: '' },
      id: { default: '' },
      textAlign: { default: null },
      rtl: { default: null },
    },
    content: 'inline*',
    group: 'block',
    defining: true,
    selectable: false,
  },
  ordered_list: {
    content: 'list_item+',
    group: 'block',
    attrs: {
      id: { default: null },
      order: { default: 1 },
      rtl: { default: null },
    },
    selectable: false,
  },
  bullet_list: {
    content: 'list_item+',
    group: 'block',
    attrs: {
      id: { default: null },
      rtl: { default: null },
    },
    selectable: false,
  },
  list_item: {
    content: 'paragraph block*',
    defining: true,
    selectable: false,
  },
  text: {
    inline: true,
    group: 'inline',
  },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
  },
}

export const baseMarks = {
  em: {},

  strong: {},
  link: {
    inclusive: false,
    attrs: {
      href: { default: '' },
      title: { default: null },
      target: { default: null },
    },
  },
  sub: {},
  sup: {},
  strike: {},
  code: {},
}

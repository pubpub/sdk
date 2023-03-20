// import { counter } from './reactive/counter'

export default {
  equation: {
    atom: true,
    attrs: {
      id: { default: null },
      value: { default: '' },
      html: { default: '' },
      renderForPandoc: { default: false },
    },

    inline: true,
    group: 'inline',
    draggable: false,
  },
  block_equation: {
    atom: true,
    reactive: true,
    attrs: {
      id: { default: null },
      value: { default: '' },
      html: { default: '' },
      renderForPandoc: { default: false },
      hideLabel: { default: false },
    },
    // reactiveAttrs: {
    //   count: counter({ useNodeLabels: true }),
    // },
    inline: false,
    group: 'block',
  },
}

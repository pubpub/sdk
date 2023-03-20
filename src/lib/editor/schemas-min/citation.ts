export default {
  citation: {
    atom: true,
    reactive: true,
    attrs: {
      id: { default: null },
      href: { default: null },
      value: { default: '' },
      unstructuredValue: { default: '' },
      customLabel: { default: '' },
    },
    // reactiveAttrs: {
    //   count: counter({
    //     nodeFingerprintFn: (node) => [
    //       node.attrs.value,
    //       node.attrs.unstructuredValue,
    //     ],
    //   }),
    //   citation: structuredCitation('value'),
    // },

    inline: true,
    group: 'inline',
  },
}

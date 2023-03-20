export default {
  audio: {
    atom: true,
    reactive: true,
    attrs: {
      id: { default: null },
      url: { default: null },
      size: { default: 50 }, // number as percentage
      align: { default: 'center' },
      caption: { default: '' },
      hideLabel: { default: false },
    },
    // reactiveAttrs: {
    //   count: counter({ useNodeLabels: true }),
    //   label: label(),
    // },

    inline: false,
    group: 'block',
  },
}

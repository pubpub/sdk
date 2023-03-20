export default {
  iframe: {
    atom: true,
    attrs: {
      id: { default: null },
      url: { default: '' },
      size: { default: 75 }, // number as percentage
      height: { default: 419 },
      align: { default: 'center' },
      caption: { default: '' },
    },

    inline: false,
    group: 'block',
  },
}

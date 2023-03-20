// import { counter } from './reactive/counter'
// import { label } from './reactive/label'

export default {
  image: {
    atom: true,
    reactive: true,
    attrs: {
      id: { default: null },
      url: { default: null },
      size: { default: 50 }, // number as percentage
      align: { default: 'center' },
      caption: { default: '' },
      altText: { default: '' },
      hideLabel: { default: false },
      fullResolution: { default: false },
      href: { default: null },
    },
    // reactiveAttrs: {
    //   count: counter({ useNodeLabels: true }),
    //   label: label(),
    // },

    inline: false,
    group: 'block',
  },
}

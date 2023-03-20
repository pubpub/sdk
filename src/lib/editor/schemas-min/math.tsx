// import { ReferenceableNodeType } from '../types'

// import { counter } from './reactive/counter'

// don't change this object; necessary for prosmirror-math package
const inlineMathSchema = {
  content: 'text*',
  inline: true,
  atom: true,
}

// don't change this object; necessary for prosmirror-math package
const mathDisplaySchema = {
  content: 'text*',
  atom: true,
  code: true,
}

export default {
  math_inline: {
    ...inlineMathSchema,
    group: 'inline',
  },
  math_display: {
    ...mathDisplaySchema,
    reactive: true,
    group: 'block',
    attrs: {
      id: { default: null },
      hideLabel: { default: false },
    },
    // reactiveAttrs: {
    //   count: counter({
    //     useNodeLabels: true,
    //     counterType: ReferenceableNodeType.Math,
    //   }),
    // },
  },
}

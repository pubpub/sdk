// /* eslint-disable react-hooks/rules-of-hooks */
// import { useDocumentState, useDeferredNode } from '@pubpub/prosemirror-reactive'

// import { buildLabel, getEnabledNodeLabelConfiguration } from '../utils'

export default {
  reference: {
    atom: true,
    isLeaf: true,
    inline: true,
    reactive: true,
    selectable: true,
    group: 'inline',
    attrs: {
      id: { default: null },
      targetId: { default: null },
    },
    // reactiveAttrs: {
    //   label: (node) => {
    //     const { targetId } = node.attrs
    //     const { nodeLabels } = useDocumentState()

    //     if (targetId) {
    //       return useDeferredNode(targetId, (target) => {
    //         if (!target) {
    //           return null
    //         }
    //         const configuration = getEnabledNodeLabelConfiguration(
    //           target,
    //           nodeLabels
    //         )
    //         if (configuration) {
    //           const { text } = configuration.nodeLabel
    //           return buildLabel(target, text)
    //         }
    //         return configuration
    //       })
    //     }

    //     return null
    //   },
    // },
  },
}

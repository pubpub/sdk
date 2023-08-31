import { Schema } from 'prosemirror-model'

import { defaultNodes, defaultMarks } from './schemas-min'

export const buildSchema = () =>
  //   customNodes = {},
  //   customMarks = {},
  //   nodeOptions = {}
  {
    let schemaNodes = {
      ...defaultNodes,
      // ...customNodes,
    }
    let schemaMarks = {
      ...defaultMarks,
      // ...customMarks,
    }
    /* Overwrite defaultOptions with custom supplied nodeOptions */
    //   Object.keys(nodeOptions).forEach((nodeKey) => {
    //     const nodeSpec = schemaNodes[nodeKey]
    //     if (nodeSpec) {
    //       schemaNodes[nodeKey].defaultOptions = {
    //         ...nodeSpec.defaultOptions,
    //         ...nodeOptions[nodeKey],
    //       }
    //     }
    //   })

    /* Filter out undefined (e.g. overwritten) nodes and marks */
    ;(Object.keys(defaultNodes) as (keyof typeof defaultNodes)[]).forEach(
      (nodeKey) => {
        if (!(nodeKey in defaultNodes)) {
          const { [nodeKey]: _, ...rest } = defaultNodes
          // // @ts-expect-error types??
          //    defaultNodes = rest
          //   delete schemaNodes[nodeKey]
        }
      }
    )
    Object.keys(schemaMarks).forEach((markKey) => {
      if (!schemaMarks[markKey]) {
        const { [markKey]: _, ...rest } = schemaMarks
        // // @ts-expect-error types??
        schemaMarks = rest
        //   delete schemaMarks[markKey]
      }
    })

    return new Schema({
      nodes: schemaNodes,
      marks: schemaMarks,
      topNode: 'doc',
    })
  }

export const editorSchema = buildSchema()

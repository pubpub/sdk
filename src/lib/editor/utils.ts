import { Selection } from 'prosemirror-state'
import { Node, Slice } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'
import type { DocJson } from './types'

export const getJSON = (editorView: EditorView) => {
  if (!editorView) {
    return null
  }
  return editorView.state.doc.toJSON() as DocJson
}

export const getTextFromDoc = (doc: Node, separator = '\n') => {
  return doc.textBetween(0, doc.nodeSize - 2, separator)
}

export const getTopLevelImages = (editorView: EditorView) => {
  const viewObject = getJSON(editorView)
  return viewObject
    ? viewObject.content.filter((con) => con.type === 'image')
    : []
}

export const getText = (editorView: EditorView, separator = '\n') => {
  if (!editorView) {
    return null
  }
  return getTextFromDoc(editorView.state.doc, separator)
}

export const importDocJson = (editorView: EditorView, docJson: DocJson) => {
  const doc = Node.fromJSON(editorView.state.schema, docJson)
  const tr = editorView.state.tr
  tr.setSelection(Selection.atStart(editorView.state.doc))
  tr.replaceSelection(new Slice(doc.content, 0, 0))
  editorView.dispatch(tr)
  return doc
}

import { baseNodes, baseMarks } from './base.js'
import citation from './citation.js'
import equation from './equation.js'
import math from './math.js'
import code from './code.js'
import file from './file.js'
import footnote from './footnote.js'
import iframe from './iframe.js'
import image from './image.js'
import table from './table.js'
import video from './video.js'
import audio from './audio.js'
import reference from './reference.js'
import deprecated from './deprecated.js'

export const defaultNodes = {
  ...baseNodes,
  ...code,
  ...citation,
  ...equation,
  ...math,
  ...file,
  ...footnote,
  ...iframe,
  ...image,
  ...table,
  ...video,
  ...audio,
  ...reference,
  ...deprecated,
}

export const defaultMarks = {
  ...baseMarks,
}

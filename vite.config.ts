/// <reference types="vitest" />
import { defineConfig } from 'vite'

import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    dir: 'test',
  },
  plugins: [
    viteTsConfigPaths({
      root: '.',
    }),
  ],
})

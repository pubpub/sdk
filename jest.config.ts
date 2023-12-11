// @ts-check
const esModules = ['react-stylable-diff'].join('|')

import type { Config } from '@jest/types'
import type { Config as SWCConfig } from '@swc/types'

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '\\.[s]?css$': '<rootDir>/core/utils/storybook/styleMock.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          // transform: {
          //   legacyDecorator: true,
          //   decoratorMetadata: true,
          // },
          parser: {
            syntax: 'typescript',
            decorators: true,
            tsx: true,
            dynamicImport: true,
          },
          target: 'es2017',
          baseUrl: '.',
          paths: {
            'utils/api/client': ['./core/utils/api/client.ts'],
            'utils/*': ['./core/utils/*'],
            facets: ['./core/facets/index.ts'],
            'facets/*': ['./core/facets/*'],
            types: ['./core/types/index.ts'],
            'types/*': ['./core/types/*'],
            'server/*': ['./core/server/*'],
            'client/*': ['./core/client/*'],
            components: ['./core/client/components/index.ts'],
            'components/*': ['./core/client/components/*'],
            containers: ['./core/client/containers/index.ts'],
            'containers/*': ['./core/client/containers/*'],
            'deposit/*': ['./core/deposit/*'],
            'workers/*': ['./core/workers/*'],
          },
        },
        module: {
          type: 'commonjs',
        },
      } satisfies SWCConfig,
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  //  globalSetup: '<rootDir>/stubstub/global/setup.ts',
  //  globalTeardown: '<rootDir>/stubstub/global/teardown.ts',
  //  setupFiles: ['<rootDir>/.jest/setup-env.js'],
  testMatch: ['<rootDir>/test/**/*.test.[jt]s?(x)'],
  logHeapUsage: true,
  forceExit: true,
  silent: false,
  verbose: true,
}

export default config

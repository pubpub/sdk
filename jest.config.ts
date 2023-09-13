// @ts-check
const esModules = ['react-stylable-diff'].join('|')

import { Config } from '@jest/types'
import { Config as SWCConfig } from '@swc/types'

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '\\.[s]?css$': '<rootDir>/core/utils/storybook/styleMock.js',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
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
}

export default config

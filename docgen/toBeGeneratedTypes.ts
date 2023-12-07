/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prettify } from '@ts-rest/core'
import type { PClient as C } from '../src/lib/client-types.js'

type PP = Prettify<C>

type P0 = {
  [K in keyof PP]: Prettify<PP[K]>
}

/**
 * @interface
 */
export type Client = {
  [K in keyof P0]: P0[K] extends (...args: any[]) => any
    ? P0[K]
    : Prettify<{
        [K2 in keyof P0[K]]: P0[K][K2] extends (...args: any[]) => any
          ? P0[K][K2]
          : Prettify<P0[K][K2]>
      }>
}

export type PubRaw = C['pub']

/**
 * Methods for interacting with pubs
 *
 * @interface
 */
export type Pub = {
  [K in keyof PubRaw]: Prettify<PubRaw[K]>
}

type CollectionRaw = C['collection']

/**
 * @interface
 */
export type Collection = {
  [K in keyof CollectionRaw]: Prettify<CollectionRaw[K]>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prettify } from '@ts-rest/core'
import type { PClient as C } from '../src/lib/client-types.js'

/**
 * @interface
 */
export type Client = {
  [K in keyof C]: Prettify<C[K]>
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

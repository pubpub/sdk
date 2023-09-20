/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '../../core/utils/api/client.js'

export type Client = ReturnType<typeof createClient>

type ObjectPath<T extends object, D extends string = ''> = {
  [K in keyof T]: `${D}${Exclude<K, symbol>}${
    | ''
    | (T[K] extends object ? ObjectPath<T[K], '.'> : '')}`
}[keyof T]

export type Prettify<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type ProxiedFunction<F> = F extends (
  ...args: infer A extends any[]
) => infer R
  ? A[0] extends { body: infer B }
    ? // if only the body is required, make the second argument optional
      Partial<Omit<A[0], 'body'>> extends Omit<A[0], 'body'>
      ? Partial<Omit<B, 'communityId'>> extends Omit<B, 'communityId'>
        ? // if there are no required arguments, you don't need to pass the body
          (
            body?: Prettify<Omit<B, 'communityId'>>,
            rest?: Prettify<Omit<A[0], 'body'>>
          ) => R
        : (
            body: Prettify<Omit<B, 'communityId'>>,
            rest?: Prettify<Omit<A[0], 'body'>>
          ) => R
      : (
          body: Prettify<Omit<B, 'communityId'>>,
          rest: Prettify<Omit<A[0], 'body'>>
        ) => R
    : (...args: A) => R
  : never

export type ProxiedClient<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? ProxiedFunction<T[K]>
    : T[K] extends object
    ? Prettify<ProxiedClient<T[K]>>
    : T[K]
}

/**
 * The raw client inferred from `ts-rest`.
 */
export type PClient = Prettify<ProxiedClient<Client>>

export type DeepAccess<
  O extends object,
  T extends ObjectPath<O> = ObjectPath<O>
> = T extends `${infer A extends Extract<keyof O, string>}.${infer B}`
  ? B extends `${infer C}.${infer D}`
    ? A extends keyof O
      ? O[A] extends object
        ? `${C}.${D}` extends ObjectPath<O[A]>
          ? DeepAccess<O[A], `${C}.${D}`>
          : never
        : never
      : never
    : A extends keyof O
    ? B extends keyof O[A]
      ? O[A][B]
      : never
    : never
  : T extends keyof O
  ? O[T]
  : never

export type DeepClient<
  T extends ObjectPath<PClient>,
  I extends 'in' | 'out' | 'func' = 'in'
> = DeepAccess<PClient, T> extends infer D
  ? D extends (args: infer A) => infer R
    ? I extends 'in'
      ? A
      : I extends 'out'
      ? Awaited<R>
      : D
    : D
  : never

export type DeepInput<T extends ObjectPath<PClient>> = DeepClient<T, 'in'>

export type DeepOutput<T extends ObjectPath<PClient>> = DeepClient<T, 'out'>

export type DeepInputBody<T extends ObjectPath<PClient>> =
  'body' extends keyof DeepInput<T>
    ? Omit<DeepInput<T>['body'], 'communityId'>
    : never

type ThingsThatAreNotObjects =
  | ((...args: any) => any)
  | number
  | string
  | boolean

type AreBothReallyObjects<T, U> = T extends Record<string, any>
  ? U extends Record<string, any>
    ? T extends ThingsThatAreNotObjects
      ? false
      : U extends ThingsThatAreNotObjects
      ? false
      : true
    : false
  : false

export type DeepMerge<
  T extends Record<string, any>,
  U extends Record<string, any>
> = Prettify<{
  [P in keyof T | keyof U]: P extends keyof T
    ? P extends keyof U
      ? AreBothReallyObjects<T[P], U[P]> extends true
        ? DeepMerge<T[P], U[P]>
        : U[P]
      : T[P]
    : P extends keyof U
    ? U[P]
    : never
}>

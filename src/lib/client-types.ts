/* eslint-disable @typescript-eslint/no-explicit-any */

import type { createClient } from 'utils/api/client'
import type { GetRequests, RemovedRequests } from './proxies.js'

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

export type ProxiedFunction<
  F,
  IsGetRoute extends boolean = false,
  BodyOrQuery extends 'body' | 'query' = IsGetRoute extends false
    ? 'body'
    : 'query',
> = F extends (...args: infer Arguments extends any[]) => infer R
  ? Arguments[0] extends { [K in BodyOrQuery]: infer B }
    ? // if only the body is required, make the second argument optional
      Partial<Omit<Arguments[0], BodyOrQuery>> extends Omit<
        Arguments[0],
        BodyOrQuery
      >
      ? // form bodies look like FormData & {...}, we don't want to require the FormData part
        FormData extends B
        ? (
            input: Exclude<B, FormData>,
            rest?: Prettify<Omit<Arguments[0], BodyOrQuery>>,
          ) => R
        : Partial<Omit<B, 'communityId'>> extends Omit<B, 'communityId'>
          ? // if there are no required arguments, you don't need to pass the body
            (
              input?: Prettify<Omit<B, 'communityId'>>, //Prettify<Omit<B, 'communityId'>>,
              rest?: Prettify<Omit<Arguments[0], BodyOrQuery>>,
            ) => R
          : (
              input: Prettify<Omit<B, 'communityId'>>,
              rest?: Prettify<Omit<Arguments[0], BodyOrQuery>>,
            ) => R
      : FormData extends B
        ? (
            input: Exclude<B, FormData>,
            rest: Prettify<Omit<Arguments[0], BodyOrQuery>>,
          ) => R
        : (
            input: Prettify<Omit<B, 'communityId'>>,
            rest: Prettify<Omit<Arguments[0], BodyOrQuery>>,
          ) => R
    : undefined extends Arguments[0]
      ? (input?: Prettify<Arguments[0]>) => R
      : (input: Prettify<Arguments[0]>) => R
  : never

export type ProxiedClient<T> = Omit<
  {
    [K in keyof T]: K extends RemovedRequests // do not include removed requests
      ? never
      : T[K] extends (...args: any[]) => any
        ? K extends GetRequests
          ? // don't proxy get requests
            T[K] extends (...args: infer A) => infer R
            ? A[0] extends { params: any }
              ? //  ? Q extends Partial<Q>
                (input: A[0]) => R
              : (input?: A[0]) => R
            : T[K]
          : ProxiedFunction<T[K]>
        : T[K] extends object
          ? ProxiedClient<T[K]>
          : T[K]
  },
  RemovedRequests
>

/**
 * The raw client inferred from `ts-rest`.
 * @interface
 */
export type PClient = ProxiedClient<Client>

export type DeepAccess<
  O extends object,
  T extends ObjectPath<O> = ObjectPath<O>,
> = T extends `${infer A extends Extract<keyof O, string>}.${infer B}`
  ? B extends `${infer C}.${infer D}`
    ? A extends keyof O
      ? O[A] extends object
        ? `${C}.${D}` extends infer DeepPath extends ObjectPath<O[A]>
          ? DeepAccess<O[A], DeepPath>
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
  I extends 'in' | 'out' | 'func' = 'in',
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
  U extends Record<string, any>,
> = {
  [K in keyof T]: K extends keyof T
    ? K extends keyof U
      ? AreBothReallyObjects<T[K], U[K]> extends true
        ? DeepMerge<T[K], U[K]>
        : U[K]
      : T[K]
    : K extends keyof U
      ? U[K]
      : never
} & {
  [K in keyof U as K extends keyof T ? never : K]: U[K]
}

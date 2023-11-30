/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client, PClient } from './client-types'

/**
 * Map of GET requests, used to correctly proxy the client
 *
 * There is no way of knowing from inspecting the client at runtime which requests are GET requests, so we have to manually specify them here
 */
export const getRequestsMap = {
  get: true,
  getMany: true,
  logout: true,
  uploadPolicy: true,
} as const

export type GetRequestMap = typeof getRequestsMap
export type GetRequests = keyof GetRequestMap

/**
 * This makes the client a bit nicer to use. The body is flattened and becomes the first arg, IF its not a get request,
 * and you don't need to pass the communityId.
 *
 * ```ts
 * ({ body: {content: string, communityId: string }, query: {} }) => ...
 * ```
 *
 * you can pass
 *
 * ```ts
 * ({ content: string }, { query: {} }) => ...
 *
 */
export function proxyClient(
  client: Client,
  communityId: string,
  getRequestsMap = {},
): PClient {
  // Recursive function to traverse and proxy the client object
  function proxyObject<T extends Record<string, any>>(obj: T) {
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') {
        newObj[key] = function (...args) {
          // Check if this is a GET request
          const isGetRequest = getRequestsMap[key] || false

          if (isGetRequest) {
            // For GET requests, split the arguments into query and rest

            const [query, rest] = args as [
              query: Record<string, unknown> | undefined,
              rest: Record<string, unknown> | undefined,
            ]
            /**
             * if it contains any of the following keys, the query is not the first argument, instead just treat it as a normal request
             * This happens when the query is optional
             */
            if (
              query &&
              ('params' in query ||
                'query' in query ||
                'cache' in query ||
                'body' in query)
            ) {
              return value.call(this, args[0])
            }

            return value.call(this, {
              query,
              ...rest,
            })
          } else {
            // For non-GET requests, split the first argument into body and the rest
            // and include the communityId in the body, as it is often needed and annoying to have to pass all the time
            const [body, rest] = args as [
              body: Record<string, unknown> | undefined,
              rest: Record<string, unknown> | undefined,
            ]
            return value.call(this, {
              body: { ...body, communityId },
              ...rest,
            })
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        // Recursively proxy nested objects
        newObj[key] = proxyObject(value)
      } else {
        newObj[key] = value
      }
    }
    return newObj
  }

  return proxyObject(client) as PClient
}

export function proxySDKWithClient(
  sdkInstance: any,
  clientInstance: Record<string, any>,
  prefix: string[] = [],
) {
  for (const key in clientInstance) {
    if (typeof clientInstance[key] === 'function') {
      const methodPath = [...prefix, key].join('.')
      if (typeof sdkInstance[key] === 'undefined') {
        sdkInstance[key] = async (...args: any[]) => {
          return clientInstance[key](...args)
        }
      } else {
        console.log(
          `Method ${methodPath} is already defined on SDK, using the override.`,
        )
      }
    } else if (typeof clientInstance[key] === 'object') {
      if (typeof sdkInstance[key] === 'undefined') {
        sdkInstance[key] = {}
      }
      proxySDKWithClient(sdkInstance[key], clientInstance[key], [
        ...prefix,
        key,
      ])
    }
  }
}

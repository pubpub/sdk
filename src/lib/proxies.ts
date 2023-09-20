/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, PClient } from './client-types'

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
  getRequestsMap = {}
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
            // For GET requests, just pass the first argument as-is
            return value.call(this, args[0])
          } else {
            // For non-GET requests, split the first argument into body and the rest
            // and include the communityId in the body, as it is often needed and annoying to have to pass all the time
            const [body, rest] = args as [
              body: Record<string, unknown> | undefined,
              rest: Record<string, unknown> | undefined
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
  prefix: string[] = []
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
          `Method ${methodPath} is already defined on SDK, using the override.`
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

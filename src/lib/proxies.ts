/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client, PClient } from './client-types.js'

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
 * Map of requests that accept files, used to correctly proxy the client
 *
 * Files need to be put at the bottom of the form data body, which means putting it as the last property in the body object.
 *
 * This is really hard to enforce, so we let users put the files wherever in the body and we move it to be the last.
 *
 * As an example, this
 * ```ts
 * client.pub.text.import({
 *  files: [new Blob(['Hello'], { type: 'text/plain' }), 'hello.txt'],
 *  title: "Hello",
 * })
 * ```
 *
 * would turn into this
 *
 * ```ts
 * formData.set(files, new Blob(['Hello'], { type: 'text/plain' }), 'hello.txt')
 * formData.set(, 'title')
 *
 */
export const filesRequestMap = {
  convert: true,
  importToPub: true,
  import: true,
} as const

export type FilesRequestMap = typeof filesRequestMap
export type FilesRequests = keyof FilesRequestMap
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
export function proxyClient({
  client,
  communityId,
  getRequestsMap = {},
  filesRequestsMap = {},
}: {
  client: Client
  communityId: string
  getRequestsMap?: Partial<GetRequestMap>
  filesRequestsMap?: Partial<FilesRequestMap>
}): PClient {
  // Recursive function to traverse and proxy the client object
  function proxyObject<T extends Record<string, any>>(obj: T) {
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') {
        newObj[key] = function (...args) {
          // Check if this is a GET request
          const isGetRequest = getRequestsMap[key] || false

          if (isGetRequest) {
            // for get requests, no proxying

            return value.call(this, ...args)
          }

          // For non-GET requests, split the first argument into body and the rest
          // and include the communityId in the body, as it is often needed and annoying to have to pass all the time
          // eslint-disable-next-line prefer-const
          let [body, rest] = args as [
            body: Record<string, unknown> | undefined,
            rest: Record<string, unknown> | undefined,
          ]

          const hasFiles = filesRequestsMap[key] || false
          if (hasFiles) {
            const {
              // @ts-expect-error doesn't matter if it doesn't have it
              files,
              // @ts-expect-error doesn't matter if it doesn't have it
              file,
              ...restBody
            } = body

            body = {
              ...restBody,
              ...(Boolean(file) && { file }),
              ...(Boolean(files) && { files }),
            }
          }

          return value.call(this, {
            body: { communityId, ...body },
            ...rest,
          })
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import SHA3 from 'crypto-js/sha3'
import encHex from 'crypto-js/enc-hex'
import { createClient } from 'utils/api/client.js'

import type {
  FacetsPayload,
  PubPutPayload,
  CommunityPutPayload,
  CommunityPutResponse,
  ExportFormats,
  WorkerTaskExportOutput,
} from './types.js'
import { generateHash } from './generateHash.js'

import { proxyClient, proxySDKWithClient, getRequestsMap } from './proxies.js'
import type {
  PClient,
  DeepInput,
  DeepMerge,
  Prettify,
  DeepOutput,
} from './client-types.js'

/**
 * Small test to see if a string looks like a pub slug,
 * such that we have better type inference for the result
 */
const looksLikePubSlug = (pub: string): pub is `pub/${string}` =>
  /pub\/.*?$/.test(pub)

export type PubPubSDK = DeepMerge<PClient, PubPub>

/**
 * PubPub API client
 *
 * @example
 *
 * ```ts
 *
 * const communityId = '...'
 * const communityUrl = 'https://openpresstiu.pubpub.org'
 *
 * const pubpub = new PubPub(communityId, communityUrl)
 *
 * await pubpub.login(process.env.EMAIL, process.env.PASSWORD)
 *
 * const pub = await pubpub.createPub(communityId)
 *
 *
 * ```
 */
export class PubPub {
  #cookie?: string
  loggedIn = false

  public client!: PClient

  /**
   * DO NOT CREATE THIS MANUALLY
   *
   * Use `PubPub.createSDK` instead
   */
  constructor(public communityId: string, public communityUrl: string) {}

  /**
   * Login to the PubPub API. Needs to be called before any other method.
   *
   * Automatically called when using `PubPub.createSDK`
   * */
  async login(email: string, password: string) {
    // don't use the client for this
    const response = await fetch(`${this.communityUrl}/api/login`, {
      method: 'POST',
      keepalive: false,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: SHA3(password).toString(encHex),
      }),
    })

    const cookie = response.headers
      .get('set-cookie')
      ?.replace(/.*(connect.sid=.*?);.*/ms, '$1')
    const data = response.body

    if (!cookie) {
      throw new Error(`Login failed
      ${data}`)
    }

    this.#cookie = cookie // .join('; ')
    const authenticatedClient = proxyClient(
      createClient({
        baseUrl: this.communityUrl,
        baseHeaders: {
          Cookie: this.#cookie || '',
        },
      }),
      this.communityId,
      getRequestsMap
    )

    this.client = authenticatedClient
    proxySDKWithClient(this, authenticatedClient)

    this.loggedIn = true
  }

  async logout() {
    const response = await this.client.logout()

    this.#cookie = undefined
    this.loggedIn = false
    console.log('Succesfully logged out!')

    return response
  }

  /**
   * Get the HTML content of a page
   */
  getPage = async ({ slug }: { slug: string }) => {
    const bareSlug = slug.replace(this.communityUrl, '')?.replace(/^\//, '')
    const response = await fetch(`${this.communityUrl}/${bareSlug}`, {
      method: 'GET',
      keepalive: false,
      headers: {
        Cookie: this.#cookie || '',
      },
    })

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      )
    }

    const data = await response.text()

    return data
  }

  /**
   * Helper method to update the facets of a pub or collection
   *
   * @since v1.0.0
   */
  declare facets: typeof this.client.facets

  /**
   * Methods for interacting with pages
   *
   * @since v1.0.0
   */
  declare page: typeof this.client.page

  queryManyPubs = async (options?: DeepInput<'pub.queryMany'>['query']) => {
    const { limit, offset, ordering, collectionIds, pubIds } = options ?? {}
    const response = await this.client.pub.queryMany({
      alreadyFetchedPubIds: [],
      pubOptions: {
        getCollections: true,
      },
      query: {
        ...(collectionIds
          ? { collectionIds }
          : pubIds
          ? { withinPubIds: pubIds }
          : {}),
        limit: limit ?? 50,
        offset: offset ?? 0,
        ordering: ordering ?? { field: 'updatedDate', direction: 'DESC' },
      },
    })

    return response
  }

  /**
   * Methods for interacting with pubs
   */
  pub = {
    /**
     * Create a new pub
     *
     * At the moment it isn't possible to set any properties of the Pub when creating it, so you'll have to call `pub.update` after creating it
     *
     * @param collectionId The id of the collection you want to add the pub to
     */
    // create: async ({ collectionId }: DeepInput<'pub.create'> = {}) => {
    //   const response = await this.client.pub.create({
    //     collectionId,
    //   })
    //   return response
    // },

    /**
     * Update a pub
     *
     * This is a helper method that calls `/api/facets` and `PUT /api/pubs` under the hood
     *
     * @param pubId The id of the pub you want to update
     * @param props The properties you want to update
     */
    update: async ({
      pubId,
      title,
      description,
      avatar,
      slug,
      customPublishedAt,
      downloads,
      htmlTitle,
      doi,
      License,
      NodeLabels,
      PubEdgeDisplay,
      PubHeaderTheme,
      CitationStyle,
    }: Prettify<
      Omit<PubPutPayload, 'communityId'> & FacetsPayload['facets']
    >) => {
      const uploadedDownloads = await Promise.all(
        (downloads ?? ([] as NonNullable<PubPutPayload['downloads']>)).map(
          async (download) => {
            if ('url' in download) {
              return download
            }

            const { fileOrPath } = download

            const { body: uploadedFile } = await this.upload({
              file: fileOrPath,
            })

            return {
              url: uploadedFile.url,
              type: 'formatted' as const,
              createdAt: new Date().toISOString(),
            }
          }
        )
      )

      const facetsPayload: FacetsPayload = {
        facets: {
          License,
          NodeLabels,
          PubEdgeDisplay,
          PubHeaderTheme,
          CitationStyle,
        },
        scope: {
          id: pubId,
          kind: 'pub',
        },
      }

      const putPayload: DeepInput<'pub.update'> = {
        pubId,
        title,
        description,
        doi,
        avatar,
        slug,
        customPublishedAt,
        downloads: uploadedDownloads.length ? uploadedDownloads : undefined,
        htmlTitle,
      }

      const shouldPostFacets =
        Object.values(facetsPayload.facets).filter((x) => !!x).length > 0
      const shouldPutPub =
        Object.values(putPayload).filter((x) => !!x).length > 1

      let response = {} as {
        status: 200
        body: Partial<DeepOutput<'pub.update'>['body']> & {
          facets?: (typeof facetsPayload)['facets']
        }
      }

      if (shouldPutPub) {
        const res = await this.client.pub.update(putPayload)
        response = res
      }

      if (shouldPostFacets) {
        const { status } = await this.facets.update({
          scope: facetsPayload.scope,
          facets: facetsPayload.facets,
        })
        // facets does not return the facets, so we just set them if nothing went wrong
        response.body.facets = facetsPayload.facets // facets as typeof facetsPayload.facets
        response.status =
          response.status === 200 || response.status === undefined
            ? status
            : response.status
      }
      return response
    },

    /**
     * Remove a pub
     *
     * @param pubId The id of the pub you want to remove
     */
    // remove: async (pubId: string) => {
    //   const response = await this.authedRequest(`pubs`, 'DELETE', {
    //     pubId,
    //     communityId: this.communityId,
    //   })
    //   return response
    // },

    export: async ({
      slug,
      pubId,
      format,
    }: (
      | { slug: string; pubId?: undefined }
      | { slug?: undefined; pubId: string }
    ) & {
      format: ExportFormats
      historyKey?: number
    }) => {
      if (!slug && pubId) {
        const { body: pub } = await this.client.pub.get({
          params: { slugOrId: pubId },
        })
        if (
          format === 'formatted' &&
          pub.downloads?.[0]?.type === 'formatted'
        ) {
          return pub.downloads[0].url
        }
        slug = pub.slug
      }

      if (!slug) {
        throw new Error('No slug or id provided')
      }

      if (!looksLikePubSlug(slug)) {
        throw new Error('Invalid slug, should be of the form pub/slug')
      }

      const { url } = await this.#export({
        format: format === 'formatted' ? 'pdf' : format,
        pubId: pubId!,
      })

      return url
    },
  }

  /**
   * Methods for interacting with collections
   */
  collection = {
    /**
     * Create a new collection
     */
    // create

    /**
     * Update a collection
     *
     * This is a helper method that calls `/api/facets` and `PUT /api/collections` under the hood
     *
     */
    update: async ({
      id,
      doi,
      slug,
      title,
      CitationStyle,
      License,
      NodeLabels,
      PubEdgeDisplay,
      PubHeaderTheme,
      metadata,
    }: DeepInput<'collection.update'> & FacetsPayload['facets']) => {
      const facetsPayload: FacetsPayload = {
        scope: {
          id,
          kind: 'collection',
        },
        facets: {
          CitationStyle,
          License,
          NodeLabels,
          PubEdgeDisplay,
          PubHeaderTheme,
        },
      }

      const putPayload = {
        communityId: this.communityId,
        id,
        doi,
        slug,
        title,
        metadata,
      }

      const shouldPostFacets = Object.keys(facetsPayload.facets).length > 0
      const shouldPutCollection = Object.keys(putPayload).length > 0

      let response = {} as {
        status: 200
        body: Partial<DeepOutput<'collection.update'>['body']> & {
          facets?: (typeof facetsPayload)['facets']
        }
      }

      if (shouldPutCollection) {
        const putResponse = await this.client.collection.update(putPayload)

        response = putResponse
      }

      if (shouldPostFacets) {
        const { status } = await this.facets.update({
          scope: facetsPayload.scope,
          facets: facetsPayload.facets,
        })

        // facets does not return the facets, so we just set them if nothing went wrong
        response.body.facets = facetsPayload.facets // facetsResponse as typeof facetsPayload.facets
        response.status =
          response.status === 200 || response.status === undefined
            ? status
            : response.status
      }

      return response
    },

    /**
     * Add a pub to a collection
     *
     * @param collectionId The id of the collection you want to add the pub to
     * @param pubId The id of the pub you want to add to the collection
     *
     */
    addPub: async ({
      collectionId,
      pubId,
    }: {
      collectionId: string
      pubId: string
    }) => {
      const response = await this.client.collectionPub.create({
        collectionId,
        pubId,
      })
      return response
    },

    /**
     * Change the order of a pub in a collection, or change it's status within the collection
     */
    updatePub: async (payload: DeepInput<'collectionPub.update'>) => {
      const response = await this.client.collectionPub.update(payload)
      return response
    },

    /**
     * Remove a pub from a collection
     *
     * @param collectionPubId The id of the pub you want to remove
     *
     * @returns The id of the removed pub
     */
    removePub: async ({ id }: DeepInput<'collectionPub.remove'>) => {
      const response = await this.client.collectionPub.remove({
        id,
      })

      return response
    },

    /**
     * Methods for interacting with attributions
     */
    attributions: this.client.collectionAttribution,
  }

  /**
   * Returns a signed policy for uploading a file to PubPub.
   */
  private declare uploadPolicy: typeof this.client.uploadPolicy

  /**
   * Methods for interacting with PubPub on the community level, e.g. changing the community name, adding CSS etc.
   */
  community = {
    /**
     * Update the community settings
     */
    update: async ({
      PubHeaderTheme,
      License,
      CitationStyle,
      NodeLabels,
      PubEdgeDisplay,
      ...putPayload
    }: CommunityPutPayload & FacetsPayload['facets']) => {
      const facetsPayload: FacetsPayload = {
        facets: {
          PubHeaderTheme,
          License,
          CitationStyle,
          NodeLabels,
          PubEdgeDisplay,
        },
        scope: {
          id: this.communityId,
          kind: 'community',
        },
      }

      const shouldPostFacets = Object.values(facetsPayload.facets).some(
        (x) => Object.keys(x).length > 0
      )
      const shouldPutCommunity = Object.keys(putPayload).length > 0

      putPayload.footerLinks &&= putPayload.footerLinks.map((link) => {
        if ('id' in link) {
          return link
        }

        const id = generateHash(8)

        return {
          id,
          ...link,
        }
      })

      function fixLinks(
        link: NonNullable<CommunityPutPayload['navigation']>[0]
      ) {
        if ('id' in link) {
          return link
        }

        const id = generateHash(8)

        return {
          id,
          ...link,
        }
      }

      let response: Partial<
        CommunityPutResponse & { facets: (typeof facetsPayload)['facets'] }
      > = {}

      const { navigation, footerLinks, ...rest } = putPayload

      if (shouldPutCommunity) {
        const communityResponse = await this.client.community.update({
          ...rest,
          communityId: this.communityId,
          ...(navigation && {
            navigation: navigation.map(fixLinks),
          }),
          ...(footerLinks && {
            footerLinks: footerLinks.map(fixLinks),
          }),
        })
        response = { ...response, ...communityResponse }
      }

      if (shouldPostFacets) {
        await this.facets.update({
          scope: facetsPayload.scope,
          facets: facetsPayload.facets,
        })

        // facets does not return the facets, so we just set them if nothing went wrong
        response = { ...response, facets: facetsPayload.facets } // facetsResponse.facets }
      }

      return response
    },

    /**
     * Update the global community CSS
     */
    css: async (css: string) => {
      const response = await this.client.customScript.set({
        type: 'css',
        content: css,
      })

      return response
    },
  }

  // TODO: Remove this if https://github.com/ts-rest/ts-rest/pull/413 is merged or fixed in some other way
  #formUpload = async ({
    route,
    fieldName,
    files,
    rest,
  }: {
    route: `/${string}`
    fieldName: 'file' | 'files'
    files: ([Blob, string] | File)[]
    rest?: Record<string, unknown>
  }) => {
    const formData = new FormData()

    if (rest) {
      Object.entries(rest).forEach(([key, value]) => {
        formData.set(key, JSON.stringify(value))
      })
    }

    files.forEach((file) => {
      if (Array.isArray(file)) {
        const [blob, filename] = file
        formData.set(fieldName, blob, filename)
      } else {
        formData.set(fieldName, file)
      }
    })

    const response = await fetch(`${this.communityUrl}${route}`, {
      method: 'POST',
      body: formData,
      headers: {
        Cookie: this.#cookie || '',
        ContentType: 'multipart/form-data',
      },
    })

    const data = await response.json()

    return {
      status: response.status as any,
      body: data as any,
      headers: response.headers as any,
    }
  }

  upload = async ({
    file,
  }: Exclude<DeepInput<'upload'>, FormData>): Promise<DeepOutput<'upload'>> =>
    this.#formUpload({
      route: '/api/upload',
      fieldName: 'file',
      files: [file],
    })

  text = {
    import: async ({
      files,
      ...rest
    }: DeepInput<'pub.text.import'>): Promise<DeepOutput<'pub.text.import'>> =>
      this.#formUpload({
        route: `/api/pubs/text/import`,
        fieldName: 'files',
        files,
        rest,
      }),

    importToPub: async (
      { files, ...rest }: Parameters<DeepInput<'pub.text.importToPub'>>[0],
      { pubId }: Parameters<DeepInput<'pub.text.importToPub'>>[1]['params']
    ): ReturnType<DeepInput<'pub.text.importToPub'>> =>
      this.#formUpload({
        route: `/api/pubs/${pubId}/text/import`,
        fieldName: 'files',
        files,
        rest,
      }),

    convert: async ({
      files,
    }: DeepInput<'pub.text.convert'>): Promise<
      DeepOutput<'pub.text.convert'>
    > =>
      this.#formUpload({
        route: `/api/pubs/text/convert`,
        fieldName: 'files',
        files,
      }),
  }

  /**
   * Basic export function, equivalent to the `/api/export` endpoint
   *
   * @private
   */
  #export = async ({ pubId, format, historyKey }: DeepInput<'export'>) => {
    const { body } = await this.client.export({
      pubId,
      format,
      historyKey: historyKey! < 0 ? undefined : historyKey,
    })

    let workerTaskId: string | null = null

    if (typeof workerTaskId !== 'string') {
      /**
       * If its cached, pubpub just immediately returns the url
       */
      if ('url' in body) {
        // throw new Error('Worker task id is not a string')
        return body
      }

      if (!('taskId' in body)) {
        throw new Error('Worker task id is not a string')
      }

      workerTaskId = body.taskId as string
    }

    return (await this.#waitForWorkerTask(
      workerTaskId
    )) as WorkerTaskExportOutput
  }

  /**
   * Pings workertask endpoint until every second until the task is complete
   */
  #waitForWorkerTask = async (workerTaskId: string) => {
    const poll = async (): Promise<unknown> => {
      console.log(`Polling for ${workerTaskId}`)
      const { body: task } = await this.client.workerTask.get({
        workerTaskId,
      })

      if ('error' in task && task.error) {
        console.error(task.error)
        throw new Error(task.error)
      }

      if ('output' in task && !task.isProcessing && task.output) {
        return task.output
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      return poll()
    }

    return poll()
  }

  static async createSDK({
    communityId,
    communityUrl,
    email,
    password,
  }: {
    communityId: string
    communityUrl: string
    email: string
    password: string
  }) {
    const sdk = new PubPub(communityId, communityUrl)
    await sdk.login(email, password)
    return sdk as unknown as PubPubSDK
  }
}

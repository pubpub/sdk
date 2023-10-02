/* eslint-disable @typescript-eslint/no-explicit-any */
import SHA3 from 'crypto-js/sha3'
import encHex from 'crypto-js/enc-hex'
import type { Fragment } from 'prosemirror-model'
// import { readFile } from 'fs/promises'
import { createClient } from 'utils/api/client.js'

import type {
  FacetsPayload,
  PubPutPayload,
  CommunityPutPayload,
  CommunityPutResponse,
  SourceFile,
  ExportFormats,
  allowedMimeTypes,
  WorkerTaskExportOutput,
  WorkerTaskImportOutput,
} from './types.js'
import type { InitialData } from './initialData.js'
import type { CollectionInitialData } from './collectionData.js'
import { generateFileNameForUpload } from './generateFileNameForUpload.js'
import { generateHash } from './generateHash.js'
import type {
  CollectionViewData,
  CommunityViewData,
  PubViewDataDash,
  PubViewDataPub,
} from './viewData.js'
import { labelFiles } from './formats.js'
import { signInWithCustomToken } from './firebase/rest/signInWithCustomToken.js'
import { writeDocumentToPubDraft } from './firebase/rest/firebase.js'

import type { buildSchema } from './editor/schema.js'

import { proxyClient, proxySDKWithClient } from './proxies.js'
import type {
  PClient,
  DeepInput,
  DeepMerge,
  Prettify,
  DeepOutput,
  DeepClient,
} from './client-types.js'

/**
 * Small test to see if a string looks like a pub slug,
 * such that we have better type inference for the result
 */
const looksLikePubSlug = (pub: string): pub is `pub/${string}` =>
  /pub\/.*?$/.test(pub)

/**
 * Map of GET requests, used to correctly proxy the client
 *
 * There is no way of knowing from inspecting the client which requests are GET requests, so we have to manually specify them here
 */
const getRequestsMap = {
  get: true,
  logout: true,
  uploadPolicy: true,
} as const

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
  private cookie?: string
  loggedIn = false

  #AWS_S3 = 'https://s3-external-1.amazonaws.com'
  #BUCKET = 'assets.pubpub.org'

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

    this.cookie = cookie // .join('; ')
    const authenticatedClient = proxyClient(
      createClient({
        baseUrl: this.communityUrl,
        baseHeaders: {
          Cookie: this.cookie || '',
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

    this.cookie = undefined
    this.loggedIn = false
    console.log('Succesfully logged out!')

    return response
  }

  async authedRequest<
    T extends Record<string, any> | string | void = Record<string, any> | string
  >(path: string, method: 'GET', options?: RequestInit): Promise<T>
  async authedRequest<
    T extends Record<string, any> | string | void = Record<string, any> | string
  >(
    path: string,
    method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Record<string, any>,
    options?: RequestInit
  ): Promise<T>
  async authedRequest<
    T extends Record<string, any> | string | void = Record<string, any> | string
  >(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    bodyOrOptions: Record<string, any> | RequestInit,
    optionsMabye?: RequestInit
  ): Promise<T> {
    const options = method === 'GET' ? bodyOrOptions : optionsMabye
    const body = method !== 'GET' ? JSON.stringify(bodyOrOptions) : undefined

    const response = await fetch(`${this.communityUrl}/api/${path}`, {
      body,
      // body,
      method,
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        Cookie: this.cookie || '',
      },
    })

    if (!response.ok || response.status < 200 || response.status >= 300) {
      console.log(response)
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      )
    }

    const data = await response.json()

    return data
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
        Cookie: this.cookie || '',
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

  getManyPubs = async (options?: DeepInput<'pub.getMany'>['query']) => {
    const { limit, offset, ordering, collectionIds, pubIds } = options ?? {}
    const response = await this.client.pub.getMany({
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

            const { fileOrPath, fileName, mimeType } = download

            const uploadedFile = await this.uploadFile({
              file: fileOrPath,
              fileName,
              mimeType,
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

    /**
     * Get a pub by its id
     */
    get: async ({ pubId }: { pubId: string }) => {
      const response = await this.getManyPubs({
        pubIds: [pubId],
      })
      return response.body.pubsById[pubId]
    },

    /**
     * First connects to Firebase
     * Imports the files
     * Then sends the imported file to firebase
     *
     * @param pubSlug: The slug of the pub you want to import, including /draft. The slug is everything after the community url, e.g. /pub/my-pub-slug/draft
     * @param filesToImport: The files you want to import
     * @param postProcessor: A function that takes the document and returns a new document. This allows you to do custom post-processing on the document to do things that the PubPub importer does not allow yet, e.g. setting captions on Figures from an imported Word document.
     */
    import: async (
      /**
       * The slug of the pub you want to import, including /draft
       */
      pubSlug: string,
      /**
       * The files you want to import
       *
       * You can either pass an array of files, or an array of arrays of files
       *
       * If you pass a `FileImportPayload[]`, you can only have one "document" file, the rest must be supplemental files such as
       * bibliography, images, etc.
       *
       * If you pass a `FileImportPayload[][]`, you can have multiple "document" files, and each document file can have its own supplemental files
       *
       * @example
       * ```ts
       * // import a single document file and a single supplemental file
       * pubpub.pub.hacks.importPub('my-pub-slug/draft', [
       *  {
       *   fileOrPath: 'path/to/file.md',
       *   fileName: 'file.md',
       *   mimeType: 'text/markdown',
       *  },
       *  {
       *   fileOrPath: 'path/to/file.bib',
       *   fileName: 'file.bib',
       *   mimeType: 'application/x-bibtex',
       * },
       * // here you could not specify say another Word, Markdown, or TeX file, as PubPub needs to treat one of these as the "document" file
       * ])
       * ```
       *
       * @example
       * ```ts
       * // import multiple document files and their supplemental files
       * pubpub.pub.hacks.importPub('my-pub-slug/draft', [
       * [
       *  {
       *   fileOrPath: 'path/to/file.md',
       *   fileName: 'file.md',
       *   mimeType: 'text/markdown',
       *  },
       *  {
       *    fileOrPath: 'path/to/file.bib',
       *    fileName: 'file.bib',
       *    mimeType: 'application/x-bibtex',
       *  },
       * ],
       * [
       * // this file will be imported separately and appended to the end of the pub
       *  {
       *   fileOrPath: 'path/to/file.docx',
       *   fileName: 'file.docx',
       *   mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
       *   },
       *  ]
       * ])
       *
       */
      filesToImport: FileImportPayload[] | FileImportPayload[][],
      /**
       * A function that takes the document and returns a new document.
       *
       * This allows you to do custom post-processing on the document to do things that the PubPub importer does not allow yet,
       * e.g. setting captions on Figures from an imported Word document.
       *
       * @param doc The document that was imported
       * @param schema The schema that was used to import the document. You can use this to create new nodes.
       * @returns The new document
       */
      postProcessor?: (
        doc: Fragment,
        schema: ReturnType<typeof buildSchema>
      ) => Fragment
    ) => {
      // if it doesnt end with /draft, add it

      const testUrl = pubSlug.endsWith('/draft') ? pubSlug : `${pubSlug}/draft`
      if (!looksLikePubSlug(testUrl)) {
        throw new Error('Invalid pub slug, should be of the form pub/slug')
      }

      const pageData = await this.hacks.getPageData(testUrl, 'view-data')

      const initialDocKey = pageData.pubData.initialDocKey

      const firebaseToken = pageData.pubData.firebaseToken
      const firebasePath = pageData.pubData.draft.firebasePath

      const firebaseRoot = `https://pubpub-v6-prod.firebaseio.com/${firebasePath}`

      const { idToken: token } = await signInWithCustomToken(firebaseToken)
      // const firebaseRef = await initFirebase(firebasePath, firebaseToken)

      if (!token) {
        throw new Error('Could not connect to firebase')
      }

      const importedFiles = Array.isArray(filesToImport?.[0])
        ? (
            await Promise.all(
              (filesToImport as FileImportPayload[][]).map((file) =>
                this.importFull(file)
              )
            )
          )?.reduce((acc, curr) => {
            acc.doc.content = [...acc.doc.content, ...curr.doc.content]
            return acc
          })
        : await this.importFull(filesToImport as FileImportPayload[])

      const docImport = await writeDocumentToPubDraft(
        firebaseRoot,
        importedFiles.doc,
        token,
        {
          initialDocKey,
          postProcessor,
        }
      )
      console.log(
        `Succesfully imported ${filesToImport.length} files to ${pubSlug}`,
        docImport
      )

      return { importedFiles }
    },

    export: async ({
      slug,
      pubId,
      format,
      historyKey,
    }: (
      | { slug: string; pubId?: undefined }
      | { slug?: undefined; pubId: string }
    ) & {
      format: ExportFormats
      historyKey?: number
    }) => {
      if (!slug && pubId) {
        const pub = await this.pub.get({ pubId })
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

      const viewData = await this.hacks.getPageData(slug, 'view-data')

      const { initialDocKey, downloads, id, initialDoc } = viewData.pubData

      if (format === 'json') {
        return initialDoc
      }

      if (format === 'formatted' && downloads?.[0]?.type === 'formatted') {
        return downloads[0].url
      }

      const { url } = await this.export({
        format: format === 'formatted' ? 'pdf' : format,
        pubId: pubId ?? id,
        historyKey: historyKey ?? initialDocKey,
      })

      return url
    },

    /**
     * Get a list of pubs
     */
    getMany: this.getManyPubs,
  }

  /**
   * These are hacks that are not part of the (un)official API
   *
   * Basically, we're scraping the page and parsing the (initial) data from the page, usually in a script tag in JSON format
   * Very unreliable, could break at any time.
   */
  hacks = {
    /**
     * Get the data from a page that's passed as JSON in a script tag to the page
     *
     * @param slug The slug of the page
     * @param data The type of data you want to get, either `initial-data` or `view-data`
     */
    getPageData: async <
      S extends string = string,
      D extends 'initial-data' | 'view-data' = 'initial-data'
    >(
      /**
       * The slug of the page
       *
       * This is the part after the community url
       *
       * @example /pub/pub-slug
       *
       * You can also use the full url, we will extract the slug
       */
      slug: S,
      data: D = 'initial-data' as D
    ): Promise<
      D extends 'initial-data' | undefined
        ? S extends `dash/${infer T}/${string}`
          ? T extends 'collection'
            ? CollectionInitialData
            : InitialData
          : InitialData
        : S extends `dash/${infer T}/${string}`
        ? T extends 'collection'
          ? CollectionViewData
          : T extends 'pub'
          ? PubViewDataDash
          : T extends 'overview'
          ? CommunityViewData
          : Record<string, unknown>
        : S extends `pub/${string}`
        ? PubViewDataPub
        : Record<string, unknown>
    > => {
      const response = await this.getPage({ slug })

      const unparsedCommunityData = response.match(
        new RegExp(`<script id="${data}" type="text\\/plain" data-json="(.*?)"`)
      )

      if (!unparsedCommunityData) {
        throw new Error(`Could not find ${data} data`)
      }

      if (data !== 'view-data') {
        const communityData = JSON.parse(
          unparsedCommunityData[1].replace(/&quot;/g, '"')
        )

        return communityData
      }
      return JSON.parse(unparsedCommunityData[1].replace(/&quot;/g, '"'))
    },

    getCommunityData: async () => {
      const communityData = await this.hacks.getPageData('dash/overview')
      return communityData?.communityData
    },

    /**
     * The only way I currently know to get collections is to go to the dashboard and scrape the data from there
     *
     * Very unreliable, could break at any time, plus very slow.
     */
    getCollections: async () => {
      const communityData = await this.hacks.getCommunityData()

      return communityData?.collections
    },

    getCollection: async (slug: string) => {
      const collectionData = await this.hacks.getPageData(
        `dash/collection/${slug}/settings/details`
      )

      return collectionData.scopeData.elements.activeCollection
    },

    getFullCollectionById_SLOW: async (collectionId: string) => {
      const collections = await this.hacks.getCollections()

      const incompleteCollection = collections?.find(
        (x) => x.id === collectionId
      )

      if (!incompleteCollection) {
        throw new Error('Could not find collection')
      }

      const collection = await this.hacks.getCollection(
        incompleteCollection.slug
      )

      return collection
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
     * Remove a collection
     */
    // declare remove: PClient['collection']['remove'],

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
    attributions: this.makeAttributionsOperations('collection'),
    hacks: {
      /**
       * HACK: Get a list of all collections. Currently done by scraping the dashboard.
       */
      getMany: this.hacks.getCollections,
      /**
       * HACK: Gets the data from a specific collection, requires the slug.
       * If you do not have the slug, use `getByIdSlow` instead.
       */
      get: this.hacks.getCollection,
      /**
       * HACK: Get a specific collection. Currently just runs getMany and finds the correct collection from the list,
       * therefore is not faster than getMany.
       */
      getByIdSlow: this.hacks.getFullCollectionById_SLOW,
    },
  }

  private makeAttributionsOperations<
    T extends 'pub' | 'collection',
    F extends T extends 'pub'
      ? DeepClient<'pubAttribution', 'func'>
      : DeepClient<'collectionAttribution', 'func'>,
    C extends T extends 'pub'
      ? DeepInput<'pubAttribution.create'>
      : DeepInput<'collectionAttribution.create'>,
    U extends T extends 'pub'
      ? DeepInput<'pubAttribution.update'> & { name?: string }
      : DeepInput<'collectionAttribution.update'>,
    R extends T extends 'pub'
      ? DeepInput<'pubAttribution.remove'> & { name?: string }
      : Omit<DeepInput<'collectionAttribution.remove'>, 'name'>
  >(type: T) {
    return {
      get:
        type === 'collection'
          ? undefined
          : async (id: string) => {
              const manyPubs = await this.getManyPubs({ pubIds: [id] })

              const attributions =
                manyPubs?.body?.pubsById[id]?.attributions ?? []
              return attributions
            },

      create: async (props: C) => {
        const func = (
          type === 'pub'
            ? this.client.pubAttribution
            : this.client.collectionAttribution
        ) as F
        // @ts-expect-error FIXME: This should work
        const response = await func.create(props)

        return response
      },

      /**
       * update an attribution
       *
       * You can either pass a name or a userId
       * If you pass a name, it will find the attribution with that name and update it
       */
      update: async (
        props: U
        // props: T extends 'pub'
        //   ? AttributionsPayload
        //   : Omit<AttributionsPayload, 'name'>
      ) => {
        const func = (
          type === 'pub'
            ? this.client.pubAttribution
            : this.client.collectionAttribution
        ) as F
        if ('collectionId' in props || !('name' in props) || !props.name) {
          // @ts-expect-error FIXME: This should work
          const response = await func.update(props)
          return response
        }

        const manyPubs = await this.getManyPubs({ pubIds: [props.pubId] })

        const attributions =
          manyPubs?.body?.pubsById[props.pubId]?.attributions ?? []

        // check if name in attributions
        const existingAttribution = attributions.find(
          (x) => x.name === props.name
        )

        if (!existingAttribution) {
          throw new Error('Attribution not found')
        }

        const response = await this.client.pubAttribution.update({
          ...props,
          userId: existingAttribution.userId,
        })
        return response
      },

      remove: async (props: R) => {
        const func = (
          type === 'pub'
            ? this.client.pubAttribution
            : this.client.collectionAttribution
        ) as F
        if ('collectionId' in props || !('name' in props) || !props.name) {
          // @ts-expect-error FIXME: This should work
          const response = await func.remove(props)
          return response
        }

        const manyPubs = await this.getManyPubs({ pubIds: [props.pubId] })

        const attributions =
          manyPubs?.body?.pubsById[props.pubId]?.attributions ?? []

        // check if name in attributions
        const existingAttribution = attributions.find(
          (x) => x.name === props.name
        )

        if (!existingAttribution || !existingAttribution.userId) {
          throw new Error('Attribution not found')
        }

        const response = await this.client.pubAttribution.remove({
          ...props,
          id: existingAttribution.userId,
        })

        return response
      },
    }
  }

  /**
   * Upload a file to PubPub.
   *
   * @param file The file to upload. Can be a Blob (when using the browser or Node) or a Buffer (when using Node)
   * @param fileName The name of the file
   * @param mimeType The mime type of the file
   *
   * @returns The URL of the uploaded file on https://assets.pubpub.org
   *
   * @example
   * ### Node
   * ```ts
   * const pdf = await fs.readFileSync('path/to/file.pdf')
   *
   * const { url } = await pubpub.uploadFile(pdf, 'file.pdf', 'application/pdf')
   * ```
   *
   * ### Browser
   * ```ts
   * const pdf = await fetch('path/to/file.pdf')
   * const pdfBlob = await pdf.blob()
   *
   * const { url } = await pubpub.uploadFile(pdfBlob, 'file.pdf', 'application/pdf')
   * ```
   *
   * @since 0.3.0 private, allows for passing strings
   *
   * This method has been made private to avoid abuse of the upload feature.
   */
  private uploadFile = async ({
    file,
    fileName,
    mimeType,
  }: FileImportPayload) => {
    if (
      typeof window === 'undefined' &&
      process.version &&
      parseInt(process.version.slice(1).split('.')[0]) < 18
    ) {
      throw new Error(
        'Node version must be 18 or higher to use uploadFile, as it depends on native fetch, FormData and Blob support'
      )
    }

    const fileOrStream = // typeof file === 'string' ? await readFile(file) :
      file

    const res =
      fileOrStream instanceof Buffer ? new Blob([fileOrStream]) : fileOrStream

    const {
      body: { acl, awsAccessKeyId, policy, signature, bucket },
    } = await this.uploadPolicy({ query: { contentType: mimeType } })

    const formData = new FormData()

    const key = generateFileNameForUpload(fileName)

    formData.append('key', key)
    formData.append('AWSAccessKeyId', awsAccessKeyId)
    formData.append('acl', acl)
    formData.append('policy', policy)
    formData.append('signature', signature)
    formData.append('Content-Type', mimeType)
    formData.append('success_action_status', '200')
    formData.append('file', res, fileName)

    try {
      await fetch(`${this.#AWS_S3}/${bucket ?? this.#BUCKET}`, {
        method: 'POST',
        body: formData,
      })

      return {
        url: `https://assets.pubpub.org/${key}`,
        size: res.size,
        key,
        //      data,
      }
    } catch (error) {
      console.error(error)
      throw new Error('Upload failed')
    }
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

      putPayload.navigation &&= putPayload.navigation.map((link) => {
        if ('id' in link) {
          return link
        }

        const id = generateHash(8)

        return {
          id,

          ...link,
        }
      })

      let response: Partial<
        CommunityPutResponse & { facets: (typeof facetsPayload)['facets'] }
      > = {}

      if (shouldPutCommunity) {
        const communityResponse = (await this.authedRequest(
          `community/${this.communityId}`,
          'PUT',
          putPayload
        )) as CommunityPutResponse
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
      const response = await this.authedRequest<Record<string, never>>(
        'customScripts',
        'POST',
        {
          communityId: this.communityId,
          type: 'css',
          content: css,
        }
      )

      return response
    },

    /**
     * HACK: Get community data
     */
    get: this.hacks.getCommunityData,
  }

  /**
   * More complete import function thta also takes care of properly uploading and labeling all files.
   */
  private importFull = async (files: FileImportPayload[]) => {
    const importedFiles = await Promise.all(
      files.map(async ({ file, fileName, mimeType }) => {
        const { url, size, key } = await this.uploadFile({
          file,
          fileName,
          mimeType,
        })

        return {
          url,
          fileName,
          mimeType,
          size,
          key,
        }
      })
    )

    const sourceFiles: SourceFile[] = importedFiles.map(
      ({ size, key, fileName }, idx) => ({
        assetKey: key,
        clientPath: fileName,
        id: idx + 1,
        state: 'complete',
        loaded: size,
        total: size,
      })
    )

    const labeledFiles = labelFiles(sourceFiles)

    return await this.import(labeledFiles)
  }

  /**
   * Basic export function, equivalent to the `/api/export` endpoint
   */
  private export = async ({
    pubId,
    format,
    historyKey,
  }: DeepInput<'export'>) => {
    const { body } = await this.client.export({
      pubId,
      format,
      historyKey,
    }) // await this.authedRequest(`export`, 'POST', payload)

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

    return (await this.waitForWorkerTask(
      workerTaskId
    )) as WorkerTaskExportOutput
  }

  /**
   * Basic import function, equivalent to the `/api/import` endpoint
   */
  private import = async (sourceFiles: DeepInput<'import'>['sourceFiles']) => {
    const payload: DeepInput<'import'> = {
      importerFlags: {},
      sourceFiles,
    }
    const { body: workerTaskId } = await this.client.import(payload)

    if (typeof workerTaskId !== 'string') {
      console.error(workerTaskId)
      throw new Error('Worker task id is not a string')
    }

    return (await this.waitForWorkerTask(
      workerTaskId
    )) as WorkerTaskImportOutput
  }

  /**
   * Pings workertask endpoint until every second until the task is complete
   */
  waitForWorkerTask = async (workerTaskId: string) => {
    const poll = async (): Promise<unknown> => {
      console.log(`Polling for ${workerTaskId}`)
      const { body: task } = await this.client.workerTask.get({
        query: {
          workerTaskId,
        },
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
    console.log(sdk.client)
    return sdk as unknown as PubPubSDK
  }
}

interface FileImportPayload {
  file: Blob | Buffer | File
  fileName: string
  mimeType: (typeof allowedMimeTypes)[number]
}

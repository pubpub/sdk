import SHA3 from 'crypto-js/sha3'
import encHex from 'crypto-js/enc-hex'
import {
  License,
  FacetsPayload,
  PubPutPayload,
  PubEdgeDisplay,
  PubHeaderTheme,
  NodeLabels,
  CitationStyle,
  Scope,
  Facets,
  CollectionKind,
  CommunityPutPayload,
  CommunityPutResponse,
  SourceFile,
  ImportPayload,
  ExportFormats,
  allowedMimeTypes,
  AttributionsPayload,
  ExportPayload,
  FacetsProps,
  GetManyOptions,
  PubsManyResponse,
  UpdateCollectionsMetaData,
  UploadPolicyResponse,
  WorkerTaskExportOutput,
  WorkerTaskImportOutput,
  WorkerTaskResponse,
  Pub,
} from './types'
import { InitialData } from './initialData'
import { CollectionScopeData } from './collectionData'
import { generateFileNameForUpload } from './generateFileNameForUpload'
import { generateHash } from './generateHash'
import { PubViewData } from './viewData'
import { writeDocumentToPubDraft } from './editor/firebase'
import { labelFiles } from './formats'
import { initFirebase } from './firebase/initFirebase'

import { Fragment } from 'prosemirror-model'
import { buildSchema } from './editor/schema'
import { readFile } from 'fs/promises'

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
  communityId: string
  communityUrl: string

  loggedIn = false

  private AWS_S3 = 'https://s3-external-1.amazonaws.com'

  constructor(communityId: string, communityUrl: string) {
    this.communityId = communityId
    this.communityUrl = communityUrl
  }

  /**
   * Login to the PubPub API. Needs to be called before any other method.
   **/
  async login(email: string, password: string) {
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
    const data = await response.json()

    if (!cookie) {
      throw new Error(`Login failed
      ${data}`)
    }

    this.cookie = cookie //.join('; ')
    this.loggedIn = true
  }

  async logout() {
    const response = await this.authedRequest('logout', 'GET')

    this.cookie = undefined
    this.loggedIn = false
    console.log('Succesfully logged out!')

    return response
  }

  async authedRequest<T extends Record<string, any> = Record<string, unknown>>(
    path: string,
    method: 'GET',
    options?: RequestInit
  ): Promise<T | string>
  async authedRequest<T extends Record<string, any> = Record<string, unknown>>(
    path: string,
    method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Record<string, any>,
    options?: RequestInit
  ): Promise<T | string>
  async authedRequest<T extends Record<string, any> = Record<string, unknown>>(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    bodyOrOptions: Record<string, any> | RequestInit,
    optionsMabye?: RequestInit
  ): Promise<T | string> {
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

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      )
    }

    const data = await response.json()

    return data
  }

  getPage = async (slug: string) => {
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
   */
  private async updateFacets(scope: Scope, facets: Facets) {
    const response = await this.authedRequest(`facets`, 'POST', {
      scope,
      facets,
    })
    return response
  }

  /**
   * Methods for interacting with pages
   *
   * Very limited for now
   */
  page = {
    /**
     * Create a new page
     */
    create: async ({
      title,
      slug,
      description,
    }: {
      title: string
      slug: string
      description?: string
    }) => {
      const response = await this.authedRequest('pages', 'POST', {
        communityId: this.communityId,
        title,
        slug,
        description,
      })
      return response
    },
  }

  getManyPubs = async (options?: GetManyOptions) => {
    const { limit, offset, ordering, collectionIds, pubIds } = options ?? {}
    const response = await this.authedRequest(`pubs/many`, 'POST', {
      alreadyFetchedPubIds: [],
      pubOptions: {
        getCollections: true,
      },
      query: {
        communityId: this.communityId,
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

    return response as PubsManyResponse
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
    create: async (collectionId?: string) => {
      const response = await this.authedRequest('pubs', 'POST', {
        collectionId,
        communityId: this.communityId,
      })

      return response as Pub
    },

    /**
     * Update a pub
     *
     * This is a helper method that calls `/api/facets` and `PUT /api/pubs` under the hood
     *
     * @param pubId The id of the pub you want to update
     * @param props The properties you want to update
     */
    update: async (
      pubId: string,
      {
        title,
        description,
        avatar,
        slug,
        customPublishedAt,
        downloads,
        htmlTitle,
        license,
        doi,
        nodeLabels,
        pubEdgeDisplay,
        pubHeaderTheme,
        citationStyle,
      }: Omit<PubPutPayload, 'communityId' | 'pubId'> & {
        license?: License
        nodeLabels?: NodeLabels
        pubEdgeDisplay?: PubEdgeDisplay
        pubHeaderTheme?: PubHeaderTheme
        citationStyle?: CitationStyle
      }
    ) => {
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
              type: 'formatted',
              createdAt: new Date().toISOString(),
            }
          }
        )
      )

      const facetsPayload: FacetsPayload = {
        facets: {
          License: license ?? {},
          NodeLabels: nodeLabels ?? {},
          PubEdgeDisplay: pubEdgeDisplay ?? {},
          PubHeaderTheme: pubHeaderTheme ?? {},
          CitationStyle: citationStyle ?? {},
        },
        scope: {
          id: pubId,
          kind: 'pub',
        },
      }

      const putPayload = {
        pubId,
        communityId: this.communityId,
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

      let response: Partial<
        typeof putPayload & { facets: (typeof facetsPayload)['facets'] }
      > = {}

      if (shouldPutPub) {
        const res = await this.authedRequest('pubs', 'PUT', putPayload)
        response = res as typeof putPayload
      }

      if (shouldPostFacets) {
        const facets = await this.updateFacets(
          facetsPayload.scope,
          facetsPayload.facets
        )
        // facets does not return the facets, so we just set them if nothing went wrong
        response.facets = facetsPayload.facets //facets as typeof facetsPayload.facets
      }
      return response
    },

    /**
     * Remove a pub
     *
     * @param pubId The id of the pub you want to remove
     */
    remove: async (pubId: string) => {
      const response = await this.authedRequest(`pubs`, 'DELETE', {
        pubId,
        communityId: this.communityId,
      })
      return response
    },

    /**
     * Get a pub by its id
     *
     * @param pubId The id of the pub you want to get
     */
    get: async (pubId: string) => {
      const response = await this.getManyPubs({
        pubIds: [pubId],
      })
      return response.pubsById[pubId]
    },

    /**
     * Create a release for a pub
     *
     * @param pubId The id of the pub you want to create a release for
     */
    createRelease: async (
      pubId: string,
      {
        noteText,
        noteContent,
      }: {
        noteText?: string
        noteContent?: string
      } = {}
    ) => {
      const response = await this.authedRequest(`releases`, 'POST', {
        pubId,
        communityId: this.communityId,
        noteText,
        noteContent,
      })
      return response
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

      const pageData = await this.hacks.getPageData(testUrl, 'view-data')

      const initialDocKey = pageData.pubData.initialDocKey

      const firebaseToken = pageData.pubData.firebaseToken
      const firebasePath = pageData.pubData.draft.firebasePath
      const firebaseRef = await initFirebase(firebasePath, firebaseToken)

      if (!firebaseRef) {
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
        firebaseRef,
        importedFiles.doc,
        {
          initialDocKey,
          postProcessor,
        }
      )
      console.log(
        `Succesfully imported ${filesToImport.length} files to ${pubSlug}`
      )

      return { importedFiles }
    },

    export: async ({
      slug,
      pubId,
      format,
    }: (
      | { slug: string; pubId?: undefined }
      | { slug?: undefined; pubId: string }
    ) & {
      format: ExportFormats
    }) => {
      if (!slug && pubId) {
        const pub = await this.pub.get(pubId)
        if (format === 'formatted' && pub.downloads[0]?.type === 'formatted') {
          return pub.downloads[0].url
        }
        slug = pub.slug
      }

      if (!slug) {
        throw new Error('No slug or id provided')
      }

      const viewData = await this.hacks.getPageData(slug, 'view-data')

      const { initialDocKey, downloads, id, initialDoc } = viewData.pubData

      if (format === 'json') {
        return initialDoc
      }

      if (format === 'formatted' && downloads?.[0]?.type === 'formatted') {
        return downloads[0].url
      }

      const { url } = await this.exportPub({
        historyKey: initialDocKey,
        format,
        pubId: pubId ?? id,
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
    getPageData: (async (
      /**
       * The slug of the page
       *
       * This is the part after the community url
       *
       * @example /pub/pub-slug
       *
       * You can also use the full url, we will extract the slug
       */
      slug: string,
      data: 'initial-data' | 'view-data' = 'initial-data'
    ) => {
      const response = await this.getPage(slug)

      const unparsedCommunityData = response.match(
        new RegExp(`<script id="${data}" type="text\\/plain" data-json="(.*?)"`)
      )

      if (!unparsedCommunityData) {
        throw new Error(`Could not find ${data} data`)
      }

      if (data === 'initial-data') {
        const communityData = JSON.parse(
          unparsedCommunityData[1].replace(/&quot;/g, '"')
        ) as InitialData

        return communityData
      } else {
        return JSON.parse(
          unparsedCommunityData[1].replace(/&quot;/g, '"')
        ) as PubViewData
      }
    }) as ((page: string, data?: 'initial-data') => Promise<InitialData>) &
      ((page: string, data?: 'view-data') => Promise<PubViewData>),

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

      const collectionElements = collectionData?.scopeData
        ?.elements as unknown as CollectionScopeData['elements']

      const collectionScopeData = collectionElements?.activeCollection

      return collectionScopeData
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
    create: async ({
      title,
      kind,
    }: {
      title: string
      kind: CollectionKind
    }) => {
      const response = await this.authedRequest(`collections`, 'POST', {
        communityId: this.communityId,
        title,
        kind,
      })
      return response
    },

    /**
     * Update a collection
     *
     * This is a helper method that calls `/api/facets` and `PUT /api/collections` under the hood
     *
     * @param collectionId The id of the collection you want to update
     * @param props The properties you want to update
     */
    update: async (
      collectionId: string,
      {
        citationStyle,
        license,
        nodeLabels,
        doi,
        slug,
        copyrightYear,
        edition,
        isbn,
        publicationDate,
        title,
        issue,
        pubEdgeDisplay,
        pubHeaderTheme,
        url,
        volume,
      }: UpdateCollectionsMetaData & FacetsProps
    ) => {
      const facetsPayload: FacetsPayload = {
        scope: {
          id: collectionId,
          kind: 'collection',
        },
        facets: {
          CitationStyle: citationStyle ?? {},
          License: license ?? {},
          NodeLabels: nodeLabels ?? {},
          PubEdgeDisplay: pubEdgeDisplay ?? {},
          PubHeaderTheme: pubHeaderTheme ?? {},
        },
      }

      const putPayload = {
        communityId: this.communityId,
        collectionId,
        doi,
        slug,
        copyrightYear,
        edition,
        isbn,
        publicationDate,
        title,
        issue,
        url,
        volume,
      }

      const shouldPostFacets = Object.keys(facetsPayload.facets).length > 0
      const shouldPutCollection = Object.keys(putPayload).length > 0

      let response: Partial<
        typeof putPayload & { facets: (typeof facetsPayload)['facets'] }
      > = {}

      if (shouldPutCollection) {
        const putResponse = (await this.authedRequest(
          `collections`,
          'PUT',
          putPayload
        )) as typeof putPayload

        response = putResponse
      }

      if (shouldPostFacets) {
        const facetsResponse = await this.updateFacets(
          facetsPayload.scope,
          facetsPayload.facets
        )

        // facets does not return the facets, so we just set them if nothing went wrong
        response.facets = facetsPayload.facets //facetsResponse as typeof facetsPayload.facets
      }

      return response
    },

    /**
     * Remove a collection
     * @param collectionId The id of the collection you want to remove
     */
    remove: async (collectionId: string) => {
      const response = await this.authedRequest(`collections`, 'DELETE', {
        id: collectionId,
        communityId: this.communityId,
      })
      return response ?? { success: true }
    },

    /**
     * Add a pub to a collection
     *
     * @param collectionId The id of the collection you want to add the pub to
     * @param pubId The id of the pub you want to add to the collection
     *
     */
    addPub: async (collectionId: string, pubId: string) => {
      const response = await this.authedRequest(`collectionPubs`, 'POST', {
        collectionId,
        pubId,
        communityId: this.communityId,
      })
      return response
    },

    removePub: async (props: { collectionId: string; pubId: string }) => {
      const response = await this.authedRequest(`collectionPubs`, 'DELETE', {
        ...props,
        communityId: this.communityId,
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

  private makeAttributionsOperations<T extends 'pub' | 'collection'>(type: T) {
    const path = type === 'pub' ? 'pubAttributions' : 'collectionAttributions'

    return {
      get:
        type === 'collection'
          ? undefined
          : async (id: string) => {
              const manyPubs = await this.getManyPubs({ pubIds: [id] })

              const attributions = manyPubs?.pubsById[id]?.attributions ?? []
              return attributions
            },

      create: async (props: AttributionsPayload) => {
        const response = await this.authedRequest(path, 'POST', props)

        return response
      },

      /**
       * update an attribution
       *
       * You can either pass a name or a userId
       * If you pass a name, it will find the attribution with that name and update it
       */
      update: async (
        props: T extends 'pub'
          ? AttributionsPayload
          : Omit<AttributionsPayload, 'name'>
      ) => {
        if (!('name' in props) || !props.name) {
          const response = await this.authedRequest(path, 'PUT', props)
          return response
        }

        const manyPubs = await this.getManyPubs({ pubIds: [props.pubId] })

        const attributions = manyPubs?.pubsById[props.pubId]?.attributions ?? []

        // check if name in attributions
        const existingAttribution = attributions.find(
          (x) => x.name === props.name
        )

        if (!existingAttribution) {
          throw new Error('Attribution not found')
        }

        const response = await this.authedRequest(path, 'PUT', {
          ...props,
          userId: existingAttribution.userId,
        })

        return response
      },

      remove: async (
        props: T extends 'pub'
          ? AttributionsPayload
          : Omit<AttributionsPayload, 'name'>
      ) => {
        if (!('name' in props) || !props.name) {
          const response = await this.authedRequest(path, 'DELETE', props)
          return response
        }

        const manyPubs = await this.getManyPubs({ pubIds: [props.pubId] })

        const attributions = manyPubs?.pubsById[props.pubId]?.attributions ?? []

        // check if name in attributions
        const existingAttribution = attributions.find(
          (x) => x.name === props.name
        )

        if (!existingAttribution) {
          throw new Error('Attribution not found')
        }

        const response = await this.authedRequest(path, 'DELETE', {
          ...props,
          userId: existingAttribution.userId,
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
        'Node version must be 18 or higher to use uploadFile, as it depends on native FormData and Blob support'
      )
    }

    const fileOrStream = typeof file === 'string' ? await readFile(file) : file

    const res =
      fileOrStream instanceof Buffer ? new Blob([fileOrStream]) : fileOrStream

    const policy = await this.uploadPolicy(mimeType)

    const formData = new FormData()

    const key = generateFileNameForUpload(fileName)

    formData.append('key', key)
    formData.append('AWSAccessKeyId', policy.awsAccessKeyId)
    formData.append('acl', policy.acl)
    formData.append('policy', policy.policy)
    formData.append('signature', policy.signature)
    formData.append('Content-Type', mimeType)
    formData.append('success_action_status', '200')
    formData.append('file', res, fileName)

    try {
      const response = await fetch(`${this.AWS_S3}/${policy.bucket}`, {
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
  private uploadPolicy = async (
    mimeType: (typeof allowedMimeTypes)[number]
  ): Promise<UploadPolicyResponse> => {
    // mimettypes for pdf, docx, json, png, jpg, gif
    const queryParam = new URLSearchParams({
      contentType: mimeType,
    }).toString()

    const response = await this.authedRequest(
      `uploadPolicy?${queryParam}`,
      'GET'
    )
    return response as UploadPolicyResponse
  }

  /**
   * Methods for interacting with PubPub on the community level, e.g. changing the community name, adding CSS etc.
   */
  community = {
    /**
     * Update the community settings
     */
    update: async ({
      pubHeaderTheme,
      license,
      citationStyle,
      nodeLabels,
      pubEdgeDisplay,
      ...putPayload
    }: CommunityPutPayload & FacetsProps) => {
      const facetsPayload: FacetsPayload = {
        facets: {
          PubHeaderTheme: pubHeaderTheme ?? {},
          License: license ?? {},
          CitationStyle: citationStyle ?? {},
          NodeLabels: nodeLabels ?? {},
          PubEdgeDisplay: pubEdgeDisplay ?? {},
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
        const facetsResponse = (await this.updateFacets(
          facetsPayload.scope,
          facetsPayload.facets
        )) as { facets: (typeof facetsPayload)['facets'] }

        // facets does not return the facets, so we just set them if nothing went wrong
        response = { ...response, facets: facetsPayload.facets } //facetsResponse.facets }
      }

      return response
    },

    /**
     * Update the global community CSS
     */
    css: async (css: string) => {
      const response = await this.authedRequest('customScripts', 'POST', {
        communityId: this.communityId,
        type: 'css',
        content: css,
      })

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
      ({ url, size, key, fileName, mimeType }, idx) => ({
        assetKey: key,
        clientPath: fileName,
        id: idx + 1,
        state: 'complete',
        loaded: size,
        total: size,
      })
    )

    const labeledFiles = labelFiles(sourceFiles)

    return await this.importFiles(labeledFiles)
  }

  /**
   * Basic export function, equivalent to the `/api/export` endpoint
   */
  private exportPub = async ({
    pubId,
    format,
    historyKey,
  }: {
    pubId: string
    format: ExportFormats
    historyKey: number
  }) => {
    const payload: ExportPayload = {
      communityId: this.communityId,
      pubId,
      format,
      historyKey,
    }

    let workerTaskId = await this.authedRequest(`export`, 'POST', payload)

    if (typeof workerTaskId !== 'string') {
      /**
       * If its cached, pubpub just immediately returns the url
       */
      if (workerTaskId.url) {
        // throw new Error('Worker task id is not a string')
        return workerTaskId as WorkerTaskExportOutput
      }

      if (!('taskId' in workerTaskId)) {
        throw new Error('Worker task id is not a string')
      }

      workerTaskId = workerTaskId.taskId as string
    }

    return (await this.waitForWorkerTask(
      workerTaskId
    )) as WorkerTaskExportOutput
  }

  /**
   * Basic import function, equivalent to the `/api/import` endpoint
   */
  private importFiles = async (sourceFiles: SourceFile[]) => {
    const payload: ImportPayload = {
      importerFlags: {},
      sourceFiles,
      useNewImporter: true,
    }
    const workerTaskId = await this.authedRequest(`import`, 'POST', payload)

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
  private waitForWorkerTask = async (workerTaskId: string) => {
    const poll = async (): Promise<any> => {
      console.log(`Polling for ${workerTaskId}`)
      const task = (await this.authedRequest(
        `workerTasks?workerTaskId=${workerTaskId}`,
        'GET'
      )) as WorkerTaskResponse

      if (!task.isProcessing && task.output) {
        return task.output
      }

      if (task.error) {
        console.error(task.error)
        throw new Error(task.error)
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      return poll()
    }

    return poll()
  }
}

interface FileImportPayload {
  file: Blob | Buffer | File | string
  fileName: string
  mimeType: (typeof allowedMimeTypes)[number]
}

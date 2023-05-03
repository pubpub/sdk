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
  Roles,
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
  Pub,
  PubsManyResponse,
  UpdateCollectionsMetaData,
  UploadPolicyResponse,
  WorkerTaskExportOutput,
  WorkerTaskImportOutput,
  WorkerTaskResponse,
} from './types'
import { InitialData } from './initialData'
import { Collection, CollectionScopeData } from './collectionData'
import axios from 'axios'
import { generateFileNameForUpload } from './generateFileNameForUpload'
import { generateHash } from './generateHash'
import { PubViewData } from './viewData'
import { ProposedMetadata, writeDocumentToPubDraft } from './editor/firebase'
import { labelFiles } from './formats'
import { initFirebase } from './firebase/initFirebase'
import { createReadStream, ReadStream } from 'fs'
import FormData from 'form-data'
import { Fragment } from 'prosemirror-model'
import { buildSchema } from './editor/schema'

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
  cookie?: string
  communityId: string
  communityUrl: string

  AWS_S3 = 'https://s3-external-1.amazonaws.com'

  self = this

  constructor(communityId: string, communityUrl: string) {
    this.communityId = communityId
    this.communityUrl = communityUrl
  }

  /**
   * Login to the PubPub API. Needs to be called before any other method.
   **/
  async login(email: string, password: string) {
    const response = await axios(`${this.communityUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        email,
        password: SHA3(password).toString(encHex),
      }),
    })

    const cookie = response.headers['set-cookie']

    if (!cookie) {
      throw new Error(`Login failed
      ${response.data}`)
    }

    this.cookie = cookie[0]
  }

  async logout() {
    const response = await this.authedRequest('logout', 'GET')

    this.cookie = undefined
    console.log('Succesfully logged out!')

    return response
  }

  async authedRequest(
    path: string,
    method: 'GET',
    options?: RequestInit
  ): Promise<Record<string, any> | string>
  async authedRequest(
    path: string,
    method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Record<string, any>,
    options?: RequestInit
  ): Promise<Record<string, any> | string>
  async authedRequest(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    bodyOrOptions: Record<string, any> | RequestInit,
    optionsMabye?: RequestInit
  ): Promise<Record<string, any> | string> {
    const options = method === 'GET' ? bodyOrOptions : optionsMabye
    const body = method !== 'GET' ? JSON.stringify(bodyOrOptions) : undefined

    const response = await axios(`${this.communityUrl}/api/${path}`, {
      data: body,
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

    return response.data
  }

  getPage = async (slug: string) => {
    const bareSlug = slug.replace(this.communityUrl, '')?.replace(/^\//, '')
    const response = await axios(`${this.communityUrl}/${bareSlug}`, {
      method: 'GET',
      headers: {
        Cookie: this.cookie || '',
      },
    })

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      )
    }

    return response.data
  }

  async updateFacets(scope: Scope, facets: Facets) {
    const response = await this.authedRequest(`facets`, 'POST', {
      scope,
      facets,
    })
    return response
  }

  private makePageOperations = () => {
    const create = async ({
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
    }

    return {
      create,
    }
  }

  pages = this.makePageOperations()

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

  private makePubOperations = () => {
    const create = async (collectionId?: string) => {
      const response = await this.authedRequest('pubs', 'POST', {
        collectionId,
        communityId: this.communityId,
      })

      return response
    }

    const put = async (
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
    }

    const del = async (pubId: string) => {
      const response = await this.authedRequest(`pubs`, 'DELETE', {
        pubId,
        communityId: this.communityId,
      })
      return response
    }

    const get = async (pubId: string) => {
      const response = await this.getManyPubs({
        pubIds: [pubId],
      })
      return response.pubsById[pubId]
    }

    const release = async (
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
    }

    /**
     * First connects to Firebase
     * Imports the files
     * Then sends the imported file to firebase
     */
    const importPub = async (
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
    }

    const exportPub = async ({
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
        const pub = await get(pubId)
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
    }

    return {
      create,
      modify: put,
      remove: del,
      get,
      getMany: this.getManyPubs,
      attributions: this.makeAttributionsOperations<'pub'>('pub'),
      release,
      hacks: {
        import: importPub,
        export: exportPub,
      },
    }
  }

  pub = this.makePubOperations()

  private makeHacks = () => {
    const getPageData = (async (
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
      ((page: string, data?: 'view-data') => Promise<PubViewData>)

    const getCommunityData = async () => {
      const communityData = await getPageData('dash/overview')
      return communityData?.communityData
    }
    /**
     * The only way I currently know to get collections is to go to the dashboard and scrape the data from there
     *
     * Very unreliable, could break at any time, plus very slow.
     */
    const getCollections = async () => {
      const communityData = await getCommunityData()

      return communityData?.collections
    }

    const getCollection = async (slug: string) => {
      const collectionData = await getPageData(
        `dash/collection/${slug}/settings/details`
      )

      const collectionElements = collectionData?.scopeData
        ?.elements as unknown as CollectionScopeData['elements']

      const collectionScopeData = collectionElements?.activeCollection

      return collectionScopeData
    }

    const getFullCollectionById_SLOW = async (collectionId: string) => {
      const collections = await getCollections()

      const incompleteCollection = collections?.find(
        (x) => x.id === collectionId
      )

      if (!incompleteCollection) {
        throw new Error('Could not find collection')
      }

      const collection = await getCollection(incompleteCollection.slug)

      return collection
    }

    /**
     * @namespace
     * @borrows getCollections as getCollections
     */
    const hacks = {
      getPageData,
      getCommunityData,
      getCollections,
      getCollection,
      /**
       * Convenience method to get a full collection by ID, which is otherwise not possible.
       *
       * First calls getCollections, finds the correct URL for said collection, then calls getCollection.
       */
      getFullCollectionById_SLOW,
    }

    return hacks
  }

  /**
   * These are hacks that are not part of the (un)official API
   *
   * Basically, we're scraping the page and parsing the (initial) data from the page, usually in a script tag in JSON format
   * Very unreliable, could break at any time.
   */
  hacks = this.makeHacks()

  private makeCollectionOperations = () => {
    /**
     * Create a new collection
     */
    const create = async ({
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
    }

    const modify = async (
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
    }

    const addPub = async (props: { collectionId: string; pubId: string }) => {
      const response = await this.authedRequest(`collectionPubs`, 'POST', {
        ...props,
        communityId: this.communityId,
      })
      return response
    }

    const removePub = async (props: {
      collectionId: string
      pubId: string
    }) => {
      const response = await this.authedRequest(`collectionPubs`, 'DELETE', {
        ...props,
        communityId: this.communityId,
      })
      return response
    }

    /**
     * @borrows this.hacks as hacks
     */
    const collection = {
      create,
      modify,
      addPub,
      removePub,
      attributions: this.makeAttributionsOperations<'collection'>('collection'),
      /**
       * As there are no native ways to get collections, we're using the hacks to get them
       *
       * Very unreliable, could break at any time, plus very slow.
       */
      hacks: {
        getMany: this.hacks.getCollections,
        /**
         * The only way I currently know to get a collection is to go to the dashboard and scrape the data from there
         *
         * Tip: this data is also stored on any Pub that belongs to a collection if you get it through any of the `pub.get` or `pub.getMany` methods!
         * This saves you from doing the extra two requests to get all collections, find the one slug you want from the id, then get the collection.
         *
         */
        get: this.hacks.getCollection,
        getByIdSlow: this.hacks.getFullCollectionById_SLOW,
      },
    }
    return collection
  }

  collection = this.makeCollectionOperations()

  private makeAttributionsOperations<T extends 'pub' | 'collection' = 'pub'>(
    type: T
  ) {
    const path = type === 'pub' ? 'pubAttributions' : 'collectionAttributions'

    const getAttributions = async (id: string) => {
      const manyPubs = await this.getManyPubs({ pubIds: [id] })

      const attributions = manyPubs?.pubsById[id]?.attributions ?? []
      return attributions
    }

    const post = async (props: AttributionsPayload) => {
      const response = await this.authedRequest(path, 'POST', props)

      return response
    }

    /**
     * Modify an attribution
     *
     * You can either pass a name or a userId
     * If you pass a name, it will find the attribution with that name and modify it
     */
    const put = async (
      props: T extends 'pub'
        ? AttributionsPayload
        : Omit<AttributionsPayload, 'name'>
    ) => {
      if (!('name' in props) || !props.name) {
        const response = await this.authedRequest(path, 'PUT', props)
        return response
      }

      const attributions = await getAttributions(props.pubId)

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
    }

    const del = async (
      props: T extends 'pub'
        ? AttributionsPayload
        : Omit<AttributionsPayload, 'name'>
    ) => {
      if (!('name' in props) || !props.name) {
        const response = await this.authedRequest(path, 'DELETE', props)
        return response
      }

      const attributions = await getAttributions(props.pubId)

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
    }

    return {
      ...(type === 'pub' ? { get: getAttributions } : {}),
      create: post,
      /**
       * @inheritdoc put
       */
      modify: put,
      remove: del,
    } as T extends 'pub'
      ? {
          get: typeof getAttributions
          create: typeof post
          modify: typeof put
          remove: typeof del
        }
      : { create: typeof post; modify: typeof put; remove: typeof del }
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
  }: FileImportPayload) =>
    // fileOrPath: Blob | Buffer | File | string,
    // fileName: string,
    // mimeType: (typeof allowedMimeTypes)[number]
    {
      if (
        typeof window === 'undefined' &&
        process.version &&
        parseInt(process.version.slice(1).split('.')[0]) < 18
      ) {
        throw new Error(
          'Node version must be 18 or higher to use uploadFile, as it depends on native FormData and Blob support'
        )
      }

      const fileOrStream =
        typeof file === 'string' ? createReadStream(file) : file

      // const file =
      //   file instanceof ReadStream || file instanceof Blob
      //     ? file
      //     : new Blob([file], { type: mimeType })

      const res =
        fileOrStream instanceof ReadStream || fileOrStream instanceof Buffer
          ? fileOrStream
          : Buffer.from(await fileOrStream.arrayBuffer())

      // const size =
      //   typeof file === 'string'
      //     ? (await stat(file as string))?.size
      //     : res.byteLength

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
        const response = await axios.post(
          `${this.AWS_S3}/${policy.bucket}`,
          formData
        )

        const size = formData.getLengthSync()
        return {
          url: `https://assets.pubpub.org/${key}`,
          size,
          key,
          data: response.data,
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
   * Constructs the `PubPub.community` methods
   */
  private makeCommuntiyOperations = () => {
    const put = async ({
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
    }

    const css = async (css: string) => {
      const response = await this.authedRequest('customScripts', 'POST', {
        communityId: this.communityId,
        type: 'css',
        content: css,
      })

      return response
    }

    return {
      modify: put,
      css,
      hacks: {
        get: this.hacks.getCommunityData,
      },
    }
  }

  community = this.makeCommuntiyOperations()

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

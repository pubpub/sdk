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
} from './types'
import { InitialData } from './initialData'
import { Collection, CollectionScopeData } from './collectionData'
import axios from 'axios'
import { generateFileNameForUpload } from './generateFileNameForUpload'
import { generateHash } from './generateHash'
// create a http client that can make authenticated requests to an api by setting a cookie

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
    const response = await axios(`${this.communityUrl}/${slug}`, {
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
    const response = await this.authedRequest(`facets`, 'PUT', {
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

    const put = async ({
      pubId,
      title,
      description,
      avatar,
      slug,
      customPublishedAt,
      downloads,
      htmlTitle,
      license,
      nodeLabels,
      pubEdgeDisplay,
      pubHeaderTheme,
      citationStyle,
    }: Omit<PubPutPayload, 'communityId'> & {
      license?: License
      nodeLabels?: NodeLabels
      pubEdgeDisplay?: PubEdgeDisplay
      pubHeaderTheme?: PubHeaderTheme
      citationStyle?: CitationStyle
    }) => {
      const facetsPayload: FacetsPayload = {
        facets: {
          License: license ?? {},
          NodeLabels: nodeLabels ?? {},
          PubEdgeDisplay: pubEdgeDisplay ?? {},
          PubHeaderTheme: pubHeaderTheme ?? {},
          CitationStyle: citationStyle ?? {},
        },
        scope: {
          id: 'pubId',
          kind: 'pub',
        },
      }

      const putPayload = {
        pubId,
        communityId: this.communityId,
        title,
        description,
        avatar,
        slug,
        customPublishedAt,
        downloads,
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
        response.facets = facets as typeof facetsPayload.facets
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
      }
    ) => {
      const response = await this.authedRequest(`releases`, 'POST', {
        pubId,
        communityId: this.communityId,
        noteText,
        noteContent,
      })
      return response
    }

    return {
      create,
      modify: put,
      remove: del,
      get,
      getMany: this.getManyPubs,
      attributions: this.makeAttributionsOperations<'pub'>('pub'),
      release,
    }
  }

  pub = this.makePubOperations()

  private makeHacks = () => {
    const getCommunityData = async () => {
      const response = await this.getPage(`dash/overview`)

      const unparsedCommunityData = response.match(
        /<script id="initial-data" type="text\/plain" data-json="(.*?)"/
      )

      if (!unparsedCommunityData) {
        throw new Error('Could not find community data')
      }

      const communityData = JSON.parse(
        unparsedCommunityData[1].replace(/&quot;/g, '"')
      ) as InitialData

      return communityData?.communityData
    }

    const getCollections = async () => {
      const communityData = await getCommunityData()

      return communityData?.collections
    }

    const getCollection = async (slug: string) => {
      const response = await this.getPage(
        `dash/collection/${slug}/settings/details`
      )

      const unparsedCollectionData = response.match(
        /<script id="initial-data" type="text\/plain" data-json="(.*?)"/
      )

      if (!unparsedCollectionData) {
        throw new Error('Could not find collection data')
      }

      const collectionData = JSON.parse(
        unparsedCollectionData[1].replace(/&quot;/g, '"')
      )

      const collectionScopeData = collectionData?.scopeData?.elements
        ?.activeCollection as CollectionScopeData['elements']['activeCollection']

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

    return {
      getCommunityData,
      /**
       * The only way I currently know to get collections is to go to the dashboard and scrape the data from there
       *
       * Very unreliable, could break at any time, plus very slow.
       */
      getCollections,
      getCollection,
      /**
       * Convenience method to get a full collection by ID, which is otherwise not possible.
       *
       * First calls getCollections, finds the correct URL for said collection, then calls getCollection.
       */
      getFullCollectionById_SLOW,
    }
  }

  /**
   * These are hacks that are not part of the (un)official API
   *
   * Basically, we're scraping the page and parsing the (initial) data from the page, usually in a script tag in JSON format
   * Very unreliable, could break at any time.
   */
  hacks = this.makeHacks()

  private makeCollectionOperations = () => {
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
        const facetsResponse = await this.authedRequest(
          `facets`,
          'POST',
          facetsPayload
        )

        response.facets = facetsResponse as typeof facetsPayload.facets
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

    return {
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
      props: T extends Pub
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
      props: T extends Pub
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
   */
  uploadFile = async (
    file: Blob | Buffer,
    fileName: string,
    mimeType: (typeof allowedMimeTypes)[number]
  ) => {
    const blb =
      file instanceof Blob ? file : new Blob([file], { type: mimeType })

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
    // formData.append('file', createReadStream(filePath), fileName)
    formData.append('file', blb, fileName)

    try {
      const response = await axios.post(
        `${this.AWS_S3}/${policy.bucket}`,
        formData
      )

      return {
        url: `https://assets.pubpub.org/${key}`,
        data: response.data,
      }
    } catch (error) {
      console.log(error)
      throw new Error('Upload failed')
    }
  }

  uploadPolicy = async (
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

  makeCommuntiyOperations = () => {
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
        response = { ...response, facets: facetsResponse.facets }
      }

      return response
    }

    return {
      modify: put,
      hacks: {
        get: this.hacks.getCommunityData,
      },
    }
  }
}

interface PubsManyResponse {
  pubIds: string[]
  pubsById: PubsById
  loadedAllPubs: boolean
}

interface PubsById {
  [key: string]: Pub
}

interface Pub {
  id: string
  slug: string
  title: string
  htmlTitle?: string
  description?: string
  htmlDescription?: string
  avatar: string
  customPublishedAt?: string
  doi: string
  labels?: any
  downloads: Download[]
  metadata?: Metadata
  viewHash?: string
  editHash?: string
  reviewHash?: string
  commentHash?: string
  draftId: string
  communityId: string
  createdAt: string
  updatedAt: string
  crossrefDepositRecordId?: string
  scopeSummaryId: string
  members: Member[]
  draft: Draft
  crossrefDepositRecord?: any
  scopeSummary: ScopeSummary
  outboundEdges: any[]
  reviews: any[]
  inboundEdges: any[]
  releases: Release[]
  attributions: Attribution[]
  collectionPubs: CollectionPub[]
  isRelease: boolean
  releaseNumber?: any
}

interface CollectionPub {
  id: string
  pubId: string
  collectionId: string
  contextHint?: string
  rank: string
  pubRank: string
  createdAt: string
  updatedAt: string
  collection: Collection
}

interface Metadata {
  doi?: string
  url?: string
  issue?: string
  volume?: string
  electronicIssn?: string
  publicationDate?: string
  printPublicationDate?: string
}

interface Attribution {
  id: string
  name: string
  avatar?: any
  title?: any
  order: number
  isAuthor: boolean
  roles?: any
  affiliation?: any
  orcid?: any
  userId?: any
  pubId: string
  createdAt: string
  updatedAt: string
  user: User
}

interface User {
  isShadowUser: boolean
  id: string
  initials: string
  fullName: string
  firstName: string
  lastName: string
  avatar?: any
  title?: any
  orcid?: any
}

interface Release {
  id: string
  noteContent?: NoteContent
  noteText?: string
  pubId: string
  userId: string
  docId: string
  historyKey: number
  historyKeyMissing: boolean
  createdAt: string
  updatedAt: string
}

interface NoteContent {
  type: string
  attrs: Attrs
  content: Content2[]
}

interface Content2 {
  type: string
  attrs: Attrs2
  content: Content[]
}

interface Content {
  text: string
  type: string
}

interface Attrs2 {
  id: string
  rtl?: any
  class?: any
  textAlign?: any
}

interface Attrs {
  meta: Meta
}

interface Meta {}

interface ScopeSummary {
  id: string
  collections: number
  pubs: number
  discussions: number
  reviews: number
  submissions: number
  createdAt: string
  updatedAt: string
}

interface Draft {
  id: string
  latestKeyAt: string
  firebasePath: string
  createdAt: string
  updatedAt: string
}

interface Member {
  id: string
  permissions: string
  isOwner: boolean
  subscribedToActivityDigest: boolean
  userId: string
  pubId: string
  collectionId?: any
  communityId?: any
  organizationId?: any
  createdAt: string
  updatedAt: string
}

interface Download {
  url: string
  type: string
  createdAt: string
}

export type AttributionsPayload = {
  pubId: string
  order?: number
  roles: Roles
  affiliation?: string
  isAuthor?: boolean
} & (
  | {
      userId: string
      name?: undefined
      orcid?: undefined
    }
  | {
      name: string
      userId?: undefined
      orcid?: string
    }
)

export type GetManyOptions = {
  excludeCollectionIds?: string[]
  ordering?: {
    field: 'updatedDate' | 'creationDate' | 'collectionRank' | 'title'
    direction: 'ASC' | 'DESC'
  }
  limit?: number
  offset?: number
} & (
  | { collectionIds: string[]; pubIds?: undefined[] }
  | { pubIds: string[]; collectionIds?: undefined[] }
  | { pubIds?: undefined[]; collectionIds?: undefined[] }
)

export interface UpdateCollectionPayload {
  metadata: Metadata
  id: string
  communityId: string
}

interface CommonCollectionsMetadata {
  slug?: string
  title?: string
}

export interface UpdateCollectionsBookMetadata {
  doi?: string
  url?: string
  isbn?: string
  copyrightYear?: string
  publicationDate?: string
  edition?: string
  issue?: undefined
  volume?: undefined
}

export interface UpdateCollectionsIssueMetadata {
  doi?: string
  url?: string
  issn?: string
  copyrightYear?: string
  publicationDate?: string
  issue?: string
  volume?: string
  edition?: undefined
  isbn?: undefined
}

export interface UpdateCollectionsConferenceMetadata {
  doi?: string
  url?: string

  issn?: undefined
  copyrightYear?: undefined
  publicationDate?: undefined
  issue?: undefined
  volume?: undefined
  edition?: undefined
  isbn?: undefined
}

export type UpdateCollectionsMetaData = CommonCollectionsMetadata &
  (
    | UpdateCollectionsBookMetadata
    | UpdateCollectionsIssueMetadata
    | UpdateCollectionsConferenceMetadata
  )

export interface UploadPolicyResponse {
  acl: string
  awsAccessKeyId: string
  policy: string
  signature: string
  bucket: string
}

export const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/gif',
] as const

export interface FacetsProps {
  license?: License
  nodeLabels?: NodeLabels
  pubEdgeDisplay?: PubEdgeDisplay
  pubHeaderTheme?: PubHeaderTheme
  citationStyle?: CitationStyle
}

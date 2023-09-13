import { Collection } from './collectionData'
import { ResourceWarning } from './editor/types'
import { InitialData } from './initialData'
import { PubViewDataPub } from './viewData'
import { DefinitelyHas } from './type-helpers'
import { ProposedMetadata } from './firebase/rest/firebase'

export type Chapter = {
  chapter: number
  id: string
  data: Pub
}

export type PubAttributionsPostPayload = {
  name: string
  order: number
  isAuthor: boolean
  communityId: string
  pubId: string
}

const DEFAULT_ROLES = [
  'Conceptualization',
  'Methodology',
  'Software',
  'Validation',
  'Formal Analysis',
  'Investigation',
  'Resources',
  'Data Curation',
  'Writing – Original Draft Preparation',
  'Writing – Review & Editing',
  'Visualization',
  'Supervision',
  'Project Administration',
  'Peer Review',
  'Funding Acquisition',
  'Illustrator',
  'Editor',
  'Series Editor',
  'Translator',
  'Chair',
] as const

export type Roles = (typeof DEFAULT_ROLES)[number]

export type PubAttributionsPostResponse = {
  id: string
  name: string
  avatar?: string
  title?: string
  order: number
  isAuthor: boolean
  roles?: Roles
  affiliation?: string
  orcid?: string
  userId?: string
  pubId: string
  createdAt: string
  user: User
}

export type User = {
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

export type PubAttributionsPutPayload = {
  id: string
  affiliation?: string
  orcid?: string
  roles?: string[]
  communityId: string
  pubId: string
}
export type Downloads = {
  url: string
  type: ExportFormats
  branchId?: string
  createdAt: string
}

export type ExportFormats =
  | 'docx'
  | 'html'
  | 'pdf'
  | 'markdown'
  | 'odt'
  | 'tex'
  | 'plain'
  | 'epub'
  | 'jats'
  | 'formatted'
  | 'json'

export type PubPutPayload = {
  pubId: string
  avatar?: string
  description?: string
  slug?: string
  htmlTitle?: string
  title?: string
  doi?: string
  customPublishedAt?: string
  /**
   * Links to files that should be added to the pub
   *
   * You can directly link to already existing files,
   * or you can pass the necessary information to upload a new file
   * and we will do it for you.
   *
   * You can only upload pdf files
   */
  downloads?: (
    | FilePut
    | {
        /**
         * You are required to pass the mimeType to double check that you are uploading a pdf file
         */
        mimeType: 'application/pdf'
        fileOrPath: Buffer | Blob | File
        fileName: string
      }
  )[]
  communityId?: string
}

type FilePut = {
  type: 'formatted'
  url: string
  createdAt?: string
}

export type FacetsPayload = {
  scope: Scope
  facets: Facets
}

export type Facets = {
  CitationStyle: CitationStyle | Record<string, never>
  License: License | Record<string, never>
  NodeLabels: NodeLabels | Record<string, never>
  PubEdgeDisplay: PubEdgeDisplay | Record<string, never>
  PubHeaderTheme: PubHeaderTheme | Record<string, never>
}

const textStyles = ['dark', 'light', 'black-blocks', 'white-blocks'] as const
export type PubHeaderTheme = {
  backgroundImage: string
  backgroundColor: string
  textStyle: (typeof textStyles)[number]
}

export type PubEdgeDisplay = Record<string, never>

export type NodeLabels = {
  image: Label
  video: Label
  audio: Label
  table: Label
  math: Label
}

export type Label = {
  enabled: boolean
  text: string
}

const licenses = [
  'cc-by',
  'cc-0',
  'cc-by-nc',
  'cc-by-nd',
  'cc-by-nc-nd',
  'cc-by-nc-sa',
  'cc-by-sa',
  'copyright',
] as const
export type License = {
  kind: (typeof licenses)[number]
}

const citationStyles = [
  'acm-siggraph',
  'american-anthro',
  'apa',
  'apa-7',
  'arcadia-science',
  'cell',
  'chicago',
  'harvard',
  'elife',
  'frontiers',
  'mla',
  'vancouver',
  'ama',
] as const

export const inlineCitationStyles = [
  'count',
  'authorYear',
  'author',
  'label',
] as const

export type CitationStyle = {
  citationStyle: (typeof citationStyles)[number]
  inlineCitationStyle: (typeof inlineCitationStyles)[number]
}

export type Scope = {
  kind: 'pub' | 'community' | 'collection'
  id: string
}

const collectionKinds = ['issue', 'book', 'journal', 'tag'] as const

export type CollectionKind = (typeof collectionKinds)[number]

export type CommunityPutResponse = {
  title?: string
  citeAs?: string
  publishAs?: string
  /**
   * @maxlength 280
   */
  description?: string
  avatar?: string
  favicon?: string
  accentColorLight?: string
  accentColorDark?: string
  hideCreatePubButton?: boolean
  headerLogo?: string
  headerColorType?: 'light' | 'dark' | 'custom'
  useHeaderTextAccent?: boolean
  hideHero?: boolean
  hideHeaderLogo?: boolean
  heroLogo?: string
  heroBackgroundImage?: string
  heroBackgroundColor?: string
  heroTextColor?: string
  /**
   * Unsure if this still does something
   */
  useHeaderGradient?: boolean
  heroImage?: string
  heroTitle?: string
  heroText?: string
  heroPrimaryButton?: { url: string; title: string }
  heroSecondaryButton?: { url: string; title: string }
  heroAlign?: string
  navigation: NavigationLink[]
  hideNav?: boolean
  footerLinks?: FooterLink[]
  footerLogoLink?: string
  footerTitle?: string
  footerImage?: string
  website?: string
  facebook?: string
  twitter?: string
  email?: string
  issn?: string
}

export type CommunityPutPayload = Omit<
  CommunityPutResponse,
  'navigation' | 'footerLinks'
> & {
  navigation?: NavigationLink<'request'>[]
  footerLinks?: FooterLink<'request'>[]
}

type NavigationLink<T extends 'request' | 'response' = 'response'> =
  | (T extends 'request' ? Omit<DropDownMenu, 'id'> : DropDownMenu)
  | PageOrCollectionLink
  | (T extends 'request' ? Omit<ExternalLink, 'id'> : ExternalLink)

type FooterLink<T extends 'request' | 'response' = 'response'> =
  | PageOrCollectionLink
  | (T extends 'request' ? Omit<ExternalLink, 'id'> : ExternalLink)

type DropDownMenu = {
  /**
   * You don't have to define an id when creating a new menu
   */
  id: string
  title: string
  children: Child[]
}
type PageOrCollectionLink = {
  id: string
  type: 'page' | 'collection'
}
type ExternalLink = {
  id: string
  title: string
  href: string
}

type Child = PageOrCollectionLink | ExternalLink

export type ImportPayload = {
  sourceFiles: SourceFile[]
  importerFlags: ImporterFlags
  useNewImporter: boolean
}

type ImporterFlags = Record<string, never>

export type SourceFile = {
  id: number
  state: string
  clientPath: string
  loaded: number
  total: number
  label?: string
  assetKey: string
}

export type ExportPayload = {
  communityId: string
  format: ExportFormats
  historyKey: number
  pubId: string
}

export type WorkerTaskResponse = {
  id: string
  isProcessing: boolean
  error?: any
  output?: unknown
}

export type WorkerTaskExportOutput = {
  url: string
}

export type WorkerTaskImportOutput = {
  doc: any
  warnings: ResourceWarning[]
  proposedMetadata: ProposedMetadata
  pandocErrorOutput: string
}

export type PubsManyResponse = {
  pubIds: string[]
  pubsById: PubsById
  loadedAllPubs: boolean
}

export type PubsById = {
  [key: string]: Pub
}

export type Pub = {
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

type CollectionPub = {
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

export type Metadata = {
  doi?: string
  url?: string
  issue?: string
  volume?: string
  electronicIssn?: string
  publicationDate?: string
  printPublicationDate?: string
}

export type Attribution = {
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

export type Release = {
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

type NoteContent = {
  type: string
  attrs: Attrs
  content: Content2[]
}

type Content2 = {
  type: string
  attrs: Attrs2
  content: Content[]
}

type Content = {
  text: string
  type: string
}

type Attrs2 = {
  id: string
  rtl?: any
  class?: any
  textAlign?: any
}

type Attrs = {
  meta: Meta
}

type Meta = Record<string, never>

type ScopeSummary = {
  id: string
  collections: number
  pubs: number
  discussions: number
  reviews: number
  submissions: number
  createdAt: string
  updatedAt: string
}

type Draft = {
  id: string
  latestKeyAt: string
  firebasePath: string
  createdAt: string
  updatedAt: string
}

type Member = {
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

type Download = {
  url: string
  type: string
  createdAt: string
}

export type AttributionsPayload = {
  pubId: string
  order?: number
  roles: Roles[]
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

export type UpdateCollectionPayload = {
  metadata: Metadata
  id: string
  communityId: string
}

type CommonCollectionsMetadata = {
  slug?: string
  title?: string
}

export type UpdateCollectionsBookMetadata = {
  doi?: string
  url?: string
  isbn?: string
  copyrightYear?: string
  publicationDate?: string
  edition?: string
  issue?: undefined
  volume?: undefined
}

export type UpdateCollectionsIssueMetadata = {
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

export type UpdateCollectionsConferenceMetadata = {
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

export type UploadPolicyResponse = {
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
  'text/tex-x',
  'text/html',
  'text/plain',
] as const

export type FacetsProps = {
  license?: License
  nodeLabels?: NodeLabels
  pubEdgeDisplay?: PubEdgeDisplay
  pubHeaderTheme?: PubHeaderTheme
  citationStyle?: CitationStyle
}

export type GetPageDataOverload = {
  (page: string, data: 'initial-data'): Promise<InitialData>
  (page: string, data: 'view-data'): Promise<PubViewDataPub>

  (page: string, data: 'view-data' | 'initial-data'):
    | Promise<PubViewDataPub>
    | Promise<InitialData>
}

export type ReleaseResponse = {
  id: string
  historyKeyMissing: boolean
  noteContent: string | null
  noteText: string | null
  historyKey: number
  userId: string
  pubId: string
  docId: string
  updatedAt: string
  createdAt: string
}

export type PubAttribution = {
  id: string
  name: string
  avatar?: string
  title?: string
  order: number
  isAuthor?: boolean
  roles?: string[]
  affiliation?: string
  orcid?: string
  userId?: string
  user?: MinimalUser
  createdAt: string
  pubId: string
}

export type MinimalUser = {
  id: string
  slug?: string
  initials: string
  fullName: string
  firstName: string
  lastName: string
  avatar?: string
  title?: string
  orcid?: string
  isShadowUser?: boolean
  publicEmail?: string
  feedback?: string
}

export type DiscussionAnchor = {
  id: string
  discussionId: string
  historyKey: number
  selection: null | { type: 'text'; anchor: number; head: number }
  originalText: string
  originalTextPrefix: string
  originalTextSuffix: string
  isOriginal: boolean
}

export type VisibilityAccess = 'private' | 'members' | 'public'

export type VisibilityUser = {
  id: string
  visibilityId: string
  userId: string
}

export type Visibility = {
  id: string
  access: VisibilityAccess
  users: VisibilityUser[]
}

export type TaggedVisibilityParent =
  | { type: 'discussion'; value: Discussion }
  | { type: 'review'; value: Review }

export type Review = {
  id: string
  author: User
  createdAt: string
  updatedAt: string
  title: string
  number: number
  status: 'open' | 'closed' | 'completed'
  releaseRequested: boolean
  threadId: string
  thread: Thread
  visibilityId: string
  visibility?: Visibility
  userId: string
  pubId: string
  pub?: Pub
  reviewContent?: DocJson
  reviewers?: Reviewer[]
}

export type Reviewer = {
  id: string
  name: string
}

export type Discussion = {
  id: string
  title: string
  number: number
  isClosed: boolean
  labels: string[]
  threadId: string
  visibilityId: string
  userId: string
  pubId: string
  anchors?: DiscussionAnchor[]
  visibility: Visibility
  thread?: Thread
  pub?: Pub
}

export type Commenter = {
  id: string
  name: string
}

export type ThreadEvent = {
  id: string
  type?: string
  data?: Record<string, never>
  userId: string
  threadId: string
}

export type ThreadComment = {
  id: string
  createdAt: string
  updatedAt: string
  text: string
  content: DocJson
  userId: null | string
  threadId: string
  commenterId: null | string
  author?: null | User
  commenter?: null | Commenter
}

export type Thread = {
  id: string
  createdAt: string
  updatedAt: string
  locked?: boolean
  comments: ThreadComment[]
  events: ThreadEvent[]
}

export type DocJson = { type: 'doc'; attrs: any; content: any[] }

export type CollectionPubWithAttributions = CollectionPub & {
  collection: DefinitelyHas<Collection, 'attributions'>
}

export type Doc = {
  id: string
  createdAt: string
  updatedAt: string
  content: DocJson
}

export type UserScopeVisit = {
  id: string
  communityId: string
  updatedAt: string
  collectionId: null | string
  pubId: null | string
  userId: string
}

export type Chapter = {
  chapter: number
  id: string
  data: Pub
}

export type Pub = {
  id: string
  licenseSlug: string
  citationStyle: string
  citationInlineStyle: string
  pubEdgeListingDefaultsToCarousel: boolean
  pubEdgeDescriptionVisible: boolean
  title: string
  slug: string
  communityId: string
  headerBackgroundColor: string
  headerStyle: string
  viewHash: string
  editHash: string
  reviewHash: string
  commentHash: string
  draftId: string
  updatedAt: string
  createdAt: string
  description?: any
  avatar?: any
  useHeaderImage?: any
  firstPublishedAt?: any
  lastPublishedAt?: any
  draftEditHash?: any
  draftViewHash?: any
  doi?: any
  labels?: any
  isCommunityAdminManaged?: any
  communityAdminDraftPermissions: string
  draftPermissions: string
  review?: any
  downloads?: any
  headerBackgroundType: string
  headerBackgroundImage?: any
  customPublishedAt?: any
  metadata?: any
  crossrefDepositRecordId?: any
  nodeLabels: NodeLabels
  scopeSummaryId?: any
  htmlTitle?: any
  facetsMigratedAt?: any
  htmlDescription?: any
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

export type PubPutPayload = {
  pubId: string
  avatar?: string
  description?: string
  slug?: string
  htmlTitle?: string
  title?: string
  customPublishedAt?: string
  /**
   * Links to files that should be added to the pub
   *
   * You can directly link to already existing files,
   * or you can upload new files first using `PubPub.uploadFile`
   *
   */
  downloads?: FilePut[]
  communityId?: string
}

type FilePut = {
  type: 'formatted'
  url: string
  createdAt: string
}

export type FacetsPayload = {
  scope: Scope
  facets: Facets
}

export type Facets = {
  CitationStyle: CitationStyle | {}
  License: License | {}
  NodeLabels: NodeLabels | {}
  PubEdgeDisplay: PubEdgeDisplay | {}
  PubHeaderTheme: PubHeaderTheme | {}
}

const textStyles = ['dark', 'light', 'black-blocks', 'white-blocks'] as const
export type PubHeaderTheme = {
  backgroundImage: string
  backgroundColor: string
  textStyle: (typeof textStyles)[number]
}

export type PubEdgeDisplay = {}

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

type ImporterFlags = {}

export type SourceFile = {
  id: number
  state: string
  clientPath: string
  loaded: number
  total: number
  label?: string
  assetKey: string
}

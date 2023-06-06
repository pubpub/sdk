export type CollectionInitialData = {
  scopeData: CollectionScopeData
}

export type CollectionScopeData = {
  elements: Elements
  optionsData: any[]
  memberData: MemberDatum[]
  activePermissions: ActivePermissions
  activeCounts: ActiveCounts
  scope: ActiveIds
  facets: Facets
}

type Facets = {
  CitationStyle: CitationStyle2
  License: License
  NodeLabels: NodeLabels
  PubEdgeDisplay: PubEdgeDisplay
  PubHeaderTheme: PubHeaderTheme
}

type PubHeaderTheme = {
  props: Props5
  value: Value9
  stack: Stack5[]
}

type Stack5 = {
  scope: Scope2
  value: Value10
  facetBindingId: string
}

type Value10 = {
  backgroundImage?: string
  backgroundColor: string
  textStyle: string
}

type Value9 = {
  backgroundImage: string
  backgroundColor: string
  textStyle: string
}

type Props5 = {
  backgroundImage: BackgroundImage
  backgroundColor: CitationStyle
  textStyle: CitationStyle
}

type BackgroundImage = {
  sources: Source5[]
  value: string
}

type Source5 = {
  scope: Scope
  value?: string
  facetBindingId?: string
}

type PubEdgeDisplay = {
  props: Props4
  value: Value7
  stack: Stack4[]
}

type Stack4 = {
  scope: Scope2
  value: Value8
  facetBindingId: string
}

type Value8 = {
  defaultsToCarousel?: any
  descriptionIsVisible?: any
}

type Value7 = {
  defaultsToCarousel: boolean
  descriptionIsVisible: boolean
}

type Props4 = {
  defaultsToCarousel: DefaultsToCarousel
  descriptionIsVisible: DefaultsToCarousel
}

type DefaultsToCarousel = {
  sources: Source4[]
  value: boolean
}

type Source4 = {
  scope: Scope
  value?: boolean
  facetBindingId?: string
}

type NodeLabels = {
  props: Props3
  value: Value6
  stack: Stack3[]
}

type Stack3 = {
  scope: Scope2
  value: Value6
  facetBindingId: string
}

type Value6 = {
  image: Value5
  video: Value5
  audio: Value5
  table: Value5
  math: Value5
}

type Props3 = {
  image: Image
  video: Image
  audio: Image
  table: Image
  math: Image
}

type Image = {
  sources: Source3[]
  value: Value5
}

type Source3 = {
  scope: Scope
  value: Value5
  facetBindingId?: string
}

type Value5 = {
  enabled: boolean
  text: string
}

type License = {
  props: Props2
  value: Value3
  stack: Stack2[]
}

type Stack2 = {
  scope: Scope2
  value: Value4
  facetBindingId: string
}

type Value4 = {
  kind: string
  copyrightSelection?: any
}

type Value3 = {
  kind: string
  copyrightSelection: Value2
}

type Props2 = {
  kind: CitationStyle
  copyrightSelection: CopyrightSelection
}

type CopyrightSelection = {
  sources: Source2[]
  value: Value2
}

type Source2 = {
  scope: Scope
  value?: Value2
  facetBindingId?: string
}

type Value2 = {
  choice: string
  year?: any
}

type CitationStyle2 = {
  props: Props
  value: Value
  stack: Stack[]
}

type Stack = {
  scope: Scope2
  value: Value
  facetBindingId: string
}

type Scope2 = {
  kind: string
  id: string
}

type Value = {
  citationStyle: string
  inlineCitationStyle: string
}

type Props = {
  citationStyle: CitationStyle
  inlineCitationStyle: CitationStyle
}

type CitationStyle = {
  sources: Source[]
  value: string
}

type Source = {
  scope: Scope
  value: string
  facetBindingId?: string
}

type Scope = {
  kind: string
  id?: string
}

type ActiveCounts = {
  reviews: number
  submissions: number
}

type ActivePermissions = {
  activePermission: string
  canView: boolean
  canEdit: boolean
  canManage: boolean
  canAdmin: boolean
  canAdminCommunity: MemberDatum
  canManageCommunity: MemberDatum
  canViewCommunity: MemberDatum
  canEditCommunity: MemberDatum
  isSuperAdmin: boolean
  canCreateReviews: boolean
  canCreateDiscussions: boolean
  canViewDraft?: any
  canEditDraft?: any
}

type MemberDatum = {
  id: string
  permissions: string
  isOwner?: any
  subscribedToActivityDigest: boolean
  userId: string
  pubId?: any
  collectionId?: any
  communityId: string
  organizationId?: any
  createdAt: string
  updatedAt: string
}

type Elements = {
  activeTargetType: string
  activeTargetName: string
  activeTarget: Collection
  activeCollection: Collection
  activeIds: ActiveIds
  inactiveCollections: any[]
  activeCommunity: ActiveCommunity
}

type ActiveCommunity = {
  id: string
  subdomain: string
  domain?: any
  title: string
  citeAs?: any
  publishAs: string
  description: string
  avatar: string
  favicon: string
  accentColorLight: string
  accentColorDark: string
  hideCreatePubButton: boolean
  headerLogo: string
  headerLinks?: any
  headerColorType: string
  useHeaderTextAccent: boolean
  hideHero: boolean
  hideHeaderLogo: boolean
  heroLogo: string
  heroBackgroundImage?: any
  heroBackgroundColor?: any
  heroTextColor: string
  useHeaderGradient: boolean
  heroImage?: any
  heroTitle: string
  heroText: string
  heroPrimaryButton: Meta
  heroSecondaryButton: Meta
  heroAlign: string
  navigation: Navigation[]
  hideNav: boolean
  navLinks?: any
  footerLinks?: any
  footerLogoLink: string
  footerTitle?: any
  footerImage: string
  website: string
  facebook: string
  twitter: string
  email: string
  issn?: any
  isFeatured?: any
  viewHash?: any
  editHash?: any
  premiumLicenseFlag: boolean
  defaultPubCollections: any[]
  spamTagId: string
  organizationId?: any
  createdAt: string
  updatedAt: string
  scopeSummaryId: string
}

type Navigation = {
  id: string
  type?: string
  title?: string
  children?: Child[]
}

type Child = {
  id: string
  type: string
}

type ActiveIds = {
  collectionId: string
  communityId: string
}

export type Collection = {
  id: string
  title: string
  slug: string
  avatar: string
  isRestricted: boolean
  isPublic: boolean
  viewHash: string
  editHash: string
  metadata: Metadata
  kind: string
  doi?: string
  readNextPreviewSize: string
  layout: Layout
  pageId?: string
  communityId: string
  scopeSummaryId: string
  createdAt: string
  updatedAt: string
  crossrefDepositRecordId?: string
  attributions: Attribution[]
}

type Attribution = {
  id: string
  name: string
  avatar?: string
  title?: string
  order: number
  isAuthor: boolean
  roles: string[]
  affiliation?: any
  orcid?: string
  userId?: string
  collectionId: string
  createdAt: string
  updatedAt: string
  user?: any
}

type Layout = {
  blocks: Block[]
  isNarrow: boolean
}

type Block = {
  id: string
  type: string
  content: Content6
}

type Content6 = {
  text?: Text | Text2 | Text3 | string
  align?: string
  buttonUrl?: string
  buttonText?: string
  buttonType?: string
  showButton?: boolean
  backgroundSize?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundHeight?: string
  defaultCollectionIds?: any[]
  sort?: string
  pubPreviewType?: string
}

type Text3 = {
  type: string
  attrs: Attrs
  content: Content5[]
}

type Content5 = {
  type: string
  attrs: Attrs4
  content?: Content4[]
}

type Content4 = {
  text: string
  type: string
  marks?: Mark[]
}

type Mark = {
  type: string
}

type Attrs4 = {
  id: string
  rtl?: any
  class?: string
  textAlign?: any
  level?: number
  fixedId?: string
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
}

type Text2 = {
  type: string
  attrs: Attrs
  content: Content3[]
}

type Content3 = {
  type: string
  attrs?: Attrs3
  content?: Content[]
}

type Attrs3 = {
  id: string
  rtl?: any
  class?: string
  textAlign?: any
  level?: number
  fixedId?: string
}

type Text = {
  type: string
  attrs: Attrs
  content: Content2[]
}

type Content2 = {
  type: string
  attrs?: Attrs2
  content?: Content[]
}

type Content = {
  text: string
  type: string
}

type Attrs2 = {
  id?: string
  rtl?: any
  class?: any
  textAlign?: any
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  fileName?: string
  fileSize?: string
}

type Attrs = {
  meta: Meta
}

type Meta = {}

type Metadata = {
  doi: string
  url: string
  isbn: string
  copyrightYear: string
  publicationDate: string
}

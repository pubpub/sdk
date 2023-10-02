import type { CollectionKind } from './types.js'

export type InitialData = {
  communityData: CommunityData
  loginData: LoginData
  locationData: LocationData
  scopeData: ScopeData
  featureFlags: FeatureFlags
  initialNotificationsData: InitialNotificationsData
  dismissedUserDismissables: HeroPrimaryButton
}

type InitialNotificationsData = {
  hasNotifications: boolean
  hasUnreadNotifications: boolean
}

type FeatureFlags = {
  releaseDiscussionsDialog: boolean
  activityDigestSubscribeToggle: boolean
  notifications: boolean
  submissions: boolean
  surveySummer22: boolean
  reviews: boolean
  comments: boolean
  htmlPubHeaderValues: boolean
}

type ScopeData = {
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
  value: Value9
  facetBindingId: string
}

type Value9 = {
  backgroundImage?: any
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
  value?: any
}

type Source5 = {
  scope: Scope
  value?: any
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
  canViewDraft?: boolean
  canEditDraft?: boolean
}

type MemberDatum = {
  id: string
  permissions: string
  isOwner?: boolean
  subscribedToActivityDigest: boolean
  userId: string
  pubId?: string
  collectionId?: string
  communityId: string
  organizationId?: string
  createdAt: string
  updatedAt: string
}

type Elements = {
  activeTargetType: string
  activeTargetName: string
  activeTarget: ActiveTarget
  activeIds: ActiveIds
  inactiveCollections: string[]
  activeCommunity: ActiveTarget
}

type ActiveIds = {
  communityId: string
}

type ActiveTarget = {
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
  headerLinks?: any[]
  headerColorType: string
  useHeaderTextAccent: boolean
  hideHero: boolean
  hideHeaderLogo: boolean
  heroLogo: string
  heroBackgroundImage?: string
  heroBackgroundColor?: string
  heroTextColor: string
  useHeaderGradient: boolean
  heroImage?: any
  heroTitle: string
  heroText: string
  heroPrimaryButton: HeroPrimaryButton
  heroSecondaryButton: HeroPrimaryButton
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

type LocationData = {
  hostname: string
  path: string
  params: HeroPrimaryButton
  query: HeroPrimaryButton
  queryString: string
  isDashboard: boolean
  isBasePubPub: boolean
  isProd: boolean
  isDuqDuq: boolean
  isQubQub: boolean
  appCommit: string
}

type LoginData = {
  id: string
  initials: string
  slug: string
  fullName: string
  firstName: string
  lastName: string
  avatar: string
  title: string
  gdprConsent: boolean
  isSuperAdmin: boolean
}

export type CommunityData = {
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
  heroPrimaryButton: HeroPrimaryButton
  heroSecondaryButton: HeroPrimaryButton
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
  issn?: string
  isFeatured?: boolean
  viewHash?: string
  editHash?: string
  premiumLicenseFlag: boolean
  defaultPubCollections: string[]
  spamTagId: string
  organizationId?: string
  createdAt: string
  updatedAt: string
  scopeSummaryId: string
  scopeSummary: ScopeSummary
  spamTag: SpamTag
  pages: Page[]
  collections: IncompleteCollection[]
}

type IncompleteCollection = {
  id: string
  title: string
  slug: string
  avatar?: string
  isRestricted: boolean
  isPublic: boolean
  viewHash: string
  editHash: string
  metadata: Metadata
  kind: CollectionKind
  doi?: string
  readNextPreviewSize: string
  layout?: Layout2
  pageId?: string
  communityId: string
  scopeSummaryId: string
  createdAt: string
  updatedAt: string
  crossrefDepositRecordId?: string
  members: any[]
}

type Layout2 = {
  blocks: Block[]
  isNarrow: boolean
}

type Block = {
  id: string
  type: string
  content: Content43
}

type Content43 = {
  text?:
    | Text2
    | Text22
    | Text3
    | Text4
    | Text5
    | Text6
    | Text7
    | Text8
    | Text9
    | Text10
    | Text11
    | Text12
    | Text12
    | Text14
    | Text15
    | Text16
    | Text17
    | Text18
    | Text19
    | Text20
    | Text21
    | Text222
    | Text23
    | Text24
    | Text25
    | Text26
    | Text27
    | Text28
    | Text29
    | Text30
    | Text31
    | Text32
    | string
    | string
    | string
    | string
    | string
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
  hideDate?: boolean
  html?: string
  hideContributors?: boolean
  title?: string
  hideByline?: boolean
  limit?: number
  pubIds?: string[][]
  collectionIds?: (string | string)[]
  items?: Child[]
  hideDates?: boolean
  hideEdges?: boolean
  hideDescription?: boolean
  justify?: string
}

type Text32 = {
  type: string
  attrs: Attrs
  content: Content42[]
}

type Content42 = {
  type: string
  attrs?: Attrs14
  content?: Content[]
}

type Text31 = {
  type: string
  attrs: Attrs
  content: Content41[]
}

type Content41 = {
  type: string
  attrs: Attrs11
  content?: Content7[]
}

type Text30 = {
  type: string
  attrs: Attrs
  content: Content40[]
}

type Content40 = {
  type: string
  attrs: Attrs10
  content?: Content[]
}

type Text29 = {
  type: string
  attrs: Attrs
  content: Content39[]
}

type Content39 = {
  type: string
  attrs: Attrs24
  content?: Content38[]
}

type Content38 = {
  type: string
  attrs?: Attrs25
  text?: string
  marks?: Mark2[]
}

type Attrs25 = {
  id: string
  url: string
  href?: any
  size: number
  align: string
  altText: string
  caption: string
  hideLabel: boolean
  fullResolution: boolean
}

type Attrs24 = {
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
  level?: number
  fixedId?: string
}

type Text28 = {
  type: string
  attrs: Attrs
  content: Content37[]
}

type Content37 = {
  type: string
  attrs?: Attrs4
  content?: Content14[]
}

type Text27 = {
  type: string
  attrs: Attrs
  content: Content36[]
}

type Content36 = {
  type: string
  attrs: Attrs23
  content?: Content19[]
}

type Attrs23 = {
  id?: string | string
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
  level?: number
  fixedId?: string
}

type Text26 = {
  type: string
  attrs: Attrs
  content: Content35[]
}

type Content35 = {
  type: string
  attrs: Attrs14
  content?: Content14[]
}

type Text25 = {
  type: string
  attrs: Attrs
  content: Content34[]
}

type Content34 = {
  type: string
  attrs: Attrs22
}

type Attrs22 = {
  id: string
  url: string
  href: string
  size: number
  align: string
  altText: string
  caption: string
  hideLabel: boolean
  fullResolution: boolean
}

type Text24 = {
  type: string
  attrs: Attrs
  content: Content33[]
}

type Content33 = {
  type: string
  attrs: Attrs20
  content?: Content14[]
}

type Text23 = {
  type: string
  attrs: Attrs
  content: Content32[]
}

type Content32 = {
  type: string
  attrs?: Attrs17
  content?: Content7[]
}

type Text222 = {
  type: string
  attrs: Attrs
  content: Content31[]
}

type Content31 = {
  type: string
  attrs: Attrs14
  content?: Content[]
}

type Text21 = {
  type: string
  attrs: Attrs
  content: Content30[]
}

type Content30 = {
  type: string
  attrs?: Attrs21
  content?: Content14[]
}

type Attrs21 = {
  id?: string
  rtl?: any
  class?: any
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

type Text20 = {
  type: string
  attrs: Attrs
  content: Content29[]
}

type Content29 = {
  type: string
  attrs: Attrs20
  content?: Content28[]
}

type Content28 = {
  type: string
  attrs?: Attrs6
  content?: Content[]
  text?: string
  marks?: Mark3[]
}

type Attrs20 = {
  id: string
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  rtl?: any
  class?: string
  textAlign?: any
  fileName?: string
  fileSize?: string
}

type Text19 = {
  type: string
  attrs: Attrs
  content: Content27[]
}

type Content27 = {
  type: string
  attrs: Attrs6
  content: Content[]
}

type Text18 = {
  type: string
  attrs: Attrs
  content: Content26[]
}

type Content26 = {
  type: string
  attrs?: Attrs19
  content?: Content11[]
}

type Attrs19 = {
  id: string
  rtl?: any
  level?: number
  fixedId?: string
  textAlign?: any
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  class?: (null | string)[]
  fileName?: string
  fileSize?: string
}

type Text17 = {
  type: string
  attrs: Attrs
  content: Content25[]
}

type Content25 = {
  type: string
  attrs?: Attrs18
  content?: Content14[]
}

type Attrs18 = {
  id?: string
  rtl?: any
  class?: string
  textAlign?: any
  level?: number
  fixedId?: string
}

type Text16 = {
  type: string
  attrs: Attrs
  content: Content24[]
}

type Content24 = {
  type: string
  attrs?: Attrs17
  content?: Content19[]
}

type Attrs17 = {
  id: string
  rtl?: any
  level?: number
  fixedId?: string
  textAlign?: any
  class?: any
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
}

type Text15 = {
  type: string
  attrs: Attrs
  content: Content23[]
}

type Content23 = {
  type: string
  attrs?: Attrs16
  content?: Content19[]
}

type Attrs16 = {
  id: string
  rtl?: any
  level?: number
  fixedId?: string
  textAlign?: any
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  class?: any
  fileName?: string
  fileSize?: string
}

type Text14 = {
  type: string
  attrs: Attrs
  content: Content22[]
}

type Content22 = {
  type: string
  attrs: Attrs15
  content: Content[]
}

type Attrs15 = {
  id: string
  rtl?: any
  class?: string
  textAlign?: any
}

type Text12 = {
  type: string
  attrs: Attrs
  content: Content21[]
}

type Content21 = {
  type: string
  attrs?: Attrs14
  content?: Content7[]
}

type Attrs14 = {
  id: string
  rtl?: any
  class?: string
  textAlign?: any
  level?: number
  fixedId?: string
}

type Text11 = {
  type: string
  attrs: Attrs
  content: Content20[]
}

type Content20 = {
  type: string
  attrs: Attrs13
  content?: Content19[]
}

type Content19 = {
  text?: string
  type: string
  marks?: Mark3[]
}

type Attrs13 = {
  id?: string | string
  rtl?: any
  level?: number
  fixedId?: string
  textAlign?: any
  class?: string
  url?: string
  caption?: string
  fileName?: string
  fileSize?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  hideLabel?: boolean
  fullResolution?: boolean
}

type Text10 = {
  type: string
  attrs: Attrs
  content: Content18[]
}

type Content18 = {
  type: string
  attrs?: Attrs12
  content?: Content14[]
}

type Attrs12 = {
  id: string
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  rtl?: any
  class?: any
  textAlign?: any
  fileName?: string
  fileSize?: string
}

type Text9 = {
  type: string
  attrs: Attrs
  content: Content17[]
}

type Content17 = {
  type: string
  attrs?: Attrs7
  content?: Content7[]
}

type Text8 = {
  type: string
  attrs: Attrs
  content: Content16[]
}

type Content16 = {
  type: string
  attrs: Attrs11
  content?: Content5[]
}

type Attrs11 = {
  id?: string
  rtl?: any
  class?: any
  textAlign?: any
}

type Text7 = {
  type: string
  attrs: Attrs
  content: Content15[]
}

type Content15 = {
  type: string
  attrs?: Attrs10
  content?: Content14[]
}

type Content14 = {
  text: string
  type: string
  marks?: Mark3[]
}

type Mark3 = {
  type: string
  attrs?: Attrs8
}

type Attrs10 = {
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

type Text6 = {
  type: string
  attrs: Attrs
  content: Content13[]
}

type Content13 = {
  type: string
  attrs: Attrs9
  content?: Content11[]
}

type Attrs9 = {
  id: string
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  rtl?: any
  class?: any
  textAlign?: any
}

type Text5 = {
  type: string
  attrs: Attrs
  content: Content12[]
}

type Content12 = {
  type: string
  attrs: Attrs7
  content?: Content11[]
}

type Content11 = {
  text: string
  type: string
  marks?: Mark2[]
}

type Mark2 = {
  type: string
  attrs: Attrs8
}

type Attrs8 = {
  href: string
  title?: any
  target?: any
}

type Attrs7 = {
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

type Text4 = {
  type: string
  attrs: Attrs
  content: Content10[]
}

type Content10 = {
  type: string
  attrs: Attrs6
  content: Content9[]
}

type Content9 = {
  text: string
  type: string
  marks: Mark[]
}

type Attrs6 = {
  id: string
  rtl?: any
  class?: any
  textAlign?: any
}

type Text3 = {
  type: string
  attrs: Attrs
  content: Content8[]
}

type Content8 = {
  type: string
  attrs: Attrs5
  content: Content7[]
}

type Content7 = {
  text: string
  type: string
}

type Attrs5 = {
  id: string
  rtl?: any
  level: number
  fixedId: string
  textAlign?: any
}

type Text22 = {
  type: string
  attrs: Attrs
  content: Content6[]
}

type Content6 = {
  type: string
  attrs?: Attrs4
  content?: Content5[]
}

type Content5 = {
  text?: string
  type: string
  marks?: Mark[]
}

type Attrs4 = {
  id: string
  rtl?: any
  level?: number
  fixedId?: string
  textAlign?: any
  class?: any
}

type Text2 = {
  type: string
  attrs: Attrs
  content: Content4[]
}

type Content4 = {
  type: string
  attrs?: Attrs3
  content?: Content[]
}

type Attrs3 = {
  id?: string
  url?: string
  href?: any
  size?: number
  align?: string
  altText?: string
  caption?: string
  hideLabel?: boolean
  fullResolution?: boolean
  rtl?: any
  class?: string
  textAlign?: any
  fileName?: string
  fileSize?: string
}

type Metadata = {
  doi?: string
  url?: string
  isbn?: string
  copyrightYear?: string
  publicationDate?: string
  edition?: string
}

type Page = {
  id: string
  title: string
  slug: string
  description: string
  avatar?: string
  isPublic: boolean
  isNarrowWidth?: boolean
  viewHash: string
  layout: Layout[]
  createdAt: string
}

type Layout = {
  id: string
  type: string
  content: Content3
}

type Content3 = {
  text?: Text
  align?: string
  title?: string
  width?: string
  items?: Child[]
  justify?: string
  html?: string
}

type Text = {
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
  marks?: Mark[]
}

type Mark = {
  type: string
}

type Attrs2 = {
  id: string
  class?: string
  textAlign?: string
}

type Attrs = {
  meta: HeroPrimaryButton
}

type SpamTag = {
  id: string
  status: string
  statusUpdatedAt: string
  fields: HeroPrimaryButton
  spamScore: number
  spamScoreComputedAt: string
  spamScoreVersion: number
  createdAt: string
  updatedAt: string
}

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

type HeroPrimaryButton = {}

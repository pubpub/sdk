import type { DeepInput } from './client-types.js'

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
        fileOrPath: [Blob, string] | File
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

export type FacetsPayload = DeepInput<'facets.update'>

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
  DeepInput<'community.update'>,
  'navigation' | 'footerLinks'
> & {
  /**
   * Navigation links.
   *
   * These can either take an id, which will be used to update an existing link,
   * or omit an id, which will create a new link.
   *
   * Options:
   * - DropDownMenu
   * - PageOrCollectionLink
   * - ExternalLink
   */
  navigation?: (NavigationLink<'request'> | NavigationLink<'response'>)[]
  /**
   * Footer links. These can either take an id, which will be used to update an existing link,
   * or omit an id, which will create a new link.
   */
  footerLinks?: (FooterLink<'request'> | FooterLink<'response'>)[]
}

// export type CommunityPutPayload = Omit<
//   CommunityPutResponse,
//   'navigation' | 'footerLinks'
// > & {
//   navigation?: NavigationLink<'request'>[]
//   footerLinks?: FooterLink<'request'>[]
// }

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

export type WorkerTaskExportOutput = {
  url: string
}

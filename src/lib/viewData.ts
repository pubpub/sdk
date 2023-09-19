import { Collection } from './collectionData.js'
import {
  CollectionPubWithAttributions,
  Discussion,
  Pub,
  PubAttribution,
  Release,
  UserScopeVisit,
} from './types.js'

export interface PubViewDataDash {
  pubData: SanitizedPubData
}
export interface PubViewDataPub {
  pubData: PubDataViewData
}

export interface PubDataViewData extends Pub {
  initialDoc: {
    type: 'doc'
    attrs: Record<string, unknown>
    content: any[]
  }
  draft: {
    id: string
    latestKeyAt: string
    firebasePath: string
    createdAt: string
    updatedAt: string
  }
  initialDocKey: number
  historyData: {
    timestamps: { [key: string]: number }
    currentKey: number
    latestKey: number
  }
  firebaseToken: string
  isAVisitingCommenter: boolean
  isReviewingPub: boolean
}

export type SanitizedPubData = Pub & {
  viewHash: string | null
  editHash: string | null
  reviewHash: string | null
  commentHash: string | null
  attributions: PubAttribution[]
  discussions: Discussion[]
  collectionPubs: CollectionPubWithAttributions[]
  isRelease: boolean
  releases: Release[]
  releaseNumber: number | null
}

export interface CollectionViewData {
  overviewData: {
    collection: Collection
    pubs: Pub[]
    collectionPubs: CollectionPub[]
    hasEnabledSubmissionWorkflow: null
  }
}

export interface CollectionPub {
  id: string
  pubId: string
  collectionId: string
  contextHint: string | null
  rank: string
  pubRank: string
  createdAt: string
  updatedAt: string
}

export interface CommunityViewData {
  overviewData: {
    collections: Collection[]
    pubs: Pub[]
    includesAllPubs: boolean
    userScopeVisits: UserScopeVisit[]
    recentPubs: Pub[]
  }
}

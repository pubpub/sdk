import { Pub } from './types'

export interface PubViewData {
  pubData: PubDataViewData
}
export interface PubDataViewData extends Pub {
  initialDoc: {
    type: 'doc'
    attrs: Record<string, unknown>
    content: any[]
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

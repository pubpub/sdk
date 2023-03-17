import { Pub } from './types'

export interface PubViewData {
  pubData: PubDataViewData
}
export interface PubDataViewData extends Pub {
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

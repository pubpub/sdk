/* eslint-disable @typescript-eslint/no-explicit-any */
import SHA3 from 'crypto-js/sha3'
import encHex from 'crypto-js/enc-hex'
import { createClient } from 'utils/api/client.js'

import type { ExportFormats, WorkerTaskExportOutput } from './types.js'

import {
  proxyClient,
  proxySDKWithClient,
  getRequestsMap,
  filesRequestMap,
} from './proxies.js'
import type { PClient, DeepInput, DeepMerge } from './client-types.js'

/**
 * Small test to see if a string looks like a pub slug,
 * such that we have better type inference for the result
 */
const looksLikePubSlug = (pub: string): pub is `pub/${string}` =>
  /pub\/.*?$/.test(pub)

/**
 * @interface
 */
export type PubPubSDK = DeepMerge<PClient, PubPub>

export class PubPub {
  #cookie?: string
  loggedIn = false

  public client!: PClient

  /**
   * DO NOT CREATE THIS MANUALLY
   *
   * Use `PubPub.createSDK` instead
   */
  constructor(
    public communityId: string,
    public communityUrl: string,
  ) {}

  /**
   * Login to the PubPub API. Needs to be called before any other method.
   *
   * Automatically called when using `PubPub.createSDK`
   * */
  async login(email: string, password: string) {
    if (this.loggedIn) {
      throw new Error('Already logged in')
    }
    // don't use the client for this
    const response = await fetch(`${this.communityUrl}/api/login`, {
      method: 'POST',
      keepalive: false,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: SHA3(password).toString(encHex),
      }),
    })

    const cookie = response.headers
      .get('set-cookie')
      ?.replace(/.*(connect.sid=.*?);.*/ms, '$1')
    const data = response.body

    if (!cookie) {
      throw new Error(`Login failed
      ${data}`)
    }

    this.#cookie = cookie

    const authenticatedClient = proxyClient({
      client: createClient({
        baseUrl: this.communityUrl,
        baseHeaders: {
          Cookie: this.#cookie || '',
        },
      }),
      communityId: this.communityId,
      getRequestsMap,
      filesRequestsMap: filesRequestMap,
    })

    this.client = authenticatedClient
    proxySDKWithClient(this, authenticatedClient)

    this.loggedIn = true
  }

  async logout() {
    const response = await this.client.auth.logout()

    this.#cookie = undefined
    this.loggedIn = false
    console.log('Succesfully logged out!')

    return response
  }

  exportPub = async ({
    slug,
    pubId,
    format,
  }: (
    | { slug: string; pubId?: undefined }
    | { slug?: undefined; pubId: string }
  ) & {
    format: ExportFormats
    historyKey?: number
  }) => {
    if (!slug && pubId) {
      const { body: pub } = await this.client.pub.get({
        params: { slugOrId: pubId },
      })
      if (format === 'formatted' && pub.downloads?.[0]?.type === 'formatted') {
        return pub.downloads[0].url
      }
      slug = pub.slug
    }

    if (!slug) {
      throw new Error('No slug or id provided')
    }

    if (!looksLikePubSlug(slug)) {
      throw new Error('Invalid slug, should be of the form pub/slug')
    }

    const { url } = await this.#export({
      format: format === 'formatted' ? 'pdf' : format,
      pubId: pubId!,
    })

    return url
  }

  // TODO: Remove this if https://github.com/ts-rest/ts-rest/pull/413 is merged or fixed in some other way
  // #formUpload = async ({
  //   route,
  //   fieldName,
  //   files,
  //   rest,
  // }: {
  //   route: `/${string}`
  //   fieldName: 'file' | 'files'
  //   files: ([Blob, string] | File)[]
  //   rest?: Record<string, unknown>
  // }) => {
  //   const formData = new FormData()

  //   if (rest) {
  //     Object.entries(rest).forEach(([key, value]) => {
  //       formData.set(key, JSON.stringify(value))
  //     })
  //   }

  //   files.forEach((file) => {
  //     if (Array.isArray(file)) {
  //       const [blob, filename] = file
  //       formData.set(fieldName, blob, filename)
  //     } else {
  //       formData.set(fieldName, file)
  //     }
  //   })

  //   const response = await fetch(`${this.communityUrl}${route}`, {
  //     method: 'POST',
  //     body: formData,
  //     headers: {
  //       Cookie: this.#cookie || '',
  //       ContentType: 'multipart/form-data',
  //     },
  //   })

  //   const data = await response.json()

  //   return {
  //     status: response.status as any,
  //     body: data as any,
  //     headers: response.headers as any,
  //   }
  // }

  // upload = async ({
  //   file,
  // }: Exclude<DeepInput<'upload'>, FormData>): Promise<DeepOutput<'upload'>> =>
  //   this.client.upload({
  //     file,
  //   })
  // this.#formUpload({
  //   route: '/api/upload',
  //   fieldName: 'file',
  //   files: [file],
  // })

  // pub = {
  //   text: {
  //     import: async ({
  //       files,
  //       ...rest
  //     }: DeepInput<'pub.text.import'>): Promise<
  //       DeepOutput<'pub.text.import'>
  //     > =>
  //       this.#formUpload({
  //         route: `/api/pubs/text/import`,
  //         fieldName: 'files',
  //         files,
  //         rest,
  //       }),

  //     importToPub: async (
  //       {
  //         files,
  //         ...rest
  //       }: Omit<Parameters<DeepInput<'pub.text.importToPub'>>[0], 'files'> & {
  //         files: [Blob, string][] | File[]
  //       },
  //       { pubId }: Parameters<DeepInput<'pub.text.importToPub'>>[1]['params'],
  //     ): ReturnType<DeepInput<'pub.text.importToPub'>> =>
  //       this.#formUpload({
  //         route: `/api/pubs/${pubId}/text/import`,
  //         fieldName: 'files',
  //         files,
  //         rest,
  //       }),

  //     convert: async ({
  //       files,
  //     }: {
  //       files: [Blob, string][] | File[]
  //     }): Promise<DeepOutput<'pub.text.convert'>> =>
  //       this.#formUpload({
  //         route: `/api/pubs/text/convert`,
  //         fieldName: 'files',
  //         files,
  //       }),
  //   },
  // }

  /**
   * Basic export function, equivalent to the `/api/export` endpoint
   *
   */
  #export = async ({
    pubId,
    format,
    historyKey,
  }: DeepInput<'workerTask.createExport'>) => {
    const { body } = await this.client.workerTask.createExport({
      pubId,
      format,
      historyKey: historyKey! < 0 ? undefined : historyKey,
    })

    let workerTaskId: string | null = null

    if (typeof workerTaskId !== 'string') {
      /**
       * If its cached, pubpub just immediately returns the url
       */
      if ('url' in body) {
        // throw new Error('Worker task id is not a string')
        return body
      }

      if (!('taskId' in body)) {
        throw new Error('Worker task id is not a string')
      }

      workerTaskId = body.taskId as string
    }

    return (await this.#waitForWorkerTask(
      workerTaskId,
    )) as WorkerTaskExportOutput
  }

  /**
   * Pings workertask endpoint until every second until the task is complete
   */
  #waitForWorkerTask = async (workerTaskId: string) => {
    const poll = async (): Promise<unknown> => {
      console.log(`Polling for ${workerTaskId}`)
      const { body: task } = await this.client.workerTask.get({
        query: {
          workerTaskId,
        },
      })

      if ('error' in task && task.error) {
        console.error(task.error)
        throw new Error(task.error)
      }

      if ('output' in task && !task.isProcessing && task.output) {
        return task.output
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      return poll()
    }

    return poll()
  }

  static async createSDK({
    communityUrl,
    email,
    password,
  }: {
    /**
     * The URL of the community to connect to
     */
    communityUrl: string
    /**
     * The email to login with
     */
    email: string
    /**
     * The password to login with
     */
    password: string
  }) {
    const [{ id }] = await (
      await fetch(`${communityUrl}/api/communities`)
    ).json()

    const sdk = new PubPub(id, communityUrl)
    await sdk.login(email, password)
    return sdk as unknown as PubPubSDK
  }
}

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
    if (!pubId && slug) {
      const { body } = await this.client.pub.get({
        params: {
          slugOrId: slug,
        },
      })

      if (!body) {
        throw new Error(`Could not find pub with slug ${slug}`)
      }

      pubId = body.id
    }

    const { url } = await this.#export({
      format: format === 'formatted' ? 'pdf' : format,
      pubId: pubId!,
    })

    return url
  }

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

      console.dir(body, { depth: null })

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

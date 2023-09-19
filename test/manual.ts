import { PubPub } from '../src/lib/client.js'

const pubpub = await PubPub.createSDK({
  communityId: 'communityId',
  communityUrl: 'communityUrl',
  email: 'email',
  password: 'password',
})

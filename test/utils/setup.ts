import { PubPub } from '../../src/lib/client.js'

export async function setupSDK({
  url,
  email = '',
  password = '',
  authToken = '',
}: {
  url: string
  email?: string
  password?: string
  authToken?: string
}) {
  const pubpub = await PubPub.createSDK({
    communityUrl: url,
    ...(authToken ? { authToken } : { email, password }),
  })

  if (!authToken) {
    expect(pubpub.loggedIn).toBeTruthy()
  }

  const { body } = await pubpub.pub.create()

  return {
    pubpub,
    pub: body,
    draftPath: `pub/${body.slug}/draft`,
    id: body.id,
    slug: body.slug,
  }
}

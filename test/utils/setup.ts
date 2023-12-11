import { PubPub } from '../../src/lib/client.js'

export async function setupSDK({
  url,
  email = '',
  password = '',
}: {
  url: string
  email?: string
  password?: string
}) {
  const pubpub = await PubPub.createSDK({
    communityUrl: url,
    email,
    password,
  })

  expect(pubpub.loggedIn).toBeTruthy()

  const { body } = await pubpub.pub.create()

  return {
    pubpub,
    pub: body,
    draftPath: `pub/${body.slug}/draft`,
    id: body.id,
    slug: body.slug,
  }
}

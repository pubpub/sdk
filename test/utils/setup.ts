import { PubPub } from '../../src/lib/client'

export async function setupSDK({
  url,
  communityId,
  email = '',
  password = '',
}: {
  url: string
  communityId: string
  email?: string
  password?: string
}) {
  console.log({
    url,
    communityId,
    email,
    password,
  })

  const pubpub = new PubPub(communityId, url)

  await pubpub.login(email, password)

  expect(pubpub.loggedIn).toBeTruthy()

  const { body } = await pubpub.pub.create()
  console.log(body)

  return {
    pubpub,
    pub: body,
    draftPath: `pub/${body.slug}/draft`,
    id: body.id,
    slug: body.slug,
  }
}

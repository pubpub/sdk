### Starting

```ts
import { PubPub } from '@pubpub/sdk'

const communityUrl = 'https://demo.pubpub.org'
const email = '...'
const password = '...'

const pubpub = await PubPub.createSDK({
  communityUrl,
  email,
  password,
})
```

Ideally, after you are done, should should logout:

```ts
await pubpub.logout()
```

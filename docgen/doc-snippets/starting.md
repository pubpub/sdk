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

Replace `https://demo.pubpub.org` with your community url, and replace `…` with your login email address and password, respectively. 

Once your session is complete, you should logout:

```ts
await pubpub.logout()
```

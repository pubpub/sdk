# PubPub SDK

[![npm version](https://img.shields.io/npm/v/pubpub-client.svg)](https://www.npmjs.com/package/@pubpub/sdk)
[![npm downloads](https://img.shields.io/npm/dm/pubpub-client.svg)](https://www.npmjs.com/package/@pubpub/sdk)
![GitHub license](https://img.shields.io/github/license/pubpub/sdk)

Official Node.js Client for [PubPub](https://pubpub.org/).

## Contents

## Installation

If you use this in Node, you have to use Node 18 or higher in order to support native FormData.

```bash
pnpm add @pubpub/sdk
# yarn add @pubpub/sdk
# npm install @pubpub/sdk
```

## Usage

```ts
import { PubPub } from '@pubpub/sdk'

const communityUrl = 'https://demo.pubpub.org'

async function main() {
  const pubpub = await PubPub.createSDK({
    communityUrl,
    email: '...',
    password: '...',
  })

  const pubs = await pubpub.pub.getMany()

  console.log(pubs)
}

main()
```

## Limitations

The following is not possible to do with the Client or through the API in general:

### Creating or deleting communities

While technically possible through the API, this is not possible through the Client.
We think this would cause too much risk of accidentally deleting a community or creating too many superfluous communities.

### Creating, deleting, or modifying users

Too risky.

### Stuff

## API

## Contributing

If you find a bug or have a feature request, please open an issue.

### Development

```bash
git clone
pnpm install
pnpm run build
```

### Testing

```bash
pnpm run test
```

### Publishing

```bash
pnpm run build
pnpm run publish
```

### Generating docs

```bash
pnpm generate-docs
```

## TODO

- [ ] Add CRUD methods for discussions

## FAQ

### How do I get the ID of my community/page/collection?

You can use the [PubPub ID Finder](https://pubpub.tefkah.com/) to find the ID of a community, page, or collection.

### Can I run this in the browser?

While the SDK was designed to also be run in the browser, we are not yet sending CORS headers correctly, so this may not work.

## License

GPL-3.0+, PubPub

# PubPub SDK

[![npm version](https://img.shields.io/npm/v/@pubpub/sdk.svg)](https://www.npmjs.com/package/@pubpub/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@pubpub/sdk.svg)](https://www.npmjs.com/package/@pubpub/sdk)
![GitHub license](https://img.shields.io/github/license/pubpub/sdk)

Official Node.js SDK for [PubPub](https://pubpub.org/).

## Contents

## Installation

If you use the SDK in Node, you must use Node 18 or higher in order to support native FormData.

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

Replace `https://demo.pubpub.org` with your community URL, and replace `…` with your PubPUb login email address and password, respectively. 

## Limitations

The following actions are not permitted by the SDK, nor through the API in general:


### Creating or deleting communities

Deleting a community is not permitted, due to the risk of accidental deletion of a community. Creating a community is not permitted, due to the potential for abuse (e.g., spam communities).


### Creating, deleting, or modifying users

It is not possible to create, delete or modifying users, due to the risks involved. 

## Guides

### Starting

### Querying

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

- [ ] Add CORS
- [ ] Add CRUD methods for discussions
- [ ] Reorder some methods (make attributions a submethod of pub, for example)

## FAQ

### How do I get the ID of my community/page/collection?

You can use the [PubPub ID Finder](https://pubpub.tefkah.com/) to find the ID of a community, page, or collection.

### Can I run this in the browser?

While the SDK was designed to also be run in the browser, we are not yet sending CORS headers correctly, so this may not work.

## License

GPL-3.0+, PubPub

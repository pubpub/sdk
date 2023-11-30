# PubPub Client

[![npm version](https://img.shields.io/npm/v/pubpub-client.svg)](https://www.npmjs.com/package/pubpub-client)
[![npm downloads](https://img.shields.io/npm/dm/pubpub-client.svg)](https://www.npmjs.com/package/pubpub-client)
![GitHub license](https://img.shields.io/github/license/tefkah/pubpub-client)

Official Node.js Client for [PubPub](https://pubpub.org/).

## Installation

If you use this in Node, you have to use Node 18 or higher in order to support native FormData.
You can use the Client with lower versions, but you won't be able to use the `uploadFile` method.

```bash
pnpm add pubpub-client
# yarn add pubpub-client
# npm install pubpub-client
```

## Limitations

The following is not possible to do with the Client or through the API in general:

### Creating or deleting communities

While technically possible through the API, this is not possible through the Client.
I think this would cause too much risk of accidentally deleting a community or creating too many superfluous communities.

### Creating, deleting, or modifying users

The API does not support this.

## Usage

```js
import { PubPub } from 'pubpub-client'

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

The only difference between the usage the Client in Node and in the browser is during the use of the `uploadFile` method.
In the browser, you must pass a `File` or `Blob` object as the first argument.
In Node, you can also pass a `Buffer` object as the first argument.

See the documentation below for more detail.

## API

TODO: setup typedoc

## Contributing

Contributions are very welcome!

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

## FAQ

### How do I get the ID of my community/page/collection?

You can use the [PubPub ID Finder](https://pubpub.tefkah.com/) to find the ID of a community, page, or collection.

### Can I run this in the browser?

While the SDK was designed to also be run in the browser, I realized that PubPub does not send CORS headers. This means that you can't use the SDK in the browser, sadly.

## License

GPL-3.0+, Thomas F. K. Jorna

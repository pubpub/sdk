# PubPub Client

[![npm version](https://img.shields.io/npm/v/pubpub-client.svg)](https://www.npmjs.com/package/pubpub-client)
[![npm downloads](https://img.shields.io/npm/dm/pubpub-client.svg)](https://www.npmjs.com/package/pubpub-client)
![GitHub license](https://img.shields.io/github/license/tefkah/pubpub-client)

Unofficial Node Client for [PubPub](https://pubpub.org/).

> **Warning**
> This is not an official Client and is not supported by the PubPub team.
> Anything here may break at any time.
> Please use responsibly, don't spam the API, and don't blame me if you get banned.

## Installation

If you use this in Node, you have to use Node 18 or higher in order to support native FormData.
You can use the Client with lower versions, but you won't be able to use the `uploadFile` method.

```bash
pnpm add pubpub-client
# yarn add pubpub-client
# npm install pubpub-client
```

## Why does this exist?

PubPub is a great platform for publishing academic work.
However, the API is quite hidden and undocumented.

This Client is an attempt to make it easier to interact with the API.

## Limitations

Because there is no official API, this Client is built by reverse engineering the API calls made by the PubPub website.

This means that the Client is not guaranteed to work with future versions of PubPub.

Furthermore, the following is not possible to do with the Client or through the API in general:

### Creating or deleting communities

While technically possible through the API, this is not possible through the Client.
I think this would cause too much risk of accidentally deleting a community or creating too many superfluous communities.

### Creating, deleting, or modifying users

The API does not support this.

### Getting information about collections, pages, or communities

Currently, the API does not (AFAIK) support a way to simply get a list of current collections or pagees.
The Client does support doing this through the `hacks` methods.

Basically what these do is request the actual page instead of calling the API and parse the JSON data that is passed there.

This should be considered very unstable.

## Usage

```js
import { PubPub } from 'pubpub-client'

const communityUrl = 'https://demo.pubpub.org'
const communityId = '...'
const pubpub = new PubPub(communityId, communityUrl)

async function main() {
  await PubPub.login('username', 'password')

  const pubs = await pubpub.pub.getMany()
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

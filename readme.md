# PubPub SDK

[![npm version](https://img.shields.io/npm/v/pubpub-sdk.svg)](https://www.npmjs.com/package/pubpub-sdk)
[![npm downloads](https://img.shields.io/npm/dm/pubpub-sdk.svg)](https://www.npmjs.com/package/pubpub-sdk)
[![GitHub license](https://img.shields.io/github/license/tfkj/pubpub-sdk)]

Unofficial Node/Browser SDK for [PubPub](https://pubpub.org/).

> **Warning**
> This is not an official SDK and is not supported by the PubPub team.
> Anything here may break at any time.
> Please use responsibly, don't spam the API, and don't blame me if you get banned.

## Installation

If you use this in Node, you have to use Node 18 or higher in order to support native FormData.
You can use the SDK with lower versions, but you won't be able to use the `uploadFile` method.

```bash
pnpm add pubpub-sdk
# yarn add pubpub-sdk
# npm install pubpub-sdk
```

## Why does this exist?

PubPub is a great platform for publishing academic work.
However, the API is quite hidden and undocumented.

This SDK is an attempt to make it easier to interact with the API.

## Limitations

Because there is no official API, this SDK is built by reverse engineering the API calls made by the PubPub website.

This means that the SDK is not guaranteed to work with future versions of PubPub.

Furthermore, the following is not possible to do with the SDK or through the API in general:

### Creating or deleting communities

While technically possible through the API, this is not possible through the SDK.
I think this would cause too much risk of accidentally deleting a community or creating too many superfluous communities.

### Creating, deleting, or modifying users

The API does not support this.

### Changing the text content of a Pub

Sadly it isn't possible to change the text content of a Pub through the API.
The text is set through Firebase, and we lack the necessary credentials to access it.
Even then it would be kind of a pain in the ass.

I am considering adding a headless Puppeteer/Playwright solution to allow this, but that will be even more hacky

### Getting information about collections, pages, or communities

Currently, the API does not (AFAIK) support a way to simply get a list of current collections or pagees.
The SDK does support doing this through the `hacks` methods.

Basically what these do is request the actual page instead of calling the API and parse the JSON data that is passed there.

This should be considered very unstable.

## Usage

```js
import { PubPub } from 'pubpub-sdk'

const communityUrl = 'https://demo.pubpub.org'
const communityId = '...'
const pubpub = new PubPub(communityId, communityUrl)

async function main() {
  await PubPub.login('username', 'password')

  const pubs = await pubpub.pub.getMany()
}
```

The only difference between the usage the SDK in Node and in the browser is during the use of the `uploadFile` method.
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

## License

GPL-3.0+, Thomas F. K. Jorna

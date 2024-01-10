
<!--
THIS FILE IS GENERATED. DO NOT EDIT IT DIRECTLY. EDIT THE TEMPLATE IN `docgen/snippets/readme.md` INSTEAD.
 -->

# PubPub SDK

[![npm version](https://img.shields.io/npm/v/@pubpub/sdk.svg)](https://www.npmjs.com/package/@pubpub/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@pubpub/sdk.svg)](https://www.npmjs.com/package/@pubpub/sdk)
![GitHub license](https://img.shields.io/github/license/pubpub/sdk)

Official Node.js SDK for [PubPub](https://pubpub.org/).

## Contents

* [Installation](#installation)
* [Usage](#usage)
* [Limitations](#limitations)
  * [Creating or deleting communities](#creating-or-deleting-communities)
  * [Creating, deleting, or modifying users](#creating-deleting-or-modifying-users)
* [Guides](#guides)
  * [Starting](#starting)
  * [Querying](#querying)
    * [`get`/`GET /api/<models>/<id>`](#getget-apimodelsid)
    * [`getMany`/`GET /api/<models>`](#getmanyget-apimodels)
* [API](#api)
  * [`pubpub.auth`](#pubpubauth)
    * [`pubpub.auth.login`](#pubpubauthlogin)
    * [`pubpub.auth.logout`](#pubpubauthlogout)
  * [`pubpub.collection`](#pubpubcollection)
    * [`pubpub.collection.create`](#pubpubcollectioncreate)
    * [`pubpub.collection.doi`](#pubpubcollectiondoi)
    * [`pubpub.collection.get`](#pubpubcollectionget)
    * [`pubpub.collection.getMany`](#pubpubcollectiongetmany)
    * [`pubpub.collection.getResource`](#pubpubcollectiongetresource)
    * [`pubpub.collection.remove`](#pubpubcollectionremove)
    * [`pubpub.collection.update`](#pubpubcollectionupdate)
  * [`pubpub.collectionAttribution`](#pubpubcollectionattribution)
    * [`pubpub.collectionAttribution.batchCreate`](#pubpubcollectionattributionbatchcreate)
    * [`pubpub.collectionAttribution.create`](#pubpubcollectionattributioncreate)
    * [`pubpub.collectionAttribution.get`](#pubpubcollectionattributionget)
    * [`pubpub.collectionAttribution.getMany`](#pubpubcollectionattributiongetmany)
    * [`pubpub.collectionAttribution.remove`](#pubpubcollectionattributionremove)
    * [`pubpub.collectionAttribution.update`](#pubpubcollectionattributionupdate)
  * [`pubpub.collectionPub`](#pubpubcollectionpub)
    * [`pubpub.collectionPub.create`](#pubpubcollectionpubcreate)
    * [`pubpub.collectionPub.get`](#pubpubcollectionpubget)
    * [`pubpub.collectionPub.remove`](#pubpubcollectionpubremove)
    * [`pubpub.collectionPub.update`](#pubpubcollectionpubupdate)
  * [`pubpub.community`](#pubpubcommunity)
    * [`pubpub.community.create`](#pubpubcommunitycreate)
    * [`pubpub.community.get`](#pubpubcommunityget)
    * [`pubpub.community.getCommunities`](#pubpubcommunitygetcommunities)
    * [`pubpub.community.update`](#pubpubcommunityupdate)
  * [`pubpub.customScript`](#pubpubcustomscript)
    * [`pubpub.customScript.set`](#pubpubcustomscriptset)
  * [`pubpub.facets`](#pubpubfacets)
    * [`pubpub.facets.update`](#pubpubfacetsupdate)
  * [`pubpub.member`](#pubpubmember)
    * [`pubpub.member.create`](#pubpubmembercreate)
    * [`pubpub.member.get`](#pubpubmemberget)
    * [`pubpub.member.getMany`](#pubpubmembergetmany)
    * [`pubpub.member.remove`](#pubpubmemberremove)
    * [`pubpub.member.update`](#pubpubmemberupdate)
  * [`pubpub.page`](#pubpubpage)
    * [`pubpub.page.create`](#pubpubpagecreate)
    * [`pubpub.page.get`](#pubpubpageget)
    * [`pubpub.page.getMany`](#pubpubpagegetmany)
    * [`pubpub.page.remove`](#pubpubpageremove)
    * [`pubpub.page.update`](#pubpubpageupdate)
    * [`pubpub.pub.doi`](#pubpubpubdoi)
    * [`pubpub.pub.get`](#pubpubpubget)
    * [`pubpub.pub.getMany`](#pubpubpubgetmany)
    * [`pubpub.pub.getResource`](#pubpubpubgetresource)
    * [`pubpub.pub.queryMany`](#pubpubpubquerymany)
    * [`pubpub.pub.remove`](#pubpubpubremove)
    * [`pubpub.pub.text`](#pubpubpubtext)
    * [`pubpub.pub.update`](#pubpubpubupdate)
  * [`pubpub.pubAttribution`](#pubpubpubattribution)
    * [`pubpub.pubAttribution.batchCreate`](#pubpubpubattributionbatchcreate)
    * [`pubpub.pubAttribution.create`](#pubpubpubattributioncreate)
    * [`pubpub.pubAttribution.get`](#pubpubpubattributionget)
    * [`pubpub.pubAttribution.getMany`](#pubpubpubattributiongetmany)
    * [`pubpub.pubAttribution.remove`](#pubpubpubattributionremove)
    * [`pubpub.pubAttribution.update`](#pubpubpubattributionupdate)
  * [`pubpub.pubEdge`](#pubpubpubedge)
    * [`pubpub.pubEdge.create`](#pubpubpubedgecreate)
    * [`pubpub.pubEdge.get`](#pubpubpubedgeget)
    * [`pubpub.pubEdge.remove`](#pubpubpubedgeremove)
    * [`pubpub.pubEdge.update`](#pubpubpubedgeupdate)
    * [`pubpub.pubEdge.updateApprovedByTarget`](#pubpubpubedgeupdateapprovedbytarget)
  * [`pubpub.release`](#pubpubrelease)
    * [`pubpub.release.create`](#pubpubreleasecreate)
  * [`pubpub.upload`](#pubpubupload)
    * [`pubpub.upload.file`](#pubpubuploadfile)
    * [`pubpub.upload.policy`](#pubpubuploadpolicy)
  * [`pubpub.workerTask`](#pubpubworkertask)
    * [`pubpub.workerTask.createExport`](#pubpubworkertaskcreateexport)
    * [`pubpub.workerTask.createImport`](#pubpubworkertaskcreateimport)
    * [`pubpub.workerTask.get`](#pubpubworkertaskget)
  * [Other types](#other-types)
    * [Attribution](#attribution)
    * [CollectionPub](#collectionpub)
    * [Discussion](#discussion)
    * [Release](#release)
    * [Pub](#pub)
    * [Member](#member)
    * [Page](#page)
    * [Community](#community)
    * [Collection](#collection)
    * [User](#user)
    * [Review](#review)
    * [Submission](#submission)
    * [Draft](#draft)
* [Contributing](#contributing)
  * [Development](#development)
  * [Testing](#testing)
  * [Publishing](#publishing)
  * [Generating docs](#generating-docs)
* [TODO](#todo)
* [FAQ](#faq)
  * [How do I get the ID of my community/page/collection?](#how-do-i-get-the-id-of-my-communitypagecollection)
  * [Can I run this in the browser?](#can-i-run-this-in-the-browser)
* [License](#license)

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

### Querying

Some models allow you to query them through the `GET /api/<models>` and `GET /api/<models>/<id>` endpoints on the API, and the `PubPub.<model>.getMany` and `PubPub.<model>.get` methods on the client.

These follow a standard pattern, and are documented here.

#### `get`/`GET /api/<models>/<id>`

The `get` methods allow you to get a single model by its `id`, OR by its `slug` (if it has one).

To get a single model by its `id`:

```ts
const pubById = await pubpub.pub.get({
  slugOrId: '00000000-0000-0000-0000-000000000000',
})
```

Replace `00000000-0000-0000-0000-000000000000` with the model’s `id`.

The `slug` of a Pub is the part of the URL after `/pub`. To get a single model by its `slug`:

```ts
// for https://demo.pubpub.org/pub/my-pub
const { body: myPub } = await pubpub.pub.get({
  slugOrId: 'my-pub',
})
```

Replace `my-pub` with your Pub’s slug.

#### `getMany`/`GET /api/<models>`

The `getMany` methods allow you to search for models. It returns an array of models.

You can filter models in the following ways

##### Pagination

By providing a `limit` and `offset` parameter, you can paginate the results.

###### Defaults

* `limit`: `10`
* `offset`: `0`

###### Example

```ts
const { body: firstTenCommunities } = await pubpub.community.getMany({
  limit: 10,
  offset: 0,
}) // this is the default

const { body: nextTenCommunities } = await pubpub.community.getMany({
  limit: 10,
  offset: 10,
})
```

##### Sorting

By providing `orderBy` and `sortBy` parameters, you can sort the results.

###### Options

The `orderBy` parameter can always be `updatedAt` or `createdAt`, and the `sortBy` parameter can always be `ASC` or `DESC`.

The `orderBy` parameters can also be some fiels of the model, depending on the model. Check the documentation of the specific method in the API section for more information.

###### Defaults

* `orderBy`: `createdAt`
* `sortBy`: `DESC`

###### Example

```ts
const { body: communitiesSortedByCreatedAt } = await pubpub.community.getMany({
  orderBy: 'createdAt',
  sortBy: 'DESC',
}) // this is the default

const { body: communitiesSortedByTitle } = await pubpub.community.getMany({
  query: {
    orderBy: 'title',
    sortBy: 'ASC',
  },
})
```

##### Includes

You can choose which associated models to include in the response by providing an `includes` parameter to your query.

By default, some models are always included. Currently this is not well documented here, check the documentation of the relevant API route to find this information.

> \[!NOTE]
> Specifying `includes` will override the default includes.

> \[!NOTE]
> The return type will not change based on the `includes` parameter. This means that even though you might have specified `includes: ['pubAttributions']`, the return type will have `pubAttribubtions?: PubAttribution[]` instead of `pubAttributions: PubAttribution[]`.

##### Attributes

Maybe you don't need all the attributes of a model, and you want to save some bandwidth. You can do this by providing an `attributes` parameter to your query. This parameter is an array of attributes you want to include in the response.

> \[!NOTE]
> Specifying `attributes` will not change the return type.
> This means that even though you might have specified `attributes: ['title']`, the return type will still have `description?: string` instead of `description: string`.

###### Default

By default, all attributes are included.

###### Example

```ts
const { body: communitiesWithOnlyTitleAndCreatedAt } =
  await pubpub.community.getMany({
    query: {
      attributes: ['title', 'createdAt'],
    },
  })

console.log(communitiesWithOnlyTitleAndCreatedAt[0].title) // this works
console.log(communitiesWithOnlyTitleAndCreatedAt[0].description) // undefined
```

##### Filter

The most powerful way to query models is by providing a `filter` parameter to your query. This parameter is an object that allows you to filter the results based on the attributes of the model.

You can also provide filters as query parameters. E.g. instead of doing

```ts
const { body: pubs } = await pubpub.pub.getMany({
  query: {
    filter: {
      title: 'My pub',
    },
  },
})
```

Almost any attribute of a model can be used to filter the results. Check the documentation of the relevant API route to find this information.

The filters follow a standard patter.

###### Equality

By just defining the attribute you want to filter on, you can filter on equality.

```ts
{
    filter: {
        title: 'My community',
    }
}
```

will return all communities with the exact title (case-sensitive) `'My community'`.

###### OR

You can provide an array of filters to filter on multiple values.

```ts
{
    filter: {
        title: ['My community', 'My other community'],
    }
}
```

will return all communities with the exact title (case-sensitive) `'My community'` or `'My other community'`.

###### AND

You can provide an object of filters to filter on multiple attributes.

```ts
{
    filter: {
        title: 'My community',
        description: 'This is my community',
    }
}
```

You can also do `AND` filters for the same property, by nesting arrays.

```ts
{
  filter: {
    title: [
      [
        {
          contains: 'My',
        },
        {
          contains: 'community',
        },
      ],
    ]
  }
}
```

This will return all communities with a title that contains both `'My'` and `'community'`. The `contains` filter for string values is documented below.

At the moment, you cannot easily do OR filters for multiple properties, please make multiple requests instead. If you find yourself needing this, please open an issue!

###### Existence

You can filter on whether an attribute exists or not by providing `true` or `false` as the value.

```ts
const attributionsWithUser = await pubpub.pubAttribution.getMany({
  query: {
    userId: true,
  },
})
```

###### String properties

If the property you are filtering on is a string, you can use the following filters.

`string`

If you provide a string, or `{ exact: string }`, it will filter on equality.

```ts
const pubsCalledMyPub = await pubpub.pub.getMany({
  query: {
    title: 'My pub',
  },
})
```

`boolean`

If you provide a boolean, it will filter on existence.

```ts
const { body: pubsWithoutDownloads } = await pubpub.pub.getMany({
  query: {
    downloads: false,
  },
})
```

`{ contains: string }`

If you provide an object with a `contains` property, it will filter on whether the string contains the provided string.

This is case-insensitive.

```ts
const { body: pubsContainingPub } = await pubpub.pub.getMany({
  query: {
    title: {
      contains: 'pub',
    },
  },
})
```

`{ contains: string; not: true }`

If you provide an object with a `contains` property and a `not` property set to `true`, it will filter on whether the string does not contain the provided string.

```ts
const { body: pubsNotContainingPub } = await pubpub.pub.getMany({
  query: {
    title: {
      contains: 'pub',
      not: true,
    },
  },
})
```

There isn't a way to do `{ exact: string, not: true}`, as this is almost always equivalent to `{ contains: string, not: true }`.

If you find yourself needing this, please open an issue!

**Full type**

This is the full type of the `filter` parameter for string properties.

```ts
type StringFilter =
  | string
  | boolean
  | string[]
  | { exact: string }
  | { contains: string; not?: true | undefined }
  | (
      | string
      | { exact: string }
      | { contains: string; not?: true | undefined }
    )[]
  | (
      | string
      | boolean
      | { exact: string }
      | { contains: string; not?: true | undefined }
      | (
          | string
          | { exact: string }
          | { contains: string; not?: true | undefined }
        )[]
    )[]
  | undefined
```

###### Enum filters

For attributes that are enums, you can filter on the enum values. You cannot do `contains` queries.

```ts
const issues = await pubpub.collection.getMany({
  query: {
    kind: 'issue',
  },
})
```

You can of course also do `OR` filters.

```ts
const { body: issuesAndBooks } = await pubpub.collection.getMany({
  query: {
    kind: ['issue', 'book'],
  },
})
```

While you can technically do `AND` filters, this is not very useful, as the attribute can only have one value.

###### `id` filters

If the property is `id` or ends with `Id` (e.g. `communityId`), you can only provide a full `UUID`, an array of full `UUID`s, or a boolean.

```ts
const { body: pub } = await pubpub.pub.get({
  id: '00000000-0000-0000-0000-000000000000',
})
```

###### `number` or `Date` filters

If the property is a `number` or a `Date`, you can use the following filters.

\####### `number` | `Date`

If you provide a number, it will filter on equality.

```ts
const pubsCreatedAtAnExactDate = await pubpub.pub.getMany({
  query: {
    createdAt: new Date('2021-01-01'),
  },
})
```

`{ gt: number | Date, lt: number | Date, eq: number | Date, gte: number | Date, lte: number | Date, ne: number | Date }`

If you provide an object with any of the above properties, it will filter on the corresponding comparison.

```ts
const { body: pubsCreatedAfter2020 } = await pubpub.pub.getMany({
  query: {
    createdAt: {
      gt: new Date('2020-01-01'),
    },
  },
})
```

You can combine these as with other filters.

```ts
const { body: pubsCreatedBetween2020And2021 } = await pubpub.pub.getMany({
  query: {
    createdAt: {
      gt: new Date('2020-01-01'),
      lt: new Date('2021-01-01'),
    },
  },
})
```

```ts
const { body: pubsCreatedBefore2020OrAfter2021 } = await pubpub.pub.getMany({
  query: {
    createdAt: [
      {
        lt: new Date('2020-01-01'),
      },
      {
        gt: new Date('2021-01-01'),
      },
    ],
  },
})
```

**Full types**

```ts
type NumberFilter =
  | boolean
  | number
  | {
      eq?: number | undefined
      gt?: number | undefined
      gte?: number | undefined
      lt?: number | undefined
      lte?: number | undefined
      ne?: number | undefined
    }
  | (
      | number
      | {
          eq?: number | undefined
          gt?: number | undefined
          gte?: number | undefined
          lt?: number | undefined
          lte?: number | undefined
          ne?: number | undefined
        }
    )[]
  | (
      | boolean
      | number
      | {
          eq?: number | undefined
          gt?: number | undefined
          gte?: number | undefined
          lt?: number | undefined
          lte?: number | undefined
          ne?: number | undefined
        }
      | (
          | number
          | {
              eq?: number | undefined
              gt?: number | undefined
              gte?: number | undefined
              lt?: number | undefined
              lte?: number | undefined
              ne?: number | undefined
            }
        )[]
    )[]
  | undefined
```

For Dates, you can either input a `Date` object, or an ISO formatted string.
It does not really matter, as it implicitly `Date.toISOString()` gets called on the value.

```ts
type Date =
  | boolean
  | string
  | Date
  | {
      eq?: Date | string | undefined
      gt?: Date | string | undefined
      gte?: Date | string | undefined
      lt?: Date | string | undefined
      lte?: Date | string | undefined
      ne?: Date | string | undefined
    }
  | (
      | string
      | Date
      | {
          eq?: Date | string | undefined
          gt?: Date | string | undefined
          gte?: Date | string | undefined
          lt?: Date | string | undefined
          lte?: Date | string | undefined
          ne?: Date | string | undefined
        }
    )[]
  | (
      | boolean
      | string
      | Date
      | {
          eq?: Date | string | undefined
          gt?: Date | string | undefined
          gte?: Date | string | undefined
          lt?: Date | string | undefined
          lte?: Date | string | undefined
          ne?: Date | string | undefined
        }
      | (
          | string
          | Date
          | {
              eq?: Date | string | undefined
              gt?: Date | string | undefined
              gte?: Date | string | undefined
              lt?: Date | string | undefined
              lte?: Date | string | undefined
              ne?: Date | string | undefined
            }
        )[]
    )[]
  | undefined
```

## API

### `pubpub.auth`

Methods for dealing with authentication

#### `pubpub.auth.login`

`POST /api/login`

Login and returns authentication cookie

```ts
login: (input, rest?) =>
  Promise<
    | { status: 201; body: 'success'; headers: Headers }
    | { status: 500; body: string; headers: Headers }
    | { status: 401; body: 'Login attempt failed'; headers: Headers }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-login/post>

##### Parameters

`input`

```ts
{
  email: string
  password: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<
  | {
      status: 201
      body: 'success'
      headers: Headers
    }
  | {
      status: 500
      body: string
      headers: Headers
    }
  | {
      status: 401
      body: 'Login attempt failed'
      headers: Headers
    }
>
```

#### `pubpub.auth.logout`

`GET /api/logout`

Logout and clear authentication cookie

```ts
logout: (input?) => Promise<{ status: 200; body: 'success'; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-logout/get>

##### Parameters

`input?`

```ts
{
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: 'success'
  headers: Headers
}>
```

### `pubpub.collection`

#### `pubpub.collection.create`

`POST /api/collections`

Create a collection

```ts
create: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      communityId: string
      title: string
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      isRestricted: boolean | null
      isPublic: boolean | null
      metadata: Record<string, any> | null
      kind: 'tag' | 'issue' | 'book' | 'conference' | null
      doi: string | null
      readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
      layout: Layout
      layoutAllowsDuplicatePubs: boolean
      pageId: string | null
      crossrefDepositRecordId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections/post>

##### Parameters

`input`

```ts
{
  doi: undefined | null | string
  isPublic: undefined | null | boolean
  isRestricted: undefined | null | boolean
  kind: 'tag' | 'issue' | 'book' | 'conference'
  pageId: undefined | null | string
  slug: undefined | string
  title: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    communityId: string
    title: string
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    isRestricted: boolean | null
    isPublic: boolean | null
    metadata: Record<string, any> | null
    kind: 'tag' | 'issue' | 'book' | 'conference' | null
    doi: string | null
    readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    pageId: string | null
    crossrefDepositRecordId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.collection.doi`

##### `pubpub.collection.doi.deposit`

`POST /api/collections/:collectionId/doi`

Deposit metadata to create a DOI

```ts
deposit: (input) =>
  Promise<
    | {
        status: 200
        body: {
          type: 'element'
          name: string
          attributes?: Record<string, string> | undefined
          children?: any[] | undefined
        }
        headers: Headers
      }
    | { status: 400; body: { error: string }; headers: Headers }
  >
```

###### Access

You need to be **logged in** and have access to this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections-collectionId-doi/post>

###### Parameters

`input`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    collectionId: string
  }
}
```

###### Returns

```ts
Promise<
  | {
      status: 200
      body: {
        type: 'element'
        name: string
        attributes?: Record<string, string> | undefined
        children?: any[] | undefined
      }
      headers: Headers
    }
  | {
      status: 400
      body: {
        error: string
      }
      headers: Headers
    }
>
```

##### `pubpub.collection.doi.preview`

`POST /api/collections/:collectionId/doi/preview`

Preview a DOI deposit

```ts
preview: (input) =>
  Promise<
    | {
        status: 200
        body: {
          type: 'element'
          name: string
          attributes?: Record<string, string> | undefined
          children?: any[] | undefined
        }
        headers: Headers
      }
    | { status: 400; body: { error: string }; headers: Headers }
  >
```

###### Access

You need to be **logged in** and have access to this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections-collectionId-doi-preview/post>

###### Parameters

`input`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    collectionId: string
  }
}
```

###### Returns

```ts
Promise<
  | {
      status: 200
      body: {
        type: 'element'
        name: string
        attributes?: Record<string, string> | undefined
        children?: any[] | undefined
      }
      headers: Headers
    }
  | {
      status: 400
      body: {
        error: string
      }
      headers: Headers
    }
>
```

#### `pubpub.collection.get`

`GET /api/collections/:slugOrId`

Get a collection by it's id or slug

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      isRestricted: boolean | null
      isPublic: boolean | null
      metadata: Record<string, any> | null
      kind: 'tag' | 'issue' | 'book' | 'conference' | null
      doi: string | null
      readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
      layout: Layout
      layoutAllowsDuplicatePubs: boolean
      pageId: string | null
      crossrefDepositRecordId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
      attributions?: Attribution[]
      collectionPubs?: CollectionPub[]
      members?: Member[]
      page?: Page
      community?: Community
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections-slugOrId/get>

##### Parameters

`input`

```ts
{
  params: { slugOrId: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
  query?:
    | {
        include?:
          | (
              | 'community'
              | 'attributions'
              | 'collectionPubs'
              | 'members'
              | 'page'
            )[]
          | undefined
        attributes?:
          | (
              | 'id'
              | 'communityId'
              | 'title'
              | 'avatar'
              | 'viewHash'
              | 'editHash'
              | 'scopeSummaryId'
              | 'slug'
              | 'isRestricted'
              | 'isPublic'
              | 'metadata'
              | 'kind'
              | 'doi'
              | 'readNextPreviewSize'
              | 'layout'
              | 'layoutAllowsDuplicatePubs'
              | 'pageId'
              | 'crossrefDepositRecordId'
            )[]
          | undefined
      }
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    isRestricted: boolean | null
    isPublic: boolean | null
    metadata: Record<string, any> | null
    kind: 'tag' | 'issue' | 'book' | 'conference' | null
    doi: string | null
    readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    pageId: string | null
    crossrefDepositRecordId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
    attributions?: Attribution[]
    collectionPubs?: CollectionPub[]
    members?: Member[]
    page?: Page
    community?: Community
  }
  headers: Headers
}>
```

#### `pubpub.collection.getMany`

`GET /api/collections`

Get many collections

```ts
getMany: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      isRestricted: boolean | null
      isPublic: boolean | null
      metadata: Record<string, any> | null
      kind: 'tag' | 'issue' | 'book' | 'conference' | null
      doi: string | null
      readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
      layout: Layout
      layoutAllowsDuplicatePubs: boolean
      pageId: string | null
      crossrefDepositRecordId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
      attributions?: Attribution[]
      collectionPubs?: CollectionPub[]
      members?: Member[]
      page?: Page
      community?: Community
    }[]
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections/get>

##### Parameters

`input?`

```ts
{
  query:
    | ({
        limit?: number | undefined
        offset?: number | undefined
        sortBy?:
          | 'createdAt'
          | 'updatedAt'
          | 'title'
          | 'slug'
          | 'kind'
          | undefined
        orderBy?: 'ASC' | 'DESC' | undefined
        filter?:
          | {
              id?: string | boolean | string[] | undefined
              communityId?: string | boolean | string[] | undefined
              title?: StringFilter
              avatar?: StringFilter
              viewHash?: StringFilter
              editHash?: StringFilter
              scopeSummaryId?: string | boolean | string[] | undefined
              slug?: StringFilter
              isRestricted?: boolean | undefined
              isPublic?: boolean | undefined
              metadata?: { [x: string]: any } | undefined
              kind?:
                | 'tag'
                | 'issue'
                | 'book'
                | 'conference'
                | ('tag' | 'issue' | 'book' | 'conference' | null)[]
                | null
                | undefined
              doi?: StringFilter
              readNextPreviewSize?:
                | 'none'
                | 'minimal'
                | 'medium'
                | 'choose-best'
                | ('none' | 'minimal' | 'medium' | 'choose-best')[]
                | undefined
              layoutAllowsDuplicatePubs?: boolean | undefined
              pageId?: string | boolean | string[] | undefined
              crossrefDepositRecordId?: string | boolean | string[] | undefined
              createdAt?: DateFilter
              updatedAt?: DateFilter
            }
          | undefined
        include?:
          | (
              | 'community'
              | 'attributions'
              | 'collectionPubs'
              | 'members'
              | 'page'
            )[]
          | undefined
        attributes?:
          | (
              | 'id'
              | 'createdAt'
              | 'updatedAt'
              | 'communityId'
              | 'title'
              | 'avatar'
              | 'viewHash'
              | 'editHash'
              | 'scopeSummaryId'
              | 'slug'
              | 'isRestricted'
              | 'isPublic'
              | 'metadata'
              | 'kind'
              | 'doi'
              | 'readNextPreviewSize'
              | 'layout'
              | 'layoutAllowsDuplicatePubs'
              | 'pageId'
              | 'crossrefDepositRecordId'
            )[]
          | undefined
      } & {
        id?: string | boolean | string[] | undefined
        communityId?: string | boolean | string[] | undefined
        title?: StringFilter
        avatar?: StringFilter
        viewHash?: StringFilter
        editHash?: StringFilter
        scopeSummaryId?: string | boolean | string[] | undefined
        slug?: StringFilter
        isRestricted?: boolean | undefined
        isPublic?: boolean | undefined
        metadata?: { [x: string]: any } | undefined
        kind?:
          | 'tag'
          | 'issue'
          | 'book'
          | 'conference'
          | ('tag' | 'issue' | 'book' | 'conference' | null)[]
          | null
          | undefined
        doi?: StringFilter
        readNextPreviewSize?:
          | 'none'
          | 'minimal'
          | 'medium'
          | 'choose-best'
          | ('none' | 'minimal' | 'medium' | 'choose-best')[]
          | undefined
        layoutAllowsDuplicatePubs?: boolean | undefined
        pageId?: string | boolean | string[] | undefined
        crossrefDepositRecordId?: string | boolean | string[] | undefined
        createdAt?: DateFilter
        updatedAt?: DateFilter
      })
    | undefined
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    isRestricted: boolean | null
    isPublic: boolean | null
    metadata: Record<string, any> | null
    kind: 'tag' | 'issue' | 'book' | 'conference' | null
    doi: string | null
    readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    pageId: string | null
    crossrefDepositRecordId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
    attributions?: Attribution[]
    collectionPubs?: CollectionPub[]
    members?: Member[]
    page?: Page
    community?: Community
  }[]
  headers: Headers
}>
```

#### `pubpub.collection.getResource`

`GET /api/collections/:collectionId/resource`

Get collection as a resource

```ts
getResource: (input) => Promise<{ status: 200; body: any; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections-collectionId-resource/get>

##### Parameters

`input`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    collectionId: string
  }
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: any
  headers: Headers
}>
```

#### `pubpub.collection.remove`

`DELETE /api/collections`

Remove a collection

```ts
remove: (input, rest?) =>
  Promise<{ status: 200; body: string; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections/delete>

##### Parameters

`input`

```ts
{
  id: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: string
  headers: Headers
}>
```

#### `pubpub.collection.update`

`PUT /api/collections`

Update a collection

```ts
update: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      communityId?: string | undefined
      title?: string | undefined
      slug?: string | undefined
      isRestricted?: boolean | null | undefined
      isPublic?: boolean | null | undefined
      doi?: string | null | undefined
      pageId?: string | null | undefined
      kind?: 'tag' | 'issue' | 'book' | 'conference' | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collections/put>

##### Parameters

`input`

```ts
{
  avatar: null | string
  doi: null | string
  id: string
  isPublic: null | boolean
  isRestricted: null | boolean
  layout: Layout
  layoutAllowsDuplicatePubs: boolean
  metadata: null | Record<string, any>
  pageId: null | string
  readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
  slug: string
  title: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    communityId?: string | undefined
    title?: string | undefined
    slug?: string | undefined
    isRestricted?: boolean | null | undefined
    isPublic?: boolean | null | undefined
    doi?: string | null | undefined
    pageId?: string | null | undefined
    kind?: 'tag' | 'issue' | 'book' | 'conference' | undefined
  }
  headers: Headers
}>
```

### `pubpub.collectionAttribution`

#### `pubpub.collectionAttribution.batchCreate`

`POST /api/collectionAttributions/batch`

Batch create collection attributions

```ts
batchCreate: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      collectionId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }[]
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionAttributions-batch/post>

##### Parameters

`input`

```ts
{
  attributions?: Attribution[]
  collectionId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    collectionId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }[]
  headers: Headers
}>
```

#### `pubpub.collectionAttribution.create`

`POST /api/collectionAttributions`

Create a collection attribution

```ts
create: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      collectionId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionAttributions/post>

##### Parameters

`input`

```ts
{
  affiliation: null | string
  avatar: null | string
  collectionId: string
  createdAt: string
  isAuthor: null | boolean
  name: string
  orcid: null | string
  order: number
  roles: null | string[]
  title: null | string
  updatedAt: string
  userId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    collectionId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.collectionAttribution.get`

`GET /api/collectionAttributions/:id`

Get a collection attribution

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      collectionId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
      collection?: Collection
      user?: User
    }
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionAttributions-id/get>

##### Parameters

`input`

```ts
{
  params: { id: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
  query?:
    | {
        include?: ('collection' | 'user')[] | undefined
        attributes?:
          | (
              | 'id'
              | 'collectionId'
              | 'title'
              | 'avatar'
              | 'name'
              | 'order'
              | 'isAuthor'
              | 'roles'
              | 'affiliation'
              | 'orcid'
              | 'userId'
            )[]
          | undefined
      }
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    collectionId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
    collection?: Collection
    user?: User
  }
  headers: Headers
}>
```

#### `pubpub.collectionAttribution.getMany`

`GET /api/collectionAttributions`

Get multiple collection attributions. You are limited to attributions in your community.

```ts
getMany: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      collectionId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
      collection?: Collection
      user?: User
    }[]
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionAttributions/get>

##### Parameters

`input?`

```ts
{
  query:
    | ({
        limit?: number | undefined
        offset?: number | undefined
        sortBy?:
          | 'createdAt'
          | 'updatedAt'
          | 'name'
          | 'order'
          | 'affiliation'
          | undefined
        orderBy?: 'ASC' | 'DESC' | undefined
        filter?:
          | {
              id?: string | boolean | string[] | undefined
              collectionId?: string | boolean | string[] | undefined
              title?: StringFilter
              avatar?: StringFilter
              name?: StringFilter
              order?: NumberFilter
              isAuthor?: boolean | undefined
              roles?:
                | ( StringFilter
                  )[]
                | undefined
              affiliation?: StringFilter
              orcid?: StringFilter
              userId?: string | boolean | string[] | undefined
              createdAt?: DateFilter
              updatedAt?: DateFilter
            }
          | undefined
        include?: ('collection' | 'user')[] | undefined
        attributes?:
          | (
              | 'id'
              | 'createdAt'
              | 'updatedAt'
              | 'collectionId'
              | 'title'
              | 'avatar'
              | 'name'
              | 'order'
              | 'isAuthor'
              | 'roles'
              | 'affiliation'
              | 'orcid'
              | 'userId'
            )[]
          | undefined
      } & {
        id?: string | boolean | string[] | undefined
        collectionId?: string | boolean | string[] | undefined
        title?: StringFilter
        avatar?: StringFilter
        name?: StringFilter
        order?: NumberFilter
        isAuthor?: boolean | undefined
        roles?:
          | ( StringFilter
            )[]
          | undefined
        affiliation?: StringFilter
        orcid?: StringFilter
        userId?: string | boolean | string[] | undefined
        createdAt?: DateFilter
        updatedAt?: DateFilter
      })
    | undefined
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    collectionId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
    collection?: Collection
    user?: User
  }[]
  headers: Headers
}>
```

#### `pubpub.collectionAttribution.remove`

`DELETE /api/collectionAttributions`

Remove a collection attribution

```ts
remove: (input, rest?) =>
  Promise<{ status: 200; body: string; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionAttributions/delete>

##### Parameters

`input`

```ts
{
  collectionId: string
  id: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: string
  headers: Headers
}>
```

#### `pubpub.collectionAttribution.update`

`PUT /api/collectionAttributions`

Update a collection attribution

```ts
update: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      createdAt?: string | undefined
      updatedAt?: string | undefined
      title?: string | null | undefined
      avatar?: string | null | undefined
      name?: string | null | undefined
      order?: number | undefined
      isAuthor?: boolean | null | undefined
      roles?: string[] | null | undefined
      affiliation?: string | null | undefined
      orcid?: string | null | undefined
      userId?: string | null | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionAttributions/put>

##### Parameters

`input`

```ts
{
  affiliation: null | string
  avatar: null | string
  collectionId: string
  createdAt: string
  id: string
  isAuthor: null | boolean
  name: null | string
  orcid: null | string
  order: number
  roles: null | string[]
  title: null | string
  updatedAt: string
  userId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    createdAt?: string | undefined
    updatedAt?: string | undefined
    title?: string | null | undefined
    avatar?: string | null | undefined
    name?: string | null | undefined
    order?: number | undefined
    isAuthor?: boolean | null | undefined
    roles?: string[] | null | undefined
    affiliation?: string | null | undefined
    orcid?: string | null | undefined
    userId?: string | null | undefined
  }
  headers: Headers
}>
```

### `pubpub.collectionPub`

#### `pubpub.collectionPub.create`

`POST /api/collectionPubs`

Add a pub to a collection

```ts
create: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      pubId: string
      collectionId: string
      rank: string
      contextHint: string | null
      pubRank: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionPubs/post>

##### Parameters

`input`

```ts
{
  collectionId: string
  moveToTop: boolean
  pubId: string
  rank: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    pubId: string
    collectionId: string
    rank: string
    contextHint: string | null
    pubRank: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.collectionPub.get`

`GET /api/collectionPubs`

Get the pubs associated with a collection

```ts
get: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      metadata: {
        mtg_id: string
        bibcode: string
        mtg_presentation_id: string
      } | null
      doi: string | null
      crossrefDepositRecordId: string | null
      htmlTitle: string | null
      htmlDescription: string | null
      customPublishedAt: string | null
      labels:
        | { id: string; title: string; color: string; publicApply: boolean }[]
        | null
      downloads: { createdAt: string; type: 'formatted'; url: string }[] | null
      reviewHash: string | null
      commentHash: string | null
      draftId: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }[]
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionPubs/get>

##### Parameters

`input?`

```ts
{
  query: {
    collectionId: string
    communityId: string
    pubId?: string | undefined
  }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    metadata: {
      mtg_id: string
      bibcode: string
      mtg_presentation_id: string
    } | null
    doi: string | null
    crossrefDepositRecordId: string | null
    htmlTitle: string | null
    htmlDescription: string | null
    customPublishedAt: string | null
    labels:
      | {
          id: string
          title: string
          color: string
          publicApply: boolean
        }[]
      | null
    downloads:
      | {
          createdAt: string
          type: 'formatted'
          url: string
        }[]
      | null
    reviewHash: string | null
    commentHash: string | null
    draftId: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }[]
  headers: Headers
}>
```

#### `pubpub.collectionPub.remove`

`DELETE /api/collectionPubs`

Remove a pub from a collection

```ts
remove: (input, rest?) =>
  Promise<{ status: 200; body: string; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionPubs/delete>

##### Parameters

`input`

```ts
{
  id: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: string
  headers: Headers
}>
```

#### `pubpub.collectionPub.update`

`PUT /api/collectionPubs`

Change the pubs that are associated with a collection

```ts
update: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      pubId?: string | undefined
      collectionId?: string | undefined
      rank?: string | undefined
      contextHint?: string | null | undefined
      pubRank?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-collectionPubs/put>

##### Parameters

`input`

```ts
{
  collectionId: string
  contextHint: null | string
  id: string
  pubId: string
  pubRank: string
  rank: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    pubId?: string | undefined
    collectionId?: string | undefined
    rank?: string | undefined
    contextHint?: string | null | undefined
    pubRank?: string | undefined
  }
  headers: Headers
}>
```

### `pubpub.community`

#### `pubpub.community.create`

`POST /api/communities`

Create a community

```ts
create: (input, rest?) =>
  Promise<{ status: 201; body: string; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-communities/post>

##### Parameters

`input`

```ts
{
  accentColorDark: undefined | string
  accentColorLight: undefined | string
  description: undefined | null | string
  headerLogo: undefined | null | string
  heroLogo: undefined | null | string
  heroTitle: undefined | null | string
  subdomain: string
  title: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: string
  headers: Headers
}>
```

#### `pubpub.community.get`

`GET /api/communities/:id`

Get a community

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      subdomain: string
      domain: string | null
      title: string
      citeAs: string | null
      publishAs: string | null
      description: string | null
      avatar: string | null
      favicon: string | null
      accentColorLight: string
      accentColorDark: string
      hideCreatePubButton: boolean | null
      headerLogo: string | null
      headerLinks:
        | { title: string; url: string; external?: boolean | undefined }[]
        | null
      headerColorType: 'light' | 'dark' | 'custom' | null
      useHeaderTextAccent: boolean | null
      hideHero: boolean | null
      hideHeaderLogo: boolean | null
      heroLogo: string | null
      heroBackgroundImage: string | null
      heroBackgroundColor: string | null
      heroTextColor: string | null
      useHeaderGradient: boolean | null
      heroImage: string | null
      heroTitle: string | null
      heroText: string | null
      heroPrimaryButton: { title: string; url: string } | null
      heroSecondaryButton: { title: string; url: string } | null
      heroAlign: string | null
      navigation:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
      hideNav: boolean | null
      navLinks:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
      footerLinks:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
      footerLogoLink: string | null
      footerTitle: string | null
      footerImage: string | null
      website: string | null
      facebook: string | null
      twitter: string | null
      email: string | null
      issn: string | null
      isFeatured: boolean | null
      viewHash: string | null
      editHash: string | null
      premiumLicenseFlag: boolean | null
      defaultPubCollections: string[] | null
      spamTagId: string | null
      organizationId: string | null
      scopeSummaryId: string | null
      accentTextColor: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-communities-id/get>

##### Parameters

`input`

```ts
{
  params: { id: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    subdomain: string
    domain: string | null
    title: string
    citeAs: string | null
    publishAs: string | null
    description: string | null
    avatar: string | null
    favicon: string | null
    accentColorLight: string
    accentColorDark: string
    hideCreatePubButton: boolean | null
    headerLogo: string | null
    headerLinks:
      | {
          title: string
          url: string
          external?: boolean | undefined
        }[]
      | null
    headerColorType: 'light' | 'dark' | 'custom' | null
    useHeaderTextAccent: boolean | null
    hideHero: boolean | null
    hideHeaderLogo: boolean | null
    heroLogo: string | null
    heroBackgroundImage: string | null
    heroBackgroundColor: string | null
    heroTextColor: string | null
    useHeaderGradient: boolean | null
    heroImage: string | null
    heroTitle: string | null
    heroText: string | null
    heroPrimaryButton: {
      title: string
      url: string
    } | null
    heroSecondaryButton: {
      title: string
      url: string
    } | null
    heroAlign: string | null
    navigation:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
    hideNav: boolean | null
    navLinks:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
    footerLinks:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
    footerLogoLink: string | null
    footerTitle: string | null
    footerImage: string | null
    website: string | null
    facebook: string | null
    twitter: string | null
    email: string | null
    issn: string | null
    isFeatured: boolean | null
    viewHash: string | null
    editHash: string | null
    premiumLicenseFlag: boolean | null
    defaultPubCollections: string[] | null
    spamTagId: string | null
    organizationId: string | null
    scopeSummaryId: string | null
    accentTextColor: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.community.getCommunities`

`GET /api/communities`

Get a list of communities. Currently only returns the current community.

```ts
getCommunities: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      subdomain: string
      domain: string | null
      title: string
      citeAs: string | null
      publishAs: string | null
      description: string | null
      avatar: string | null
      favicon: string | null
      accentColorLight: string
      accentColorDark: string
      hideCreatePubButton: boolean | null
      headerLogo: string | null
      headerLinks:
        | { title: string; url: string; external?: boolean | undefined }[]
        | null
      headerColorType: 'light' | 'dark' | 'custom' | null
      useHeaderTextAccent: boolean | null
      hideHero: boolean | null
      hideHeaderLogo: boolean | null
      heroLogo: string | null
      heroBackgroundImage: string | null
      heroBackgroundColor: string | null
      heroTextColor: string | null
      useHeaderGradient: boolean | null
      heroImage: string | null
      heroTitle: string | null
      heroText: string | null
      heroPrimaryButton: { title: string; url: string } | null
      heroSecondaryButton: { title: string; url: string } | null
      heroAlign: string | null
      navigation:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
      hideNav: boolean | null
      navLinks:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
      footerLinks:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
      footerLogoLink: string | null
      footerTitle: string | null
      footerImage: string | null
      website: string | null
      facebook: string | null
      twitter: string | null
      email: string | null
      issn: string | null
      isFeatured: boolean | null
      viewHash: string | null
      editHash: string | null
      premiumLicenseFlag: boolean | null
      defaultPubCollections: string[] | null
      spamTagId: string | null
      organizationId: string | null
      scopeSummaryId: string | null
      accentTextColor: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }[]
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-communities/get>

##### Parameters

`input?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    subdomain: string
    domain: string | null
    title: string
    citeAs: string | null
    publishAs: string | null
    description: string | null
    avatar: string | null
    favicon: string | null
    accentColorLight: string
    accentColorDark: string
    hideCreatePubButton: boolean | null
    headerLogo: string | null
    headerLinks:
      | {
          title: string
          url: string
          external?: boolean | undefined
        }[]
      | null
    headerColorType: 'light' | 'dark' | 'custom' | null
    useHeaderTextAccent: boolean | null
    hideHero: boolean | null
    hideHeaderLogo: boolean | null
    heroLogo: string | null
    heroBackgroundImage: string | null
    heroBackgroundColor: string | null
    heroTextColor: string | null
    useHeaderGradient: boolean | null
    heroImage: string | null
    heroTitle: string | null
    heroText: string | null
    heroPrimaryButton: {
      title: string
      url: string
    } | null
    heroSecondaryButton: {
      title: string
      url: string
    } | null
    heroAlign: string | null
    navigation:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
    hideNav: boolean | null
    navLinks:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
    footerLinks:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
    footerLogoLink: string | null
    footerTitle: string | null
    footerImage: string | null
    website: string | null
    facebook: string | null
    twitter: string | null
    email: string | null
    issn: string | null
    isFeatured: boolean | null
    viewHash: string | null
    editHash: string | null
    premiumLicenseFlag: boolean | null
    defaultPubCollections: string[] | null
    spamTagId: string | null
    organizationId: string | null
    scopeSummaryId: string | null
    accentTextColor: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }[]
  headers: Headers
}>
```

#### `pubpub.community.update`

`PUT /api/communities`

Update a community

```ts
update: (input?, rest?) =>
  Promise<{
    status: 200
    body: {
      subdomain?: string | undefined
      domain?: string | null | undefined
      title?: string | undefined
      citeAs?: string | null | undefined
      publishAs?: string | null | undefined
      description?: string | null | undefined
      avatar?: string | null | undefined
      favicon?: string | null | undefined
      accentColorLight?: string | undefined
      accentColorDark?: string | undefined
      hideCreatePubButton?: boolean | null | undefined
      headerLogo?: string | null | undefined
      headerLinks?:
        | { title: string; url: string; external?: boolean | undefined }[]
        | null
        | undefined
      headerColorType?: 'light' | 'dark' | 'custom' | null | undefined
      useHeaderTextAccent?: boolean | null | undefined
      hideHero?: boolean | null | undefined
      hideHeaderLogo?: boolean | null | undefined
      heroLogo?: string | null | undefined
      heroBackgroundImage?: string | null | undefined
      heroBackgroundColor?: string | null | undefined
      heroTextColor?: string | null | undefined
      useHeaderGradient?: boolean | null | undefined
      heroImage?: string | null | undefined
      heroTitle?: string | null | undefined
      heroText?: string | null | undefined
      heroPrimaryButton?: { title: string; url: string } | null | undefined
      heroSecondaryButton?: { title: string; url: string } | null | undefined
      heroAlign?: string | null | undefined
      navigation?:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
        | undefined
      hideNav?: boolean | null | undefined
      navLinks?:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
        | undefined
      footerLinks?:
        | (
            | { id: string; type: 'collection' | 'page' }
            | { id: string; title: string; href: string }
            | {
                id: string
                title: string
                children: (
                  | { id: string; type: 'collection' | 'page' }
                  | { id: string; title: string; href: string }
                )[]
              }
          )[]
        | null
        | undefined
      footerLogoLink?: string | null | undefined
      footerTitle?: string | null | undefined
      footerImage?: string | null | undefined
      website?: string | null | undefined
      facebook?: string | null | undefined
      twitter?: string | null | undefined
      email?: string | null | undefined
      issn?: string | null | undefined
      isFeatured?: boolean | null | undefined
      viewHash?: string | null | undefined
      editHash?: string | null | undefined
      premiumLicenseFlag?: boolean | null | undefined
      defaultPubCollections?: string[] | null | undefined
      spamTagId?: string | null | undefined
      organizationId?: string | null | undefined
      scopeSummaryId?: string | null | undefined
      accentTextColor?: string | undefined
      communityId?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-communities/put>

##### Parameters

`input?`

```ts
{
  accentColorDark: string
  accentColorLight: string
  accentTextColor: string
  avatar: null | string
  citeAs: null | string
  defaultPubCollections: null | string[]
  description: null | string
  domain: null | string
  editHash: null | string
  email: null | string
  facebook: null | string
  favicon: null | string
  footerImage: null | string
  footerLinks:
    | null
    | (
        | {
            id: string
            type: 'collection' | 'page'
          }
        | {
            href: string
            id: string
            title: string
          }
        | {
            children: (
              | { id: string; type: 'collection' | 'page' }
              | { id: string; title: string; href: string }
            )[]
            id: string
            title: string
          }
      )[]
  footerLogoLink: null | string
  footerTitle: null | string
  headerColorType: null | 'light' | 'dark' | 'custom'
  headerLinks:
    | null
    | {
        external: boolean
        title: string
        url: string
      }[]
  headerLogo: null | string
  heroAlign: null | string
  heroBackgroundColor: null | string
  heroBackgroundImage: null | string
  heroImage: null | string
  heroLogo: null | string
  heroPrimaryButton: null | {
    title: string
    url: string
  }
  heroSecondaryButton: null | {
    title: string
    url: string
  }
  heroText: null | string
  heroTextColor: null | string
  heroTitle: null | string
  hideCreatePubButton: null | boolean
  hideHeaderLogo: null | boolean
  hideHero: null | boolean
  hideNav: null | boolean
  isFeatured: null | boolean
  issn: null | string
  navLinks:
    | null
    | (
        | {
            id: string
            type: 'collection' | 'page'
          }
        | {
            href: string
            id: string
            title: string
          }
        | {
            children: (
              | { id: string; type: 'collection' | 'page' }
              | { id: string; title: string; href: string }
            )[]
            id: string
            title: string
          }
      )[]
  navigation:
    | null
    | (
        | {
            id: string
            type: 'collection' | 'page'
          }
        | {
            href: string
            id: string
            title: string
          }
        | {
            children: (
              | { id: string; type: 'collection' | 'page' }
              | { id: string; title: string; href: string }
            )[]
            id: string
            title: string
          }
      )[]
  organizationId: null | string
  premiumLicenseFlag: null | boolean
  publishAs: null | string
  scopeSummaryId: null | string
  spamTagId: null | string
  subdomain: string
  title: string
  twitter: null | string
  useHeaderGradient: null | boolean
  useHeaderTextAccent: null | boolean
  viewHash: null | string
  website: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    subdomain?: string | undefined
    domain?: string | null | undefined
    title?: string | undefined
    citeAs?: string | null | undefined
    publishAs?: string | null | undefined
    description?: string | null | undefined
    avatar?: string | null | undefined
    favicon?: string | null | undefined
    accentColorLight?: string | undefined
    accentColorDark?: string | undefined
    hideCreatePubButton?: boolean | null | undefined
    headerLogo?: string | null | undefined
    headerLinks?:
      | {
          title: string
          url: string
          external?: boolean | undefined
        }[]
      | null
      | undefined
    headerColorType?: 'light' | 'dark' | 'custom' | null | undefined
    useHeaderTextAccent?: boolean | null | undefined
    hideHero?: boolean | null | undefined
    hideHeaderLogo?: boolean | null | undefined
    heroLogo?: string | null | undefined
    heroBackgroundImage?: string | null | undefined
    heroBackgroundColor?: string | null | undefined
    heroTextColor?: string | null | undefined
    useHeaderGradient?: boolean | null | undefined
    heroImage?: string | null | undefined
    heroTitle?: string | null | undefined
    heroText?: string | null | undefined
    heroPrimaryButton?:
      | {
          title: string
          url: string
        }
      | null
      | undefined
    heroSecondaryButton?:
      | {
          title: string
          url: string
        }
      | null
      | undefined
    heroAlign?: string | null | undefined
    navigation?:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
      | undefined
    hideNav?: boolean | null | undefined
    navLinks?:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
      | undefined
    footerLinks?:
      | (
          | {
              id: string
              type: 'collection' | 'page'
            }
          | {
              id: string
              title: string
              href: string
            }
          | {
              id: string
              title: string
              children: (
                | {
                    id: string
                    type: 'collection' | 'page'
                  }
                | {
                    id: string
                    title: string
                    href: string
                  }
              )[]
            }
        )[]
      | null
      | undefined
    footerLogoLink?: string | null | undefined
    footerTitle?: string | null | undefined
    footerImage?: string | null | undefined
    website?: string | null | undefined
    facebook?: string | null | undefined
    twitter?: string | null | undefined
    email?: string | null | undefined
    issn?: string | null | undefined
    isFeatured?: boolean | null | undefined
    viewHash?: string | null | undefined
    editHash?: string | null | undefined
    premiumLicenseFlag?: boolean | null | undefined
    defaultPubCollections?: string[] | null | undefined
    spamTagId?: string | null | undefined
    organizationId?: string | null | undefined
    scopeSummaryId?: string | null | undefined
    accentTextColor?: string | undefined
    communityId?: string | undefined
  }
  headers: Headers
}>
```

### `pubpub.customScript`

#### `pubpub.customScript.set`

`POST /api/customScripts`

Set a custom scripts, i.e. the CSS or JS (if you have access) for this community

```ts
set: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      id: string
      type: 'css' | 'js' | null
      communityId: string | null
      content: string | null
    }
    headers: Headers
  }>
```

##### Example

```ts
const pubpub = await PubPub.createSDK({
  // ...
})
const { body } = await pubpub.customScript.set({
  type: 'css', // js only if your community has access to it
  content: '...', // raw css
})
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-customScripts/post>

##### Parameters

`input`

```ts
{
  content: null | string
  type: null | 'css' | 'js'
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    type: 'css' | 'js' | null
    communityId: string | null
    content: string | null
  }
  headers: Headers
}>
```

### `pubpub.facets`

#### `pubpub.facets.update`

`POST /api/facets`

Facets are properties that cascade down from a community, collection, or publication to all
of its children, like the style of citation used or the license for content.

You cannot "unset" facets, so passing an empty object will just be treated as no change.

```ts
update: (input, rest?) => Promise<{ status: 200; body: {}; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-facets/post>

##### Parameters

`input`

```ts
{
  facets: {
    CitationStyle:
      | undefined
      | {
          citationStyle?:
            | 'acm-siggraph'
            | 'american-anthro'
            | 'apa'
            | 'apa-7'
            | 'arcadia-science'
            | 'cell'
            | 'chicago'
            | 'harvard'
            | 'elife'
            | 'frontiers'
            | 'mla'
            | 'vancouver'
            | 'ama'
            | undefined
          inlineCitationStyle?:
            | 'label'
            | 'count'
            | 'authorYear'
            | 'author'
            | undefined
        }
    License:
      | undefined
      | {
          kind?:
            | 'cc-by'
            | 'cc-0'
            | 'cc-by-nc'
            | 'cc-by-nd'
            | 'cc-by-nc-nd'
            | 'cc-by-nc-sa'
            | 'cc-by-sa'
            | 'copyright'
            | undefined
          copyrightSelection?:
            | {
                choice?: 'infer-from-scope' | 'choose-here' | undefined
                year?: number | null | undefined
              }
            | undefined
        }
    NodeLabels:
      | undefined
      | {
          image?:
            | { enabled?: boolean | undefined; text?: string | undefined }
            | undefined
          video?:
            | { enabled?: boolean | undefined; text?: string | undefined }
            | undefined
          audio?:
            | { enabled?: boolean | undefined; text?: string | undefined }
            | undefined
          table?:
            | { enabled?: boolean | undefined; text?: string | undefined }
            | undefined
          math?:
            | { enabled?: boolean | undefined; text?: string | undefined }
            | undefined
          iframe?:
            | { enabled?: boolean | undefined; text?: string | undefined }
            | undefined
        }
    PubEdgeDisplay:
      | undefined
      | {
          defaultsToCarousel?: boolean | undefined
          descriptionIsVisible?: boolean | undefined
        }
    PubHeaderTheme:
      | undefined
      | {
          backgroundImage?: string | undefined
          backgroundColor?: string | undefined
          textStyle?:
            | 'light'
            | 'dark'
            | 'black-blocks'
            | 'white-blocks'
            | undefined
        }
  }
  scope: {
    id: string
    kind: 'community' | 'collection' | 'pub'
  }
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {}
  headers: Headers
}>
```

### `pubpub.member`

#### `pubpub.member.create`

`POST /api/members`

Create a member

```ts
create: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      pubId: string | null
      collectionId: string | null
      communityId: string | null
      organizationId: string | null
      userId: string
      permissions: 'view' | 'edit' | 'manage' | 'admin'
      isOwner: boolean | null
      subscribedToActivityDigest: boolean
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-members/post>

##### Parameters

`input`

```ts
{
  collectionId: null | string
  pubId: null | string
  targetUserId: string
  value: {
    permissions: 'view' | 'edit' | 'manage' | 'admin'
  }
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    pubId: string | null
    collectionId: string | null
    communityId: string | null
    organizationId: string | null
    userId: string
    permissions: 'view' | 'edit' | 'manage' | 'admin'
    isOwner: boolean | null
    subscribedToActivityDigest: boolean
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.member.get`

`GET /api/members/:id`

Get a member

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string | null
      collectionId: string | null
      communityId: string | null
      organizationId: string | null
      userId: string
      permissions: 'view' | 'edit' | 'manage' | 'admin'
      isOwner: boolean | null
      subscribedToActivityDigest: boolean
      createdAt?: string | undefined
      updatedAt?: string | undefined
      user?: User
      community?: Community
      pub?: Pub
      collection?: Collection
    }
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-members-id/get>

##### Parameters

`input`

```ts
{
  params: { id: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
  query?:
    | {
        include?: ('community' | 'collection' | 'pub' | 'user')[] | undefined
        attributes?:
          | (
              | 'id'
              | 'pubId'
              | 'collectionId'
              | 'communityId'
              | 'organizationId'
              | 'userId'
              | 'permissions'
              | 'isOwner'
              | 'subscribedToActivityDigest'
            )[]
          | undefined
      }
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string | null
    collectionId: string | null
    communityId: string | null
    organizationId: string | null
    userId: string
    permissions: 'view' | 'edit' | 'manage' | 'admin'
    isOwner: boolean | null
    subscribedToActivityDigest: boolean
    createdAt?: string | undefined
    updatedAt?: string | undefined
    user?: User
    community?: Community
    pub?: Pub
    collection?: Collection
  }
  headers: Headers
}>
```

#### `pubpub.member.getMany`

`GET /api/members`

Get many members

```ts
getMany: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string | null
      collectionId: string | null
      communityId: string | null
      organizationId: string | null
      userId: string
      permissions: 'view' | 'edit' | 'manage' | 'admin'
      isOwner: boolean | null
      subscribedToActivityDigest: boolean
      createdAt?: string | undefined
      updatedAt?: string | undefined
      user?: User
      community?: Community
      pub?: Pub
      collection?: Collection
    }[]
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-members/get>

##### Parameters

`input?`

```ts
{
  query:
    | ({
        limit?: number | undefined
        offset?: number | undefined
        sortBy?: 'createdAt' | 'updatedAt' | undefined
        orderBy?: 'ASC' | 'DESC' | undefined
        filter?:
          | {
              id?: string | boolean | string[] | undefined
              pubId?: string | boolean | string[] | undefined
              collectionId?: string | boolean | string[] | undefined
              communityId?: string | boolean | string[] | undefined
              organizationId?: string | boolean | string[] | undefined
              userId?: string | boolean | string[] | undefined
              permissions?:
                | 'view'
                | 'edit'
                | 'manage'
                | 'admin'
                | ('view' | 'edit' | 'manage' | 'admin')[]
                | undefined
              isOwner?: boolean | undefined
              subscribedToActivityDigest?: boolean | undefined
              createdAt?: DateFilter
              updatedAt?: DateFilter
            }
          | undefined
        include?: ('community' | 'collection' | 'pub' | 'user')[] | undefined
        attributes?:
          | (
              | 'id'
              | 'createdAt'
              | 'updatedAt'
              | 'pubId'
              | 'collectionId'
              | 'communityId'
              | 'organizationId'
              | 'userId'
              | 'permissions'
              | 'isOwner'
              | 'subscribedToActivityDigest'
            )[]
          | undefined
      } & {
        id?: string | boolean | string[] | undefined
        pubId?: string | boolean | string[] | undefined
        collectionId?: string | boolean | string[] | undefined
        communityId?: string | boolean | string[] | undefined
        organizationId?: string | boolean | string[] | undefined
        userId?: string | boolean | string[] | undefined
        permissions?:
          | 'view'
          | 'edit'
          | 'manage'
          | 'admin'
          | ('view' | 'edit' | 'manage' | 'admin')[]
          | undefined
        isOwner?: boolean | undefined
        subscribedToActivityDigest?: boolean | undefined
        createdAt?: DateFilter
        updatedAt?: DateFilter
      })
    | undefined
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string | null
    collectionId: string | null
    communityId: string | null
    organizationId: string | null
    userId: string
    permissions: 'view' | 'edit' | 'manage' | 'admin'
    isOwner: boolean | null
    subscribedToActivityDigest: boolean
    createdAt?: string | undefined
    updatedAt?: string | undefined
    user?: User
    community?: Community
    pub?: Pub
    collection?: Collection
  }[]
  headers: Headers
}>
```

#### `pubpub.member.remove`

`DELETE /api/members`

Remove a member

```ts
remove: (input, rest?) =>
  Promise<{ status: 200; body: string; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-members/delete>

##### Parameters

`input`

```ts
{
  collectionId: null | string
  id: string
  pubId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: string
  headers: Headers
}>
```

#### `pubpub.member.update`

`PUT /api/members`

Update a member

```ts
update: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      id: string
      permissions: 'view' | 'edit' | 'manage' | 'admin'
      isOwner: boolean | null
      subscribedToActivityDigest: boolean
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-members/put>

##### Parameters

`input`

```ts
{
  collectionId: null | string
  id: string
  pubId: null | string
  value: {
    permissions: 'view' | 'edit' | 'manage' | 'admin'
    subscribedToActivityDigest: boolean
  }
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    permissions: 'view' | 'edit' | 'manage' | 'admin'
    isOwner: boolean | null
    subscribedToActivityDigest: boolean
  }
  headers: Headers
}>
```

### `pubpub.page`

#### `pubpub.page.create`

`POST /api/pages`

Create a page

```ts
create: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      slug: string
      isPublic: boolean
      layout: Layout
      layoutAllowsDuplicatePubs: boolean
      isNarrowWidth: boolean | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pages/post>

##### Parameters

`input`

```ts
{
  avatar: undefined | null | string
  description: undefined | null | string
  isNarrowWidth: undefined | null | boolean
  isPublic: undefined | boolean
  layout: Layout
  layoutAllowsDuplicatePubs: undefined | boolean
  slug: string
  title: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    slug: string
    isPublic: boolean
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    isNarrowWidth: boolean | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.page.get`

`GET /api/pages/:slugOrId`

Get a page by it's slug or id.

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      slug: string
      isPublic: boolean
      layout: Layout
      layoutAllowsDuplicatePubs: boolean
      isNarrowWidth: boolean | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pages-slugOrId/get>

##### Parameters

`input`

```ts
{
  params: { slugOrId: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
  query?:
    | {
        include?: 'community'[] | undefined
        attributes?:
          | (
              | 'id'
              | 'communityId'
              | 'title'
              | 'description'
              | 'avatar'
              | 'viewHash'
              | 'slug'
              | 'isPublic'
              | 'layout'
              | 'layoutAllowsDuplicatePubs'
              | 'isNarrowWidth'
            )[]
          | undefined
      }
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    slug: string
    isPublic: boolean
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    isNarrowWidth: boolean | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.page.getMany`

`GET /api/pages`

Get many pages

```ts
getMany: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      slug: string
      isPublic: boolean
      layout: Layout
      layoutAllowsDuplicatePubs: boolean
      isNarrowWidth: boolean | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }[]
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pages/get>

##### Parameters

`input?`

```ts
{
  query:
    | ({
        limit?: number | undefined
        offset?: number | undefined
        sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'slug' | undefined
        orderBy?: 'ASC' | 'DESC' | undefined
        filter?:
          | {
              id?: string | boolean | string[] | undefined
              communityId?: string | boolean | string[] | undefined
              title?: StringFilter
              description?: StringFilter
              avatar?: StringFilter
              viewHash?: StringFilter
              slug?: StringFilter
              isPublic?: boolean | undefined
              layoutAllowsDuplicatePubs?: boolean | undefined
              isNarrowWidth?: boolean | undefined
              createdAt?: DateFilter
              updatedAt?: DateFilter
            }
          | undefined
        include?: 'community'[] | undefined
        attributes?:
          | (
              | 'id'
              | 'createdAt'
              | 'updatedAt'
              | 'communityId'
              | 'title'
              | 'description'
              | 'avatar'
              | 'viewHash'
              | 'slug'
              | 'isPublic'
              | 'layout'
              | 'layoutAllowsDuplicatePubs'
              | 'isNarrowWidth'
            )[]
          | undefined
      } & {
        id?: string | boolean | string[] | undefined
        communityId?: string | boolean | string[] | undefined
        title?: StringFilter
        description?: StringFilter
        avatar?: StringFilter
        viewHash?: StringFilter
        slug?: StringFilter
        isPublic?: boolean | undefined
        layoutAllowsDuplicatePubs?: boolean | undefined
        isNarrowWidth?: boolean | undefined
        createdAt?: DateFilter
        updatedAt?: DateFilter
      })
    | undefined
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    slug: string
    isPublic: boolean
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    isNarrowWidth: boolean | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }[]
  headers: Headers
}>
```

#### `pubpub.page.remove`

`DELETE /api/pages`

Remove a page

```ts
remove: (input, rest?) =>
  Promise<{ status: 201; body: string; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pages/delete>

##### Parameters

`input`

```ts
{
  pageId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: string
  headers: Headers
}>
```

#### `pubpub.page.update`

`PUT /api/pages`

Update a page

```ts
update: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      title?: string | undefined
      description?: string | null | undefined
      avatar?: string | null | undefined
      viewHash?: string | null | undefined
      slug?: string | undefined
      isPublic?: boolean | undefined
      layout?: Layout
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      metadata: {
        mtg_id: string
        bibcode: string
        mtg_presentation_id: string
      } | null
      doi: string | null
      crossrefDepositRecordId: string | null
      htmlTitle: string | null
      htmlDescription: string | null
      customPublishedAt: string | null
      labels:
        | { id: string; title: string; color: string; publicApply: boolean }[]
        | null
      downloads: { createdAt: string; type: 'formatted'; url: string }[] | null
      reviewHash: string | null
      commentHash: string | null
      draftId: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs/post>

##### Parameters

`input?`

```ts
{
  avatar: null | string
  collectionId: null | string
  createPubToken: null | string
  customPublishedAt: null | string
  description: null | string
  doi: null | string
  downloads:
    | null
    | {
        createdAt: string
        type: 'formatted'
        url: string
      }[]
  htmlDescription: null | string
  htmlTitle: null | string
  slug: string
  title: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    metadata: {
      mtg_id: string
      bibcode: string
      mtg_presentation_id: string
    } | null
    doi: string | null
    crossrefDepositRecordId: string | null
    htmlTitle: string | null
    htmlDescription: string | null
    customPublishedAt: string | null
    labels:
      | {
          id: string
          title: string
          color: string
          publicApply: boolean
        }[]
      | null
    downloads:
      | {
          createdAt: string
          type: 'formatted'
          url: string
        }[]
      | null
    reviewHash: string | null
    commentHash: string | null
    draftId: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  headers: Headers
}>
```

#### `pubpub.pub.doi`

##### `pubpub.pub.doi.deposit`

`POST /api/pubs/:pubId/doi`

Deposit metadata to create a DOI

```ts
deposit: (input, rest) =>
  Promise<
    | {
        status: 200
        body: {
          type: 'element'
          name: string
          attributes?: Record<string, string> | undefined
          children?: any[] | undefined
        }
        headers: Headers
      }
    | { status: 400; body: { error: string }; headers: Headers }
  >
```

###### Access

You need to be **logged in** and have access to this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-pubId-doi/post>

###### Parameters

`input`

```ts
;undefined | null | {}
```

`rest`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    pubId: string
  }
}
```

###### Returns

```ts
Promise<
  | {
      status: 200
      body: {
        type: 'element'
        name: string
        attributes?: Record<string, string> | undefined
        children?: any[] | undefined
      }
      headers: Headers
    }
  | {
      status: 400
      body: {
        error: string
      }
      headers: Headers
    }
>
```

##### `pubpub.pub.doi.preview`

`POST /api/pubs/:pubId/doi/preview`

Preview a DOI deposit

```ts
preview: (input, rest) =>
  Promise<
    | {
        status: 200
        body: {
          type: 'element'
          name: string
          attributes?: Record<string, string> | undefined
          children?: any[] | undefined
        }
        headers: Headers
      }
    | { status: 400; body: { error: string }; headers: Headers }
  >
```

###### Access

You need to be **logged in** and have access to this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-pubId-doi-preview/post>

###### Parameters

`input`

```ts
;undefined | null | {}
```

`rest`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    pubId: string
  }
}
```

###### Returns

```ts
Promise<
  | {
      status: 200
      body: {
        type: 'element'
        name: string
        attributes?: Record<string, string> | undefined
        children?: any[] | undefined
      }
      headers: Headers
    }
  | {
      status: 400
      body: {
        error: string
      }
      headers: Headers
    }
>
```

#### `pubpub.pub.get`

`GET /api/pubs/:slugOrId`

Get a pub by it's slug or id.

The slug is the thing after `/pub/` in the URL, but before `/release` or `/draft`.

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      metadata: {
        mtg_id: string
        bibcode: string
        mtg_presentation_id: string
      } | null
      doi: string | null
      crossrefDepositRecordId: string | null
      htmlTitle: string | null
      htmlDescription: string | null
      customPublishedAt: string | null
      labels:
        | { id: string; title: string; color: string; publicApply: boolean }[]
        | null
      downloads: { createdAt: string; type: 'formatted'; url: string }[] | null
      reviewHash: string | null
      commentHash: string | null
      draftId: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
      attributions?: Attribution[]
      collectionPubs?: CollectionPub[]
      community?: Community
      draft?:
        | { id: string; latestKeyAt: string | null; firebasePath: string }
        | undefined
      discussions?: Discussion[]
      members?: Member[]
      releases?: Release[]
      inboundEdges?:
        | {
            id: string
            pubId: string
            externalPublicationId: string | null
            targetPubId: string | null
            relationType:
              | 'version'
              | 'comment'
              | 'commentary'
              | 'preprint'
              | 'rejoinder'
              | 'reply'
              | 'review'
              | 'supplement'
              | 'translation'
            rank: string
            pubIsParent: boolean
            approvedByTarget: boolean
          }[]
        | undefined
      outboundEdges?:
        | {
            id: string
            pubId: string
            externalPublicationId: string | null
            targetPubId: string | null
            relationType:
              | 'version'
              | 'comment'
              | 'commentary'
              | 'preprint'
              | 'rejoinder'
              | 'reply'
              | 'review'
              | 'supplement'
              | 'translation'
            rank: string
            pubIsParent: boolean
            approvedByTarget: boolean
          }[]
        | undefined
      reviews?: Review[]
      submission?: Submission
    }
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-slugOrId/get>

##### Parameters

`input`

```ts
{
  params: { slugOrId: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
  query?:
    | {
        include?:
          | (
              | 'community'
              | 'attributions'
              | 'collectionPubs'
              | 'members'
              | 'draft'
              | 'reviews'
              | 'releases'
              | 'outboundEdges'
              | 'inboundEdges'
              | 'submission'
            )[]
          | undefined
        attributes?:
          | (
              | 'id'
              | 'communityId'
              | 'title'
              | 'description'
              | 'avatar'
              | 'viewHash'
              | 'editHash'
              | 'scopeSummaryId'
              | 'slug'
              | 'metadata'
              | 'doi'
              | 'crossrefDepositRecordId'
              | 'htmlTitle'
              | 'htmlDescription'
              | 'customPublishedAt'
              | 'labels'
              | 'downloads'
              | 'reviewHash'
              | 'commentHash'
              | 'draftId'
            )[]
          | undefined
      }
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    metadata: {
      mtg_id: string
      bibcode: string
      mtg_presentation_id: string
    } | null
    doi: string | null
    crossrefDepositRecordId: string | null
    htmlTitle: string | null
    htmlDescription: string | null
    customPublishedAt: string | null
    labels:
      | {
          id: string
          title: string
          color: string
          publicApply: boolean
        }[]
      | null
    downloads:
      | {
          createdAt: string
          type: 'formatted'
          url: string
        }[]
      | null
    reviewHash: string | null
    commentHash: string | null
    draftId: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
    attributions?: Attribution[]
    collectionPubs?: CollectionPub[]
    community?: Community
    draft?: Draft
    discussions?: Discussion[]
    members?: Member[]
    releases?: Release[]
    inboundEdges?:
      | {
          id: string
          pubId: string
          externalPublicationId: string | null
          targetPubId: string | null
          relationType:
            | 'version'
            | 'comment'
            | 'commentary'
            | 'preprint'
            | 'rejoinder'
            | 'reply'
            | 'review'
            | 'supplement'
            | 'translation'
          rank: string
          pubIsParent: boolean
          approvedByTarget: boolean
        }[]
      | undefined
    outboundEdges?:
      | {
          id: string
          pubId: string
          externalPublicationId: string | null
          targetPubId: string | null
          relationType:
            | 'version'
            | 'comment'
            | 'commentary'
            | 'preprint'
            | 'rejoinder'
            | 'reply'
            | 'review'
            | 'supplement'
            | 'translation'
          rank: string
          pubIsParent: boolean
          approvedByTarget: boolean
        }[]
      | undefined
    reviews?: Review[]
    submission?: Submission
  }
  headers: Headers
}>
```

#### `pubpub.pub.getMany`

`GET /api/pubs`

Get many pubs

```ts
getMany: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      metadata: {
        mtg_id: string
        bibcode: string
        mtg_presentation_id: string
      } | null
      doi: string | null
      crossrefDepositRecordId: string | null
      htmlTitle: string | null
      htmlDescription: string | null
      customPublishedAt: string | null
      labels:
        | { id: string; title: string; color: string; publicApply: boolean }[]
        | null
      downloads: { createdAt: string; type: 'formatted'; url: string }[] | null
      reviewHash: string | null
      commentHash: string | null
      draftId: string
      createdAt?: string | undefined
      updatedAt?: string | undefined
      attributions?: Attribution[]
      collectionPubs?: CollectionPub[]
      community?: Community
      draft?:
        | { id: string; latestKeyAt: string | null; firebasePath: string }
        | undefined
      discussions?: Discussion[]
      members?: Member[]
      releases?: Release[]
      inboundEdges?:
        | {
            id: string
            pubId: string
            externalPublicationId: string | null
            targetPubId: string | null
            relationType:
              | 'version'
              | 'comment'
              | 'commentary'
              | 'preprint'
              | 'rejoinder'
              | 'reply'
              | 'review'
              | 'supplement'
              | 'translation'
            rank: string
            pubIsParent: boolean
            approvedByTarget: boolean
          }[]
        | undefined
      outboundEdges?:
        | {
            id: string
            pubId: string
            externalPublicationId: string | null
            targetPubId: string | null
            relationType:
              | 'version'
              | 'comment'
              | 'commentary'
              | 'preprint'
              | 'rejoinder'
              | 'reply'
              | 'review'
              | 'supplement'
              | 'translation'
            rank: string
            pubIsParent: boolean
            approvedByTarget: boolean
          }[]
        | undefined
      reviews?: Review[]
      submission?: Submission
    }[]
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs/get>

##### Parameters

`input?`

```ts
{
  query:
    | ({
        limit?: number | undefined
        offset?: number | undefined
        sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'slug' | undefined
        orderBy?: 'ASC' | 'DESC' | undefined
        filter?:
          | {
              id?: string | boolean | string[] | undefined
              communityId?: string | boolean | string[] | undefined
              title?: StringFilter
              description?: StringFilter
              avatar?: StringFilter
              viewHash?: StringFilter
              editHash?: StringFilter
              scopeSummaryId?: string | boolean | string[] | undefined
              slug?: StringFilter
              metadata?:
                | {
                    mtg_id?: StringFilter
                    bibcode?: StringFilter
                    mtg_presentation_id?: StringFilter
                  }
                | undefined
              doi?: StringFilter
              crossrefDepositRecordId?: string | boolean | string[] | undefined
              htmlTitle?: StringFilter
              htmlDescription?: StringFilter
              customPublishedAt?: DateFilter
              labels?:
                | {
                    id?: string | boolean | string[] | undefined
                    title?: StringFilter
                    color?: StringFilter
                    publicApply?: boolean | undefined
                  }[]
                | undefined
              downloads?:
                | {
                    createdAt?: DateFilter
                    type?: 'formatted' | 'formatted'[] | undefined
                    url?: StringFilter
                  }[]
                | undefined
              reviewHash?: StringFilter
              commentHash?: StringFilter
              draftId?: string | boolean | string[] | undefined
              createdAt?: DateFilter
              updatedAt?: DateFilter
            }
          | undefined
        include?:
          | (
              | 'community'
              | 'attributions'
              | 'collectionPubs'
              | 'members'
              | 'draft'
              | 'reviews'
              | 'releases'
              | 'outboundEdges'
              | 'inboundEdges'
              | 'submission'
            )[]
          | undefined
        attributes?:
          | (
              | 'id'
              | 'createdAt'
              | 'updatedAt'
              | 'communityId'
              | 'title'
              | 'description'
              | 'avatar'
              | 'viewHash'
              | 'editHash'
              | 'scopeSummaryId'
              | 'slug'
              | 'metadata'
              | 'doi'
              | 'crossrefDepositRecordId'
              | 'htmlTitle'
              | 'htmlDescription'
              | 'customPublishedAt'
              | 'labels'
              | 'downloads'
              | 'reviewHash'
              | 'commentHash'
              | 'draftId'
            )[]
          | undefined
      } & {
        id?: string | boolean | string[] | undefined
        communityId?: string | boolean | string[] | undefined
        title?: StringFilter
        description?: StringFilter
        avatar?: StringFilter
        viewHash?: StringFilter
        editHash?: StringFilter
        scopeSummaryId?: string | boolean | string[] | undefined
        slug?: StringFilter
        metadata?:
          | {
              mtg_id?: StringFilter
              bibcode?: StringFilter
              mtg_presentation_id?: StringFilter
            }
          | undefined
        doi?: StringFilter
        crossrefDepositRecordId?: string | boolean | string[] | undefined
        htmlTitle?: StringFilter
        htmlDescription?: StringFilter
        customPublishedAt?: DateFilter
        labels?:
          | {
              id?: string | boolean | string[] | undefined
              title?: StringFilter
              color?: StringFilter
              publicApply?: boolean | undefined
            }[]
          | undefined
        downloads?:
          | {
              createdAt?: DateFilter
              type?: 'formatted' | 'formatted'[] | undefined
              url?: StringFilter
            }[]
          | undefined
        reviewHash?: StringFilter
        commentHash?: StringFilter
        draftId?: string | boolean | string[] | undefined
        createdAt?: DateFilter
        updatedAt?: DateFilter
      })
    | undefined
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    communityId: string
    title: string
    description: string | null
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    metadata: {
      mtg_id: string
      bibcode: string
      mtg_presentation_id: string
    } | null
    doi: string | null
    crossrefDepositRecordId: string | null
    htmlTitle: string | null
    htmlDescription: string | null
    customPublishedAt: string | null
    labels:
      | {
          id: string
          title: string
          color: string
          publicApply: boolean
        }[]
      | null
    downloads:
      | {
          createdAt: string
          type: 'formatted'
          url: string
        }[]
      | null
    reviewHash: string | null
    commentHash: string | null
    draftId: string
    createdAt?: string | undefined
    updatedAt?: string | undefined
    attributions?: Attribution[]
    collectionPubs?: CollectionPub[]
    community?: Community
    draft?: Draft
    discussions?: Discussion[]
    members?: Member[]
    releases?: Release[]
    inboundEdges?:
      | {
          id: string
          pubId: string
          externalPublicationId: string | null
          targetPubId: string | null
          relationType:
            | 'version'
            | 'comment'
            | 'commentary'
            | 'preprint'
            | 'rejoinder'
            | 'reply'
            | 'review'
            | 'supplement'
            | 'translation'
          rank: string
          pubIsParent: boolean
          approvedByTarget: boolean
        }[]
      | undefined
    outboundEdges?:
      | {
          id: string
          pubId: string
          externalPublicationId: string | null
          targetPubId: string | null
          relationType:
            | 'version'
            | 'comment'
            | 'commentary'
            | 'preprint'
            | 'rejoinder'
            | 'reply'
            | 'review'
            | 'supplement'
            | 'translation'
          rank: string
          pubIsParent: boolean
          approvedByTarget: boolean
        }[]
      | undefined
    reviews?: Review[]
    submission?: Submission
  }[]
  headers: Headers
}>
```

#### `pubpub.pub.getResource`

`GET /api/pubs/:pubId/resource`

Get pub as a resource

```ts
getResource: (input) => Promise<{ status: 200; body: any; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-pubId-resource/get>

##### Parameters

`input`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    pubId: string
  }
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: any
  headers: Headers
}>
```

#### `pubpub.pub.queryMany`

`POST /api/pubs/many`

Search for many pubs. This is an older alternative to the more standardised `GET /api/pubs`,
offering different options.

```ts
queryMany: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      pubsById: Record<
        string,
        {
          id: string
          communityId: string
          title: string
          description: string | null
          avatar: string | null
          viewHash: string | null
          editHash: string | null
          scopeSummaryId: string | null
          slug: string
          metadata: {
            mtg_id: string
            bibcode: string
            mtg_presentation_id: string
          } | null
          doi: string | null
          crossrefDepositRecordId: string | null
          attributions?: Attribution[]
          collectionPubs?: CollectionPub[]
          htmlTitle: string | null
          htmlDescription: string | null
          customPublishedAt: string | null
          labels:
            | {
                id: string
                title: string
                color: string
                publicApply: boolean
              }[]
            | null
          downloads:
            | { createdAt: string; type: 'formatted'; url: string }[]
            | null
          reviewHash: string | null
          commentHash: string | null
          draftId: string
          discussions?: Discussion[]
          releases?: Release[]
          isRelease: boolean
          releaseNumber: number | null
          createdAt?: string | undefined
          updatedAt?: string | undefined
        }
      >
      pubIds: string[]
      loadedAllPubs?: number | boolean | null | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-many/post>

##### Parameters

`input`

```ts
{
  alreadyFetchedPubIds: string[]
  pubOptions: {
    getCollections: boolean
    getCommunity: boolean
    getDiscussions: boolean
    getDraft: boolean
    getEdges: 'all' | 'approved-only'
    getEdgesOptions: {
      includeCommunityForPubs?: boolean | undefined
      includeTargetPub?: boolean | undefined
      includePub?: boolean | undefined
    }
    getExports: boolean
    getFacets: boolean
    getMembers: boolean
    getReviews: boolean
    getSubmissions: boolean
    isAuth: boolean
    isPreview: boolean
  }
  query:
    | ({
        collectionIds: string[]
        excludeCollectionIds: string[]
        limit: number
        offset: number
        ordering: {
          direction: 'ASC' | 'DESC'
          field: 'title' | 'collectionRank' | 'updatedDate' | 'creationDate'
        }
        pubIds: string[]
      } & undefined)
    | {
        collectionIds: string[]
        excludeCollectionIds: string[]
        limit: number
        offset: number
        ordering: {
          direction: 'ASC' | 'DESC'
          field: 'title' | 'collectionRank' | 'updatedDate' | 'creationDate'
        }
        pubIds: string[]
      }
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    pubsById: Record<
      string,
      {
        id: string
        communityId: string
        title: string
        description: string | null
        avatar: string | null
        viewHash: string | null
        editHash: string | null
        scopeSummaryId: string | null
        slug: string
        metadata: {
          mtg_id: string
          bibcode: string
          mtg_presentation_id: string
        } | null
        doi: string | null
        crossrefDepositRecordId: string | null
        attributions?: Attribution[]
        collectionPubs?: CollectionPub[]
        htmlTitle: string | null
        htmlDescription: string | null
        customPublishedAt: string | null
        labels:
          | {
              id: string
              title: string
              color: string
              publicApply: boolean
            }[]
          | null
        downloads:
          | {
              createdAt: string
              type: 'formatted'
              url: string
            }[]
          | null
        reviewHash: string | null
        commentHash: string | null
        draftId: string
        discussions?: Discussion[]
        releases?: Release[]
        isRelease: boolean
        releaseNumber: number | null
        createdAt?: string | undefined
        updatedAt?: string | undefined
      }
    >
    pubIds: string[]
    loadedAllPubs?: number | boolean | null | undefined
  }
  headers: Headers
}>
```

#### `pubpub.pub.remove`

`DELETE /api/pubs`

Remove a Pub

```ts
remove: (input, rest?) => Promise<{ status: 200; body: {}; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs/delete>

##### Parameters

`input`

```ts
{
  pubId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {}
  headers: Headers
}>
```

#### `pubpub.pub.text`

Methods for working with the text of a pub

##### `pubpub.pub.text.convert`

`POST /api/pubs/text/convert`

Convert files to a ProseMirror document.

Mostly for use in conjunction with `PUT /api/pubs/:pubId/text`.

```ts
convert: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      doc: {
        type: 'doc'
        content: any[]
        attrs?: Record<string, any> | undefined
      }
      warnings: any[]
      pandocErrorOutput: string
      proposedMetadata: Record<string, any>
      rawMetadata?: Record<string, any> | undefined
    }
    headers: Headers
  }>
```

###### Access

You need to be an **admin** of this community in order to access this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-text-convert/post>

###### Parameters

`input`

```ts
{
  files: {
  }
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

###### Returns

```ts
Promise<{
  status: 200
  body: {
    doc: {
      type: 'doc'
      content: any[]
      attrs?: Record<string, any> | undefined
    }
    warnings: any[]
    pandocErrorOutput: string
    proposedMetadata: Record<string, any>
    rawMetadata?: Record<string, any> | undefined
  }
  headers: Headers
}>
```

##### `pubpub.pub.text.get`

`GET /api/pubs/:pubId/text`

Get the text of a Pub as a ProseMirror document

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      type: 'doc'
      content: any[]
      attrs?: Record<string, any> | undefined
    }
    headers: Headers
  }>
```

###### Access

You need to be an **admin** of this community in order to access this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-pubId-text/get>

###### Parameters

`input`

```ts
{
  params: { pubId: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

###### Returns

```ts
Promise<{
  status: 200
  body: {
    type: 'doc'
    content: any[]
    attrs?: Record<string, any> | undefined
  }
  headers: Headers
}>
```

##### `pubpub.pub.text.import`

`POST /api/pubs/text/import`

Create a pub and upload a file and import it to a pub.

```ts
import: (input, rest?) => Promise<{ status: 201; body: { pub: { id: string; communityId: string; title: string; description: string | null; avatar: string | null; viewHash: string | null; editHash: string | null; scopeSummaryId: string | null; slug: string; metadata: { mtg_id: string; bibcode: string; mtg_presentation_id: string; } | null; doi: string | null; crossrefDepositRecordId: string | null; attributions: { id: string; pubId: string; title: string | null; avatar: string | null; name: string | null; order: number; isAuthor: boolean | null; roles: string[] | null; affiliation: string | null; orcid: string | null; userId: string | null; createdAt?: string | undefined; updatedAt?: string | undefined; }[]; htmlTitle: string | null; htmlDescription: string | null; customPublishedAt: string | null; labels: { id: string; title: string; color: string; publicApply: boolean; }[] | null; downloads: { createdAt: string; type: "formatted"; url: string; }[] | null; reviewHash: string | null; commentHash: string | null; draftId: string; createdAt?: string | undefined; updatedAt?: string | undefined; }; doc: { type: "doc"; content: any[]; attrs?: Record<string, any> | undefined; }; }; headers: Headers; }>;
```

###### Access

You need to be an **admin** of this community in order to access this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-text-import/post>

###### Parameters

`input`

```ts
{
  attributions: boolean | 'match'
  avatar: null | string
  collectionId: string
  customPublishedAt: null | string
  description: null | string
  doi: null | string
  downloads:
    | null
    | {
        createdAt: string
        type: 'formatted'
        url: string
      }[]
  files: {}
  htmlDescription: null | string
  htmlTitle: null | string
  overrideAll: boolean
  overrides:
    | 'title'
    | 'description'
    | 'slug'
    | 'customPublishedAt'
    | ('title' | 'description' | 'slug' | 'customPublishedAt')[]
  pubId: undefined
  slug: string
  title: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

###### Returns

```ts
Promise<{
  status: 201
  body: {
    pub?: Pub
    doc: {
      type: 'doc'
      content: any[]
      attrs?: Record<string, any> | undefined
    }
  }
  headers: Headers
}>
```

##### `pubpub.pub.text.importOld`

`POST /api/pubs/text/importOld`

Create a pub and upload a file and import it to a pub.

```ts
importOld: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      pub?: Pub
      doc: {
        type: 'doc'
        content: any[]
        attrs?: Record<string, any> | undefined
      }
    }
    headers: Headers
  }>
```

###### Access

You need to be an **admin** of this community in order to access this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-text-importOld/post>

###### Parameters

`input`

```ts
{
  pub?: Pub
  sourceFiles: {
    assetKey: string
    clientPath: string
    id: number
    label:
      | 'metadata'
      | 'none'
      | 'supplement'
      | 'document'
      | 'preamble'
      | 'bibliography'
    loaded: number
    state: string
    total: number
  }[]
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

###### Returns

```ts
Promise<{
  status: 201
  body: {
    pub?: Pub
    doc: {
      type: 'doc'
      content: any[]
      attrs?: Record<string, any> | undefined
    }
  }
  headers: Headers
}>
```

##### `pubpub.pub.text.importToPub`

`POST /api/pubs/:pubId/text/import`

Upload files and import it to a pub.

```ts
importToPub: (input, rest) =>
  Promise<{
    status: 200
    body: {
      pub?: Pub
      doc: {
        type: 'doc'
        content: any[]
        attrs?: Record<string, any> | undefined
      }
    }
    headers: Headers
  }>
```

###### Access

You need to be an **admin** of this community in order to access this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-pubId-text-import/post>

###### Parameters

`input`

```ts
{
  attributions: boolean | 'match'
  files: {}
  method: 'replace' | 'overwrite' | 'append' | 'prepend'
  overrideAll: boolean
  overrides:
    | 'title'
    | 'description'
    | 'slug'
    | 'customPublishedAt'
    | ('title' | 'description' | 'slug' | 'customPublishedAt')[]
}
```

`rest`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    pubId: string
  }
}
```

###### Returns

```ts
Promise<{
  status: 200
  body: {
    pub?: Pub
    doc: {
      type: 'doc'
      content: any[]
      attrs?: Record<string, any> | undefined
    }
  }
  headers: Headers
}>
```

##### `pubpub.pub.text.update`

`PUT /api/pubs/:pubId/text`

Replace the text of a pub with a different ProseMirror document

```ts
update: (input, rest) =>
  Promise<
    | {
        status: 200
        body: {
          doc: {
            type: 'doc'
            content: any[]
            attrs?: Record<string, any> | undefined
          }
          url?: string | undefined
        }
        headers: Headers
      }
    | { status: 400; body: { error: string }; headers: Headers }
  >
```

###### Access

You need to be an **admin** of this community in order to access this resource.

###### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs-pubId-text/put>

###### Parameters

`input`

```ts
{
  clientID: string
  doc: {
    attrs: Record<string, any>
    content: any[]
    type: 'doc'
  }
  method: 'replace' | 'overwrite' | 'append' | 'prepend'
  publishRelease: boolean
}
```

`rest`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  params: {
    pubId: string
  }
}
```

###### Returns

```ts
Promise<
  | {
      status: 200
      body: {
        doc: {
          type: 'doc'
          content: any[]
          attrs?: Record<string, any> | undefined
        }
        url?: string | undefined
      }
      headers: Headers
    }
  | {
      status: 400
      body: {
        error: string
      }
      headers: Headers
    }
>
```

#### `pubpub.pub.update`

`PUT /api/pubs`

Update a Pub

```ts
update: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      title?: string | undefined
      description?: string | null | undefined
      avatar?: string | null | undefined
      viewHash?: string | null | undefined
      editHash?: string | null | undefined
      slug?: string | undefined
      metadata?:
        | { mtg_id: string; bibcode: string; mtg_presentation_id: string }
        | null
        | undefined
      doi?: string | null | undefined
      htmlTitle?: string | null | undefined
      htmlDescription?: string | null | undefined
      customPublishedAt?: string | null | undefined
      labels?:
        | { id: string; title: string; color: string; publicApply: boolean }[]
        | null
        | undefined
      downloads?:
        | { createdAt: string; type: 'formatted'; url: string }[]
        | null
        | undefined
      reviewHash?: string | null | undefined
      commentHash?: string | null | undefined
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubs/put>

##### Parameters

`input`

```ts
{
  avatar: null | string
  commentHash: null | string
  customPublishedAt: null | string
  description: null | string
  doi: null | string
  downloads:
    | null
    | {
        createdAt: string
        type: 'formatted'
        url: string
      }[]
  editHash: null | string
  htmlDescription: null | string
  htmlTitle: null | string
  labels:
    | null
    | {
        color: string
        id: string
        publicApply: boolean
        title: string
      }[]
  metadata: null | {
    bibcode: string
    mtg_id: string
    mtg_presentation_id: string
  }
  pubId: string
  reviewHash: null | string
  slug: string
  title: string
  viewHash: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    title?: string | undefined
    description?: string | null | undefined
    avatar?: string | null | undefined
    viewHash?: string | null | undefined
    editHash?: string | null | undefined
    slug?: string | undefined
    metadata?:
      | {
          mtg_id: string
          bibcode: string
          mtg_presentation_id: string
        }
      | null
      | undefined
    doi?: string | null | undefined
    htmlTitle?: string | null | undefined
    htmlDescription?: string | null | undefined
    customPublishedAt?: string | null | undefined
    labels?:
      | {
          id: string
          title: string
          color: string
          publicApply: boolean
        }[]
      | null
      | undefined
    downloads?:
      | {
          createdAt: string
          type: 'formatted'
          url: string
        }[]
      | null
      | undefined
    reviewHash?: string | null | undefined
    commentHash?: string | null | undefined
  }
  headers: Headers
}>
```

### `pubpub.pubAttribution`

#### `pubpub.pubAttribution.batchCreate`

`POST /api/pubAttributions/batch`

Batch create pub attributions

```ts
batchCreate: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      pubId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }[]
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubAttributions-batch/post>

##### Parameters

`input`

```ts
{
  attributions?: Attribution[]
  pubId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    pubId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }[]
  headers: Headers
}>
```

#### `pubpub.pubAttribution.create`

`POST /api/pubAttributions`

Add an attribution to a pub

```ts
create: (input, rest?) =>
  Promise<
    | {
        status: 201
        body: {
          id: string
          pubId: string
          title: string | null
          avatar: string | null
          name: string | null
          order: number
          isAuthor: boolean | null
          roles: string[] | null
          affiliation: string | null
          orcid: string | null
          userId: string | null
          createdAt?: string | undefined
          updatedAt?: string | undefined
        }
        headers: Headers
      }
    | { status: 500; body: string; headers: Headers }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubAttributions/post>

##### Parameters

`input`

```ts
{
  affiliation: null | string
  avatar: null | string
  createdAt: string
  isAuthor: null | boolean
  name: string
  orcid: null | string
  order: number
  pubId: string
  roles: null | string[]
  title: null | string
  updatedAt: string
  userId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<
  | {
      status: 201
      body: {
        id: string
        pubId: string
        title: string | null
        avatar: string | null
        name: string | null
        order: number
        isAuthor: boolean | null
        roles: string[] | null
        affiliation: string | null
        orcid: string | null
        userId: string | null
        createdAt?: string | undefined
        updatedAt?: string | undefined
      }
      headers: Headers
    }
  | {
      status: 500
      body: string
      headers: Headers
    }
>
```

#### `pubpub.pubAttribution.get`

`GET /api/pubAttributions/:id`

Get a pub attribution

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
      pub?: Pub
      user?: User
    }
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubAttributions-id/get>

##### Parameters

`input`

```ts
{
  params: { id: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
  query?:
    | {
        include?: ('pub' | 'user')[] | undefined
        attributes?:
          | (
              | 'id'
              | 'pubId'
              | 'title'
              | 'avatar'
              | 'name'
              | 'order'
              | 'isAuthor'
              | 'roles'
              | 'affiliation'
              | 'orcid'
              | 'userId'
            )[]
          | undefined
      }
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
    pub?: Pub
    user?: User
  }
  headers: Headers
}>
```

#### `pubpub.pubAttribution.getMany`

`GET /api/pubAttributions`

Get multiple pub attributions. You are limited to attributions in your community.

```ts
getMany: (input?) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
      pub?: Pub
      user?: User
    }[]
    headers: Headers
  }>
```

##### Access

You need to be an **admin** of this community in order to access this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubAttributions/get>

##### Parameters

`input?`

```ts
{
  query:
    | ({
        limit?: number | undefined
        offset?: number | undefined
        sortBy?:
          | 'createdAt'
          | 'updatedAt'
          | 'name'
          | 'order'
          | 'affiliation'
          | undefined
        orderBy?: 'ASC' | 'DESC' | undefined
        filter?:
          | {
              id?: string | boolean | string[] | undefined
              pubId?: string | boolean | string[] | undefined
              title?: StringFilter
              avatar?: StringFilter
              name?: StringFilter
              order?: NumberFilter
              isAuthor?: boolean | undefined
              roles?:
                | ( StringFilter
                  )[]
                | undefined
              affiliation?: StringFilter
              orcid?: StringFilter
              userId?: string | boolean | string[] | undefined
              createdAt?: DateFilter
              updatedAt?: DateFilter
            }
          | undefined
        include?: ('pub' | 'user')[] | undefined
        attributes?:
          | (
              | 'id'
              | 'createdAt'
              | 'updatedAt'
              | 'pubId'
              | 'title'
              | 'avatar'
              | 'name'
              | 'order'
              | 'isAuthor'
              | 'roles'
              | 'affiliation'
              | 'orcid'
              | 'userId'
            )[]
          | undefined
      } & {
        id?: string | boolean | string[] | undefined
        pubId?: string | boolean | string[] | undefined
        title?: StringFilter
        avatar?: StringFilter
        name?: StringFilter
        order?: NumberFilter
        isAuthor?: boolean | undefined
        roles?:
          | ( StringFilter
            )[]
          | undefined
        affiliation?: StringFilter
        orcid?: StringFilter
        userId?: string | boolean | string[] | undefined
        createdAt?: DateFilter
        updatedAt?: DateFilter
      })
    | undefined
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
    pub?: Pub
    user?: User
  }[]
  headers: Headers
}>
```

#### `pubpub.pubAttribution.remove`

`DELETE /api/pubAttributions`

Remove a pub attribution

```ts
remove: (input, rest?) =>
  Promise<
    | { status: 200; body: string; headers: Headers }
    | { status: 500; body: string; headers: Headers }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubAttributions/delete>

##### Parameters

`input`

```ts
{
  id: string
  pubId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<
  | {
      status: 200
      body: string
      headers: Headers
    }
  | {
      status: 500
      body: string
      headers: Headers
    }
>
```

#### `pubpub.pubAttribution.update`

`PUT /api/pubAttributions`

Update a pub attribution

```ts
update: (input, rest?) =>
  Promise<
    | {
        status: 200
        body: {
          createdAt?: string | undefined
          updatedAt?: string | undefined
          title?: string | null | undefined
          avatar?: string | null | undefined
          name?: string | null | undefined
          order?: number | undefined
          isAuthor?: boolean | null | undefined
          roles?: string[] | null | undefined
          affiliation?: string | null | undefined
          orcid?: string | null | undefined
          userId?: string | null | undefined
        }
        headers: Headers
      }
    | { status: 500; body: string; headers: Headers }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubAttributions/put>

##### Parameters

`input`

```ts
{
  affiliation: null | string
  avatar: null | string
  createdAt: string
  id: string
  isAuthor: null | boolean
  name: null | string
  orcid: null | string
  order: number
  pubId: string
  roles: null | string[]
  title: null | string
  updatedAt: string
  userId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<
  | {
      status: 200
      body: {
        createdAt?: string | undefined
        updatedAt?: string | undefined
        title?: string | null | undefined
        avatar?: string | null | undefined
        name?: string | null | undefined
        order?: number | undefined
        isAuthor?: boolean | null | undefined
        roles?: string[] | null | undefined
        affiliation?: string | null | undefined
        orcid?: string | null | undefined
        userId?: string | null | undefined
      }
      headers: Headers
    }
  | {
      status: 500
      body: string
      headers: Headers
    }
>
```

### `pubpub.pubEdge`

#### `pubpub.pubEdge.create`

`POST /api/pubEdges`

Create a connection from one pub to another, or to an external publication

```ts
create: (input, rest?) =>
  Promise<{
    status: 201
    body: {
      id: string
      pubId: string
      externalPublicationId: string | null
      targetPubId: string | null
      relationType:
        | 'version'
        | 'comment'
        | 'commentary'
        | 'preprint'
        | 'rejoinder'
        | 'reply'
        | 'review'
        | 'supplement'
        | 'translation'
      rank: string
      pubIsParent: boolean
      approvedByTarget: boolean
      targetPub: {
        id: string
        communityId: string
        title: string
        description: string | null
        avatar: string | null
        viewHash: string | null
        editHash: string | null
        scopeSummaryId: string | null
        slug: string
        metadata: {
          mtg_id: string
          bibcode: string
          mtg_presentation_id: string
        } | null
        doi: string | null
        crossrefDepositRecordId: string | null
        attributions?: Attribution[]
        collectionPubs?: CollectionPub[]
        htmlTitle: string | null
        htmlDescription: string | null
        customPublishedAt: string | null
        labels:
          | { id: string; title: string; color: string; publicApply: boolean }[]
          | null
        downloads:
          | { createdAt: string; type: 'formatted'; url: string }[]
          | null
        reviewHash: string | null
        commentHash: string | null
        draftId: string
        releases?: Release[]
        createdAt?: string | undefined
        updatedAt?: string | undefined
      }
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubEdges/post>

##### Parameters

`input`

```ts
{
  approvedByTarget: undefined | boolean
  externalPublication: null | {
    avatar: undefined | null | string
    contributors: undefined | null | string[]
    description: undefined | null | string
    doi: undefined | null | string
    publicationDate: undefined | null | string
    title: string
    url: string
  }
  pubId: string
  pubIsParent: boolean
  rank: undefined | string
  relationType:
    | 'version'
    | 'comment'
    | 'commentary'
    | 'preprint'
    | 'rejoinder'
    | 'reply'
    | 'review'
    | 'supplement'
    | 'translation'
  targetPubId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    id: string
    pubId: string
    externalPublicationId: string | null
    targetPubId: string | null
    relationType:
      | 'version'
      | 'comment'
      | 'commentary'
      | 'preprint'
      | 'rejoinder'
      | 'reply'
      | 'review'
      | 'supplement'
      | 'translation'
    rank: string
    pubIsParent: boolean
    approvedByTarget: boolean
    targetPub: {
      id: string
      communityId: string
      title: string
      description: string | null
      avatar: string | null
      viewHash: string | null
      editHash: string | null
      scopeSummaryId: string | null
      slug: string
      metadata: {
        mtg_id: string
        bibcode: string
        mtg_presentation_id: string
      } | null
      doi: string | null
      crossrefDepositRecordId: string | null
      attributions?: Attribution[]
      collectionPubs?: CollectionPub[]
      htmlTitle: string | null
      htmlDescription: string | null
      customPublishedAt: string | null
      labels:
        | {
            id: string
            title: string
            color: string
            publicApply: boolean
          }[]
        | null
      downloads:
        | {
            createdAt: string
            type: 'formatted'
            url: string
          }[]
        | null
      reviewHash: string | null
      commentHash: string | null
      draftId: string
      releases?: Release[]
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }
  }
  headers: Headers
}>
```

#### `pubpub.pubEdge.get`

`GET /api/pubEdges/:id`

Get a pubEdge by id

```ts
get: (input) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string
      externalPublicationId: string | null
      targetPubId: string | null
      relationType:
        | 'version'
        | 'comment'
        | 'commentary'
        | 'preprint'
        | 'rejoinder'
        | 'reply'
        | 'review'
        | 'supplement'
        | 'translation'
      rank: string
      pubIsParent: boolean
      approvedByTarget: boolean
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubEdges-id/get>

##### Parameters

`input`

```ts
{
  params: { id: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string
    externalPublicationId: string | null
    targetPubId: string | null
    relationType:
      | 'version'
      | 'comment'
      | 'commentary'
      | 'preprint'
      | 'rejoinder'
      | 'reply'
      | 'review'
      | 'supplement'
      | 'translation'
    rank: string
    pubIsParent: boolean
    approvedByTarget: boolean
  }
  headers: Headers
}>
```

#### `pubpub.pubEdge.remove`

`DELETE /api/pubEdges`

Remove a connection for a pub

```ts
remove: (input, rest?) => Promise<{ status: 200; body: {}; headers: Headers }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubEdges/delete>

##### Parameters

`input`

```ts
{
  pubEdgeId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {}
  headers: Headers
}>
```

#### `pubpub.pubEdge.update`

`PUT /api/pubEdges`

Update a pubEdge

```ts
update: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string
      externalPublicationId: string | null
      targetPubId: string | null
      relationType:
        | 'version'
        | 'comment'
        | 'commentary'
        | 'preprint'
        | 'rejoinder'
        | 'reply'
        | 'review'
        | 'supplement'
        | 'translation'
      rank: string
      pubIsParent: boolean
      approvedByTarget: boolean
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubEdges/put>

##### Parameters

`input`

```ts
{
  approvedByTarget: undefined | boolean
  externalPublication: null | {
    avatar: null | string
    contributors: null | string[]
    description: null | string
    doi: null | string
    id: string
    publicationDate: null | string
    title: string
    url: string
  }
  pubEdgeId: string
  pubId: undefined | string
  pubIsParent: undefined | boolean
  rank: undefined | string
  relationType:
    | undefined
    | 'version'
    | 'comment'
    | 'commentary'
    | 'preprint'
    | 'rejoinder'
    | 'reply'
    | 'review'
    | 'supplement'
    | 'translation'
  targetPubId: null | string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string
    externalPublicationId: string | null
    targetPubId: string | null
    relationType:
      | 'version'
      | 'comment'
      | 'commentary'
      | 'preprint'
      | 'rejoinder'
      | 'reply'
      | 'review'
      | 'supplement'
      | 'translation'
    rank: string
    pubIsParent: boolean
    approvedByTarget: boolean
  }
  headers: Headers
}>
```

#### `pubpub.pubEdge.updateApprovedByTarget`

`PUT /api/pubEdges/approvedByTarget`

Update the approvedByTarget field of a pubEdge

```ts
updateApprovedByTarget: (input, rest?) =>
  Promise<{
    status: 200
    body: {
      id: string
      pubId: string
      externalPublicationId: string | null
      targetPubId: string | null
      relationType:
        | 'version'
        | 'comment'
        | 'commentary'
        | 'preprint'
        | 'rejoinder'
        | 'reply'
        | 'review'
        | 'supplement'
        | 'translation'
      rank: string
      pubIsParent: boolean
      approvedByTarget: boolean
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-pubEdges-approvedByTarget/put>

##### Parameters

`input`

```ts
{
  approvedByTarget: boolean
  pubEdgeId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    id: string
    pubId: string
    externalPublicationId: string | null
    targetPubId: string | null
    relationType:
      | 'version'
      | 'comment'
      | 'commentary'
      | 'preprint'
      | 'rejoinder'
      | 'reply'
      | 'review'
      | 'supplement'
      | 'translation'
    rank: string
    pubIsParent: boolean
    approvedByTarget: boolean
  }
  headers: Headers
}>
```

### `pubpub.release`

#### `pubpub.release.create`

`POST /api/releases`

Create a release

```ts
create: (input, rest?) =>
  Promise<
    | { status: 400; body: string; headers: Headers }
    | {
        status: 201
        body: {
          id: string
          pubId: string
          userId: string
          historyKey: number
          noteContent: {
            type: 'doc'
            content: any[]
            attrs?: Record<string, any> | undefined
          } | null
          noteText: string | null
          docId: string
          historyKeyMissing: boolean
        }
        headers: Headers
      }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-releases/post>

##### Parameters

`input`

```ts
{
  historyKey: number
  noteContent: null | {
    attrs: Record<string, any>
    content: any[]
    type: 'doc'
  }
  noteText: null | string
  pubId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<
  | {
      status: 400
      body: string
      headers: Headers
    }
  | {
      status: 201
      body: {
        id: string
        pubId: string
        userId: string
        historyKey: number
        noteContent: {
          type: 'doc'
          content: any[]
          attrs?: Record<string, any> | undefined
        } | null
        noteText: string | null
        docId: string
        historyKeyMissing: boolean
      }
      headers: Headers
    }
>
```

### `pubpub.upload`

#### `pubpub.upload.file`

`POST /api/upload`

Upload a file to PubPub. For if you want to upload PDFs/images to use as formatted downloads
or within a Pub.

Abuse of this endpoint will result in a ban.

```ts
file: (input, rest?) =>
  Promise<{
    status: 201
    body: { url: string; key: string; size: number }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-upload/post>

##### Parameters

`input`

```ts
{
  file: {
  }
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body: {
    url: string
    key: string
    size: number
  }
  headers: Headers
}>
```

#### `pubpub.upload.policy`

`GET /api/uploadPolicy`

Get upload policy. Used for doing manual uploads.

```ts
policy: (input) =>
  Promise<{
    status: 200
    body: {
      acl: string
      policy: string
      signature: string
      awsAccessKeyId: string
      bucket: string
    }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-uploadPolicy/get>

##### Parameters

`input`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
  query: {
    contentType: string
  }
}
```

##### Returns

```ts
Promise<{
  status: 200
  body: {
    acl: string
    policy: string
    signature: string
    awsAccessKeyId: string
    bucket: string
  }
  headers: Headers
}>
```

### `pubpub.workerTask`

Methods for dealing with worker tasks, i.e. imports and exports

#### `pubpub.workerTask.createExport`

`POST /api/export`

Export a pub to a file. Returns the export task's status.

Requires authentication for unreleased pubs.

This returns an id of an export task. You will have to poll the status of the task to see if
it is complete.

Alternatively, the SDK has a helper function that will poll the status for you, see the
`exportPub` in `@pubpub/sdk`.

```ts
createExport: (input, rest?) =>
  Promise<{
    status: 201
    body: { taskId: string } | { url: string }
    headers: Headers
  }>
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-export/post>

##### Parameters

`input`

```ts
{
  accessHash: null | string
  format:
    | 'html'
    | 'plain'
    | 'json'
    | 'epub'
    | 'odt'
    | 'jats'
    | 'docx'
    | 'tex'
    | 'pdf'
    | 'markdown'
  historyKey: number
  pubId: string
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<{
  status: 201
  body:
    | {
        taskId: string
      }
    | {
        url: string
      }
  headers: Headers
}>
```

#### `pubpub.workerTask.createImport`

`POST /api/import`

Import files to a pub.

This requires you to first upload the files using `/api/upload`, create a Pub using `POST
/api/pubs`, then create an import task using this endpoint, and then ping
`/api/workerTasks?workerTaskId={UUID}` to check the status of the import.

It's much easier to use `/api/pubs/text/import` or `/api/pubs/{pubId}/text/import` instead to
import and create a Pub or just import to a Pub respectively. You can directly upload files
to these endpoints, do not need to poll the status of the import, and, if you are importing
to a Pub, you can determine whether the imported files should be added to the existing Pub or
replace the existing Pub's content.

```ts
createImport: (input, rest?) =>
  Promise<
    | { status: 201; body: string; headers: Headers }
    | { status: 500; body: string; headers: Headers }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-import/post>

##### Parameters

`input`

```ts
{
  importerFlags: {
    extractEndnotes: boolean
    keepStraightQuotes: boolean
    pandocFormat:
      | 'html'
      | 'docx+citations'
      | 'epub'
      | 'markdown+tex_math_dollars'
      | 'odt'
      | 'markdown_strict'
      | 'jats'
      | 'latex'
    skipJatsBibExtraction: boolean
  }
  sourceFiles: {
    assetKey: string
    clientPath: string
    id: number
    label:
      | 'metadata'
      | 'none'
      | 'supplement'
      | 'document'
      | 'preamble'
      | 'bibliography'
    loaded: number
    state: string
    total: number
  }[]
}
```

`rest?`

```ts
{
  cache: RequestCache
  extraHeaders: Record<string, undefined | string>
}
```

##### Returns

```ts
Promise<
  | {
      status: 201
      body: string
      headers: Headers
    }
  | {
      status: 500
      body: string
      headers: Headers
    }
>
```

#### `pubpub.workerTask.get`

`GET /api/workerTasks`

Get the status of a worker task. This is used to poll for the status of a worker task, such
as an import or export.

```ts
get: (input?) =>
  Promise<
    | {
        status: 201
        body: {
          id: string
          isProcessing: boolean | null
          error?: any
          output?: any
        }
        headers: Headers
      }
    | { status: 404; body: { error: 'WorkerTask not found' }; headers: Headers }
  >
```

##### Access

You need to be **logged in** and have access to this resource.

##### Route Documentation

<https://pubpub.org/apiDocs#/paths/api-workerTasks/get>

##### Parameters

`input?`

```ts
{
  query: { workerTaskId: string }
  cache?: RequestCache | undefined
  extraHeaders?:
    | ({
        [x: string]: undefined
        [x: number]: undefined
        [x: symbol]: undefined
      } & Record<string, string | undefined>)
    | undefined
}
```

##### Returns

```ts
Promise<
  | {
      status: 201
      body: {
        id: string
        isProcessing: boolean | null
        error?: any
        output?: any
      }
      headers: Headers
    }
  | {
      status: 404
      body: {
        error: 'WorkerTask not found'
      }
      headers: Headers
    }
>
```

### Other types

#### Attribution

```ts
{
  id: string
  pubId: string
  title: string | null
  avatar: string | null
  name: string | null
  order: number
  isAuthor: boolean | null
  roles: string[] | null
  affiliation: string | null
  orcid: string | null
  userId: string | null
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### CollectionPub

```ts
{
  id: string
  pubId: string
  collectionId: string
  collection: {
    id: string
    communityId: string
    title: string
    avatar: string | null
    viewHash: string | null
    editHash: string | null
    scopeSummaryId: string | null
    slug: string
    isRestricted: boolean | null
    isPublic: boolean | null
    metadata: Record<string, any> | null
    kind: 'tag' | 'issue' | 'book' | 'conference' | null
    doi: string | null
    readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
    layout: Layout
    layoutAllowsDuplicatePubs: boolean
    pageId: string | null
    crossrefDepositRecordId: string | null
    attributions: {
      id: string
      collectionId: string
      title: string | null
      avatar: string | null
      name: string | null
      order: number
      isAuthor: boolean | null
      roles: string[] | null
      affiliation: string | null
      orcid: string | null
      userId: string | null
      createdAt?: string | undefined
      updatedAt?: string | undefined
    }[]
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }
  rank: string
  contextHint: string | null
  pubRank: string
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### Discussion

```ts
{
  number: number
  id: string
  pubId: string | null
  title: string | null
  labels: string[] | null
  userId: string | null
  isClosed: boolean | null
  threadId: string
  visibilityId: string
  anchorId: string | null
  commenterId: string | null
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### Release

```ts
{
  id: string
  pubId: string
  userId: string
  historyKey: number
  noteContent: {
    type: 'doc'
    content: any[]
    attrs?: Record<string, any> | undefined
  } | null
  noteText: string | null
  docId: string
  historyKeyMissing: boolean
}
```

#### Pub

```ts
{
  id: string
  communityId: string
  title: string
  description: string | null
  avatar: string | null
  viewHash: string | null
  editHash: string | null
  scopeSummaryId: string | null
  slug: string
  metadata: {
    mtg_id: string
    bibcode: string
    mtg_presentation_id: string
  } | null
  doi: string | null
  crossrefDepositRecordId: string | null
  attributions: {
    id: string
    pubId: string
    title: string | null
    avatar: string | null
    name: string | null
    order: number
    isAuthor: boolean | null
    roles: string[] | null
    affiliation: string | null
    orcid: string | null
    userId: string | null
    createdAt?: string | undefined
    updatedAt?: string | undefined
  }[]
  htmlTitle: string | null
  htmlDescription: string | null
  customPublishedAt: string | null
  labels:
    | {
        id: string
        title: string
        color: string
        publicApply: boolean
      }[]
    | null
  downloads:
    | {
        createdAt: string
        type: 'formatted'
        url: string
      }[]
    | null
  reviewHash: string | null
  commentHash: string | null
  draftId: string
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### Member

```ts
{
  id: string
  pubId: string | null
  collectionId: string | null
  communityId: string | null
  organizationId: string | null
  userId: string
  permissions: 'view' | 'edit' | 'manage' | 'admin'
  isOwner: boolean | null
  subscribedToActivityDigest: boolean
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### Page

```ts
{
  id: string
  communityId: string
  title: string
  description: string | null
  avatar: string | null
  viewHash: string | null
  slug: string
  isPublic: boolean
  layout: Layout
  layoutAllowsDuplicatePubs: boolean
  isNarrowWidth: boolean | null
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### Community

```ts
{
  id: string
  subdomain: string
  domain: string | null
  title: string
  citeAs: string | null
  publishAs: string | null
  description: string | null
  avatar: string | null
  favicon: string | null
  accentColorLight: string
  accentColorDark: string
  hideCreatePubButton: boolean | null
  headerLogo: string | null
  headerLinks:
    | { title: string; url: string; external?: boolean | undefined }[]
    | null
  headerColorType: 'light' | 'dark' | 'custom' | null
  useHeaderTextAccent: boolean | null
  hideHero: boolean | null
  hideHeaderLogo: boolean | null
  heroLogo: string | null
  heroBackgroundImage: string | null
  heroBackgroundColor: string | null
  heroTextColor: string | null
  useHeaderGradient: boolean | null
  heroImage: string | null
  heroTitle: string | null
  heroText: string | null
  heroPrimaryButton: { title: string; url: string } | null
  heroSecondaryButton: { title: string; url: string } | null
  heroAlign: string | null
  navigation:
    | (
        | { id: string; type: 'collection' | 'page' }
        | { id: string; title: string; href: string }
        | {
            id: string
            title: string
            children: (
              | { id: string; type: 'collection' | 'page' }
              | { id: string; title: string; href: string }
            )[]
          }
      )[]
    | null
  hideNav: boolean | null
  navLinks:
    | (
        | { id: string; type: 'collection' | 'page' }
        | { id: string; title: string; href: string }
        | {
            id: string
            title: string
            children: (
              | { id: string; type: 'collection' | 'page' }
              | { id: string; title: string; href: string }
            )[]
          }
      )[]
    | null
  footerLinks:
    | (
        | { id: string; type: 'collection' | 'page' }
        | { id: string; title: string; href: string }
        | {
            id: string
            title: string
            children: (
              | { id: string; type: 'collection' | 'page' }
              | { id: string; title: string; href: string }
            )[]
          }
      )[]
    | null
  footerLogoLink: string | null
  footerTitle: string | null
  footerImage: string | null
  website: string | null
  facebook: string | null
  twitter: string | null
  email: string | null
  issn: string | null
  isFeatured: boolean | null
  viewHash: string | null
  editHash: string | null
  premiumLicenseFlag: boolean | null
  defaultPubCollections: string[] | null
  spamTagId: string | null
  organizationId: string | null
  scopeSummaryId: string | null
  accentTextColor: string
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### Collection

```ts
{
  id: string
  communityId: string
  title: string
  avatar: string | null
  viewHash: string | null
  editHash: string | null
  scopeSummaryId: string | null
  slug: string
  isRestricted: boolean | null
  isPublic: boolean | null
  metadata: Record<string, any> | null
  kind: 'tag' | 'issue' | 'book' | 'conference' | null
  doi: string | null
  readNextPreviewSize: 'none' | 'minimal' | 'medium' | 'choose-best'
  layout: Layout
  layoutAllowsDuplicatePubs: boolean
  pageId: string | null
  crossrefDepositRecordId: string | null
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
```

#### User

```ts
{
  id: string
  title: string | null
  avatar: string | null
  website: string | null
  facebook: string | null
  twitter: string | null
  slug: string
  orcid: string | null
  firstName: string
  lastName: string
  fullName: string
  initials: string
  bio: string | null
  publicEmail: string | null
  authRedirectHost: string | null
  location: string | null
  github: string | null
  googleScholar: string | null
}
```

#### Review

```ts
{
  number: number
  id: string
  pubId: string | null
  title: string | null
  status: 'open' | 'closed' | 'completed'
  userId: string | null
  threadId: string
  visibilityId: string
  releaseRequested: boolean | null
  reviewContent: {
    type: 'doc'
    content: any[]
    attrs?: Record<string, any> | undefined
  } | null
  labels?: unknown
}
```

#### Submission

```ts
{
  id: string
  pubId: string
  status: 'received' | 'incomplete' | 'accepted' | 'declined'
  submittedAt: string | null
  submissionWorkflowId: string
  abstract: {
    type: 'doc'
    content: any[]
    attrs?: Record<string, any> | undefined
  } | null
}
```

#### Draft

```ts
{
  id: string
  latestKeyAt: string | null
  firebasePath: string
}
```

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

* \[ ] Add CORS
* \[ ] Add CRUD methods for discussions
* \[ ] Reorder some methods (make attributions a submethod of pub, for example)

## FAQ

### How do I get the ID of my community/page/collection?

You can use the [PubPub ID Finder](https://pubpub.tefkah.com/) to find the ID of a community, page, or collection.

### Can I run this in the browser?

While the SDK was designed to also be run in the browser, we are not yet sending CORS headers correctly, so this may not work.

## License

GPL-3.0+, PubPub


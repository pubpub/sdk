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

Replace `00000000-0000-0000-0000-000000000000` with the model’s `id`. To identify the `id` of a community, page, or collection, you may use the [PubPub ID Finder](https://pubpub.tefkah.com/).

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

- `limit`: `10`
- `offset`: `0`

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

- `orderBy`: `createdAt`
- `sortBy`: `DESC`

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

> [!NOTE]
> Specifying `includes` will override the default includes.

> [!NOTE]
> The return type will not change based on the `includes` parameter. This means that even though you might have specified `includes: ['pubAttributions']`, the return type will have `pubAttribubtions?: PubAttribution[]` instead of `pubAttributions: PubAttribution[]`.

##### Attributes

Maybe you don't need all the attributes of a model, and you want to save some bandwidth. You can do this by providing an `attributes` parameter to your query. This parameter is an array of attributes you want to include in the response.

> [!NOTE]
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

####### `number` | `Date`

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

# How docs are generated

## How to

Roughly like this

1. `cd core`
2. Run `npm run generate-docs`
3. Commit changes
4. `cd ..`
5. `pnpm generate-docs`
6. Commit changes

Tadah! Very easy and error proof totally not a brittle process.

## What happens

### Generating JSDoc comments

We use `typedoc` to generate Markdown files. Typedoc uses a combination of JSDoc comments and TypeScript types to generate documentation.

We don't write JSDoc comments by hand. In the contract definitions we are already writing descriptions etc of the API routes, we just reuse those to generate the JSDoc comments.

This happens using a kind of convoluted Typescript compiler script, located at `core/tools/generateJSDoc.ts`. See [this PR](https://github.com/pubpub/pubpub/pull/2937) for more info on what happens here.

### Using typedoc to generate documentation.

This is a slightly convoluted process, here's the gist:

In `typedoc.json`
https://github.com/pubpub/sdk/blob/9b180496a58980f70ac08579050004c377dcf3de/typedoc.json#L1-L20

- we specify that we look at `docgen/toBeGeneratedTypes.ts` for the types we want to generate.
- we want to use `typedoc-plugin-markdown` to generate markdown files
- we output them to `docgen/docs`
- and some other things that aren't very important

So, we just run `typedoc`, and it will generate the files! Easy as.

You can look at the output yourself by looking at e.g. `docgen/docs/interfaces/Client.md`.

#### Why specify the types we in `docgen/toBeGeneratedTypes.ts`?

You might ask: why don't we just point it to the main class in `src/lib/client.ts` and be done with it?

I'd say: try it! Run `pnpm typedoc src/lib/client.ts` and see what happens!

If you do so, you'll see you'll generate two files: `docgen/docs/classes/Client.md` and `docgen/docs/interfaces/PubPubSDK.md`.

The problem is that all the things we did in https://github.com/pubpub/pubpub/pull/2937 to generate the JSDoc comments and preserve them when we run `pnpm build` here, kind of work against us when we try to generate the docs.

In the output, we want Typescript to not dereference the types, so the JSDoc comments are preserved. But, here, we would like that to happen, because otherwise we get types like this:

````md
### collectionAttribution

```ts
readonly collectionAttribution: ProxiedClient<RecursiveProxyObj<RecursivelyApplyOptions<CollectionAttributionRouter, {
  strictStatusCodes: true;
}>, InitClientArgs>>;
```
````

````

I don't know about you, but I don't find `ProxiedClient<RecursiveProxyObj<RecursivelyApplyOptions<CollectionAttributionRouter, { strictStatusCodes: true; }>, InitClientArgs>>` to be particularly helpful in understanding how to use the SDK.
Even if we were to provide a link to the definition of `ProxiedClient` etc, it would still be a bit of a pain to navigate and probably would not teach you jack shit!

So, we have to help `typedoc` a little in expanding the types, which is what we do in `docgen/toBeGeneratedTypes.ts`.

In particular, we do this

https://github.com/pubpub/sdk/blob/101ab56a59a7ce33e51ce10b8fd160aa9a77bd60/docgen/toBeGeneratedTypes.ts#L5-L10

We sort of "spread" the type, and then run this `Prettify` type on the internal types. This `Prettify` helper type is pretty well known, it's basically this

```ts
type Prettify<T extends Record<string, any>> = {
  [K in keyof T]: T[K]
} & {}
````

For some reason this forces Typescript to "print" out the resulting type, dereferencing the types mentioned.

No idea why, but it works!

##### Why the `@interface` tags

Astute observation! They "force" `typedoc` to document types as interfaces, which results in way more in depth documentation. That's why basically, otherwise `typedoc` gets kinda lazy with it and just prints the type and the jsdoc comments, now it spreads it out by property etc.

##### Why the specifc nested types

As you can see here

https://github.com/pubpub/sdk/blob/101ab56a59a7ce33e51ce10b8fd160aa9a77bd60/docgen/toBeGeneratedTypes.ts#L12-L30

We specify the `Collection` and `Pub` types specifically, in order for them to be exported on their own.

This is bc because they contain nested routers, namely `collection.doi`, `pub.doi`, and `pub.text`. All of these have their own methods, but typedoc only documents these one layer down.

If we did not specify them manually, we'd get something like

````md
### pubpub.pub

#### pubpub.pub.text

```ts
text: {
    get: // ...
    import: // ...
    convert: // ...
}
```

#### pubpub.pub.update
````

As you can see, these subrouters do not get their own documentation.

For reference, this is what we want:

```md
### pubpub.pub

#### pubpub.pub.text

##### pubpub.pub.text.get

<-- documentation for pubpub.pub.text.get -->

##### pubpub.pub.text.update

<-- documentation for pubpub.pub.text.update -->

etc.

#### pubpub.pub.update
```

All the subrouters also being documented in the same way as the main router.

To accomplish that, we have them generate on their own, and then merge them later.

### Manual prettification

The docs, by default, are a bit hard to read (again, see the output of `pnpm typedoc`).

To remedy this, we do a number of things to make the result easier to read. Most of this happens in `docgen/formatDocs.mts`.

In short, we roughly

- Run a global search and replace up front
- Do some targeted transformations using `remark`/`unified`.
- Run `prettier`, then run another global search and replace.

The exact details aren't as important, but here's a non-exhaustive list of things we do:

#### Replace big repeating types with named types

Often the output of a `CRUD` operation in our API returns a model. Since all types are dereferenced, these models are often very long and hard to read.

In the final search and replace (`docgen/utils/postprocessingFix.ts`) we replace these with a named type.

https://github.com/pubpub/sdk/blob/9b180496a58980f70ac08579050004c377dcf3de/docgen/utils/postprocessingFix.ts#L31-L67

We collect these named types and put them at the end of the API section of the README.

We do the same with certain filters for `getMany` operations here

https://github.com/pubpub/sdk/blob/9b180496a58980f70ac08579050004c377dcf3de/docgen/utils/postprocessingFix.ts#L31-L67

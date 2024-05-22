# Development

These are internal notes for the development of the project.

## Installation

Install dependencies

```bash
pnpm i
```

Setup environment correctly

```bash
cp .env.example .env
```

Look in the usual place for the relevant variables.

## Running tests

Before running tests, make sure you load the environment variables from the `.env` file.

```bash
source .env
```

> [!NOTE]
> This is only necessary because I cannot for the life of me find out how to load the environment variables from the `.env` file in the `jest.config.ts` file.

Then, to run the tests, run

```bash
pnpm test
```

## Generating updated documentation

To generate the updated documentation, run

```bash
pnpm generate-docs
```

## Publishing

Just run

```bash
pnpm publish
```

This will create a new release in the `changeset` package.

# fullstack application template

## Dependencies

- Docker / Docker compose
- pnpm / Node.js
- Deno

## How to add sub packages

```
# package.json on root dir

  "scripts": {
    "db": "pnpm -F \"@db\""
  },

```

## How to run script in sub packages

```
pnpm db <command>
```

## How to install packages

```
pnpm db add -E drizzle-kit
```

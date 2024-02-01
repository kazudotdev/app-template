# fullstack application template

## Dependencies

- Docker / Docker compose
- Bun / (Node.js)

## How to add sub packages

```
mkdir packages/xx
cd packages/xx
bun init
bun add yyy
```

## How to run script in sub packages

```
bun run <pkg> <command>

## bun run db generate
```

## How to install packages

```
bun --cwd packages/xxx add <pkg>
```

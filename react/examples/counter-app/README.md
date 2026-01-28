# Counter App (CLI Example)

A minimal CLI counter example that demonstrates state, actions, and invariants using the shared React-like hooks library in this repo. It renders the current state and the set of allowed actions as Markdown in the terminal and accepts commands interactively.

## Prerequisites
- Bun installed (https://bun.sh)
- Node.js and npm (for building the shared library)

## Build the shared library
This example imports from `react/lib/dist` and `react/lib/src`, so you must build the library first.

From the repository root:

```bash
npm install --prefix react/lib
npm run build --prefix react/lib
```

This compiles the library to `react/lib/dist` which the example uses at runtime.

## Run the example
From the repository root:

```bash
bun run react/examples/counter-app/counter.ts
```

You will see Markdown output similar to:

```
# Current State

```json
{
  "count": 0
}
```

# Allowed Actions
1. Increment

# Goals
- Demonstrate basic counter functionality
```

The prompt `>` will appear for interactive commands.

## Usage
- Type an action name and press Enter. Action matching is case-insensitive.
- Type `exit` to quit.

### Available actions
- `Increment` — always allowed; increases `count` by 1.
- `Decrement` — allowed only when `count > 0`; decreases `count` by 1.

After each command, the app re-renders the state and allowed actions.

## Examples
```
> increment
# Current State
{
  "count": 1
}

# Allowed Actions
1. Increment
2. Decrement

> decrement
# Current State
{
  "count": 0
}

# Allowed Actions
1. Increment

> exit
Goodbye!
```

## Invariants
The app enforces that `count` is never negative. Attempts to execute actions that would violate invariants will log an error and leave the state unchanged.

## Troubleshooting
- If you see import/path errors for `react/lib/dist`, ensure you have built the library:
  - `npm install --prefix react/lib`
  - `npm run build --prefix react/lib`
- Ensure Bun is installed and available on your PATH (`bun --version`).
- If TypeScript resolution issues occur, re-run the build in `react/lib`.


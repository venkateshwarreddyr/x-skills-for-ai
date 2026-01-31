# Svelte Counter Example

This is a full Svelte app demonstrating the `@x-skills-for-ai/svelte` wrapper.

## Folder Structure

```
examples/svelte/svelte-counter/
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ index.html
└─ src/
   ├─ main.ts
   ├─ App.svelte
   └─ Counter.svelte
```

## Run Locally

1. Install dependencies at monorepo root:

```bash
cd ram
npm install
```

2. Build packages:

```bash
npm run build:all
```

3. Run the dev server:

```bash
npm run dev:svelte-example
```

Or:

```bash
cd examples/svelte/svelte-counter
npm run dev
```

4. Open [http://localhost:5173/svelte-counter/](http://localhost:5173/svelte-counter/)

## Features

- Increment/Decrement counter with Svelte stores.
- `useXSkill` registers `increment` and `decrement` skills.
- Skills executable via buttons or browser console:

```js
window.__XSKILLS__.execute("increment")
window.__XSKILLS__.execute("decrement")
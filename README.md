# XSkills

Apps were built for humans first — browsers, buttons, and screens.
Now AI is starting to interact with software as a user.

This raises an interesting question: how should apps expose functionality to AI?

With x-skills-for-ai, apps expose skills instead of screens — structured actions with clear inputs and predictable execution.

These skills can be built using familiar tools like React, Angular, or Svelte.
The UI is optional and mainly used as a developer surface.

**UIs are for humans. Skills are for AI.**

## Links

- **Core Package**: https://www.npmjs.com/package/@x-skills-for-ai/core
- **React Package**: https://www.npmjs.com/package/@x-skills-for-ai/react
- **Source Code & Examples**: https://github.com/venkateshwarreddyr/x-skills-for-ai

Framework-agnostic runtime to expose intention-based skills (clicks, forms, flows) to AI agents and automation across React, Svelte, Angular, Playwright.

## Demo

https://github.com/user-attachments/assets/6722b1fc-9113-4770-915b-fed7f40c0f0b


## Quick Example

**React:**

[`useXSkill`](packages/react/src/useXSkill.ts)

```tsx
import { useXSkill } from "@x-skills-for-ai/react";

function Counter() {
  const [count, setCount] = useState(0);

  useXSkill({
    id: "increment",
    description: "Increment counter",
    handler: async (input?: {by?: number}) => {
      const by = input?.by ?? 1;
      setCount(c => c + by);
    }
  });

  return <div>
    <h1>{count}</h1>
    <button>+</button>
  </div>;
}
```

**Execute:**

```js
window.__XSKILLS__.execute("increment", {by: 10});
```

## Installation

### Core
```bash
npm install @x-skills-for-ai/core
```

### React
```bash
npm install @x-skills-for-ai/react
```

### Svelte
```bash
npm install @x-skills-for-ai/svelte
```

### Angular
```bash
npm install @x-skills-for-ai/angular
```

### Playwright Adapter
```bash
npm install @x-skills-for-ai/playwright-adapter
```

## How it works

1. Register skills in components using framework hooks.
2. Global [`window.__XSKILLS__`](packages/core/src/xskills.runtime.ts) runtime manages them.
3. Inspect: `runtime.inspect()` & Execute: `runtime.execute(id)`.

## API

[`getXSkillsRuntime`](packages/core/src/index.ts)

```ts
import { getXSkillsRuntime } from "@x-skills-for-ai/core";

const runtime = getXSkillsRuntime();
runtime.register({ id, description, handler });
await runtime.execute("id", {input: "data"});
```

## Support

| Framework | Package |
|-----------|---------|
| React | [@x-skills-for-ai/react](packages/react) |
| Svelte | [@x-skills-for-ai/svelte](packages/svelte) |
| Angular | [@x-skills-for-ai/angular](packages/angular) |
| Playwright | [@x-skills-for-ai/playwright-adapter](adapters/playwright) |

## Examples

- [React Counter](examples/react/react-counter)
- [Playwright Counter](examples/playwright/example1)

## Status

- ✅ Core runtime v1.0+
- ✅ Framework integrations (React, Svelte, Angular)
- ✅ Playwright adapter v1.1+
- 🚧 Comprehensive docs
- 🚧 More examples & adapters

## Non-Goals

- Replaces Playwright/Cypress
- Server-side
- UI framework

## Development

This is an npm workspaces monorepo.

### Setup
```bash
npm install
```

### Build all packages
```bash
npm run build:all
```

### Development

- React example: `cd examples/react/react-counter && npm i && npm run dev`
- Playwright example: `cd examples/playwright/example1 && npm i && npx playwright test`

## License

MIT

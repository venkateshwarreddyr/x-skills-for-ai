# XSkills

Framework-agnostic runtime to expose intention-based skills (clicks, forms, flows) to AI agents and automation across React, Svelte, Angular, Playwright.

## Quick Example

**React:**

[`useXSkill`](packages/react/src/useXSkill.ts)

```tsx
import { useXSkill } from \"@x-skills-for-ai/react\";

function Counter() {
  const [count, setCount] = useState(0);

  useXSkill({
    id: \"increment\",
    description: \"Increment counter\",
    handler: () => setCount(c => c + 1)
  });

  return <div>
    <h1>{count}</h1>
    <button>+</button>
  </div>;
}
```

**Execute:**

```js
window.__XSKILLS__.execute(\"increment\");
```

## Installation

```bash
npm install @x-skills-for-ai/react
```

## How it works

1. Register skills in components using framework hooks.
2. Global [`window.__XSKILLS__`](packages/core/src/xskills.runtime.ts) runtime manages them.
3. Inspect: `runtime.inspect()` & Execute: `runtime.execute(id)`.

## API

[`getXSkillsRuntime`](packages/core/src/index.ts)

```ts
import { getXSkillsRuntime } from \"@x-skills-for-ai/core\";

const runtime = getXSkillsRuntime();
runtime.register({ id, description, handler });
await runtime.execute(\"id\");
```

## Support

| Framework | Package |
|-----------|---------|
| React | [@x-skills-for-ai/react](packages/react) |
| Svelte | [@x-skills-for-ai/svelte](packages/svelte) |
| Angular | [@x-skills-for-ai/angular](packages/angular) |

## Examples

- [React](examples/react/react-counter)
- [Playwright](examples/playwright-example)

## Status

- ✅ Core v1.0+
- ✅ Framework wrappers
- 🚧 Docs & more adapters

## Non-Goals

- Replaces Playwright/Cypress
- Server-side
- UI framework

## Contributing

```bash
cd examples/react/react-counter
npm install
npm run dev
```

## License

MIT

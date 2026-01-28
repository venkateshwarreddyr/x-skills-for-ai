# XSkills Project — Multi-Framework Architecture

## 1. Objective

* Build a **core runtime** (`xskills-core`) that is **framework/library agnostic**.
* Provide **framework-specific wrappers**:
  * React: `xskills-react`
  * Svelte: `xskills-svelte`
  * Angular: `xskills-angular`
* LLMs, Playwright, and Node APIs can interact with the **core runtime**.
* Apps can **register skills** and **execute them** regardless of framework.
* Skills are **intention-based**, inspectable, and deterministic.
* Framework wrappers provide **convenient hooks or directives** to register skills.

## 2. Core Design Principles

1. **Framework Agnostic Core**
   * No React, Svelte, or Angular imports in core.
   * Pure JS/TS runtime: registration, execution, inspection.
2. **Wrapper Packages Are Optional**
   * Only provide lifecycle integration.
   * No logic duplication.
3. **Global Runtime**
   * `window.__XSKILLS__` is the single runtime instance per browser.
4. **Skill Isolation**
   * Skills are registered/unregistered via owner or component.
5. **LLM/Automation Friendly**
   * Skills can be executed programmatically via Node, Playwright, WebView, Electron, or browser console.

## 3. Folder / Module Structure

```
xskills/
├─ packages/
│  ├─ core/                     <-- framework agnostic core
│  │   ├─ src/
│  │   │   ├─ xskills.runtime.ts
│  │   │   ├─ xskills.register.ts
│  │   │   └─ index.ts
│  │   ├─ package.json
│  │   └─ README.md
│  │
│  ├─ react/                    <-- React wrapper
│  │   ├─ src/
│  │   │   ├─ useXSkill.ts      <-- React hook for registration
│  │   │   └─ index.ts
│  │   ├─ package.json
│  │   └─ README.md
│  │
│  ├─ svelte/                   <-- Svelte wrapper
│  │   ├─ src/
│  │   │   ├─ useXSkill.svelte  <-- Svelte action/helper
│  │   │   └─ index.ts
│  │   ├─ package.json
│  │   └─ README.md
│  │
│  └─ angular/                  <-- Angular wrapper
│      ├─ src/
│      │   ├─ xskills.directive.ts
│      │   └─ index.ts
│      ├─ package.json
│      └─ README.md
│
├─ package.json                  <-- monorepo root (yarn/npm workspace)
└─ README.md
```

## 4. Core Package: xskills-core

### Responsibilities

* Skill registration / unregistration
* Skill execution
* Skill inspection
* Global runtime (`window.__XSKILLS__`)
* Safe for LLMs/Playwright

### Public API

[`getXSkillsRuntime()`](xskills/packages/core/src/index.ts) and [`XSkillDefinition`](xskills/packages/core/src/types.ts)

```ts
import { getXSkillsRuntime, XSkillDefinition } from "xskills-core"

// Register skill
const unregister = getXSkillsRuntime().register({
  id: "increment",
  description: "Increment counter",
  handler: () => console.log("Incremented!")
})

// Execute skill
await getXSkillsRuntime().execute("increment")

// Inspect
const skills = getXSkillsRuntime().inspect()

// Unregister
unregister()
```

## 5. Framework Wrappers

### 5.1 React (`xskills-react`)

* Provides `useXSkill(skill: XSkillDefinition)` hook
* Registers skill on mount, unregisters on unmount

**Example:**

```tsx
import { useXSkill } from "xskills-react"

useXSkill({
  id: "increment",
  description: "Increase counter",
  handler: () => setCount(c => c + 1)
})
```

### 5.2 Svelte (`xskills-svelte`)

* Provides `useXSkill` action/helper
* Registers skill on mount, unregisters on destroy

**Example:**

```svelte
<script>
  import { useXSkill } from "xskills-svelte"

  let count = 0

  useXSkill({
    id: "increment",
    description: "Increase counter",
    handler: () => count += 1
  })
</script>

<h1>{count}</h1>
<button on:click={() => count += 1}>Increment</button>
```

### 5.3 Angular (`xskills-angular`)

* Provides `XSkillDirective` or service
* Skills are registered/unregistered with component lifecycle

**Example:**

```ts
@Component({...})
export class CounterComponent {
  constructor(private xskills: XSkillsService) {}

  ngOnInit() {
    this.xskills.register({
      id: "increment",
      description: "Increment counter",
      handler: () => this.count++
    })
  }
}
```

## 6. LLM / Automation Integration

* Node exposes HTTP API
* Uses Playwright / Puppeteer / Electron to call:

```ts
window.__XSKILLS__.inspect()
window.__XSKILLS__.execute("increment")
```

* No DOM scraping
* Deterministic and safe

## 7. Versioning & Publishing Strategy

* **Monorepo with workspaces** (yarn or npm)
* `core` published first
* Each wrapper depends on `core`
* Minor versions for wrapper updates
* Core version bump triggers wrapper updates

## 8. Success Criteria

1. Core works **without React/Svelte/Angular**
2. Each wrapper works with **its framework lifecycle**
3. LLMs / Playwright can **inspect/execute skills**
4. Skills are **intention-based** and **deterministic**
5. Easy for developers to integrate into **existing apps**
6. No DOM hacks or framework coupling in core

## 9. Examples

### [`react-counter`](examples/react-counter/)

Full Vite + React + TypeScript app demonstrating [`xskills-react`](xskills/packages/react/).

#### Quickstart

```bash
# From xskills/ root
npm install
npm run build:all
npm run dev:react-example
```

Or:

```bash
cd examples/react-counter
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000)

#### Key Implementation

[`examples/react-counter/src/Counter.tsx`](examples/react-counter/src/Counter.tsx):

```tsx
import React, { useState } from "react"
import { useXSkill } from "xskills-react"

export function Counter() {
  const [count, setCount] = useState(0)

  // Register increment skill
  useXSkill({
    id: "increment",
    description: "Increase counter",
    handler: () => setCount(c => c + 1)
  })

  // Register decrement skill
  useXSkill({
    id: "decrement",
    description: "Decrease counter",
    handler: () => setCount(c => c - 1)
  })

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  )
}
```

#### LLM/Automation Test

Browser console or Playwright:

```js
window.__XSKILLS__.inspect()
window.__XSKILLS__.execute("increment")
window.__XSKILLS__.execute("decrement")
```


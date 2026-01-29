# @x-skills-for-ai/playwright-adapter

A thin, deterministic bridge between Playwright and `window.__XSKILLS__`.

Not a test framework. Not a selector abstraction. Not AI magic.

## Install

```bash
npm i -D @x-skills-for-ai/playwright-adapter @playwright/test
```

Peer dependency: `@x-skills-for-ai/core` (your app provides the runtime in the browser)

## Minimal API

This package augments Playwright's `Page`:

```ts
await page.executeSkill(skillId: string, payload?: unknown): Promise<void>
await page.inspectSkills(): Promise<{ id: string; description?: string }[]>
```

## Usage

### 1) Using the provided fixture

```ts
// tests/example.spec.ts
import { withXSkills } from '@x-skills-for-ai/playwright-adapter'

const test = withXSkills
const { expect } = test

test('increments counter via skill', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.executeSkill('increment')
})
```

### 2) Manual attach in your own fixtures

```ts
import { test as base } from '@playwright/test'
import { attachXSkills } from '@x-skills-for-ai/playwright-adapter'

export const test = base.extend({
  page: async ({ page }, use) => {
    attachXSkills(page)
    await use(page)
  },
})
```

## Error handling

- Errors bubble up and fail the test.
- No retries. No heuristics.

## Notes

- Works when your app registers skills, e.g. via a framework wrapper that exposes `window.__XSKILLS__`.
- If the runtime is not present, `executeSkill` throws an error.

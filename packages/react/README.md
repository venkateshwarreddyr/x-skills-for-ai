# @x-skills-for-ai/react

React integration for [@x-skills-for-ai/core](..).

## Installation

```
npm install @x-skills-for-ai/react
```

## Usage

```tsx
import React, { useState } from 'react';
import { useXSkill } from '@x-skills-for-ai/react';

function Counter() {
  const [count, setCount] = useState(0);

  useXSkill({
    id: 'increment',
    description: 'Increase counter by 1',
    handler: () => setCount(c => c + 1)
  });

  return (
    <div>
      <h1>Count: {count}</h1>
      <p>Open the browser console and run: await window.__XSKILLS__.execute('increment') (see Global Runtime Access)</p>
    </div>
  );
}
```

See [example.tsx](example.tsx) for full code.

The hook automatically registers the skill on mount and unregisters on unmount.

## Global Runtime Access

[`getXSkillsRuntime()`](../core/src/index.ts) from `@x-skills-for-ai/core` provides access to the global singleton [`XSkillsRuntime`](../core/src/xskills.runtime.ts).

### With import:
```ts
import { getXSkillsRuntime } from '@x-skills-for-ai/core';

const runtime = getXSkillsRuntime();
await runtime.execute('increment');

// Inspect registered skills
console.log(runtime.inspect());
```

### Browser console:
```js
await window.__XSKILLS__.execute('increment');
console.log(window.__XSKILLS__.inspect());
```

**Note:** Only available in browser environments.

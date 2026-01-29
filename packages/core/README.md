# @x-skills-for-ai/core

Framework agnostic core runtime.

## Installation

```
npm install @x-skills-for-ai/core
```

## Usage

```ts
import { getXSkillsRuntime, XSkillDefinition } from '@x-skills-for-ai/core';

const runtime = getXSkillsRuntime();

const unregister = runtime.register({
  id: 'example',
  description: 'Example skill',
  handler: async (input) => {
    console.log('Executed with input:', input);
  }
});

await runtime.execute('example', { message: 'Hello!' });

console.log(runtime.inspect());

unregister();
```

Runtime is available as `window.__XSKILLS__`.

See root README for full docs.

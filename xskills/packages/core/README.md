# xskills-core

Framework agnostic core runtime.

## Installation

```
npm install xskills-core
```

## Usage

```ts
import { getXSkillsRuntime, XSkillDefinition } from 'xskills-core';

const runtime = getXSkillsRuntime();

const unregister = runtime.register({
  id: 'example',
  description: 'Example skill',
  handler: async () => {
    console.log('Executed!');
  }
});

await runtime.execute('example');

console.log(runtime.inspect());

unregister();
```

Runtime is available as `window.__XSKILLS__`.

See root README for full docs.

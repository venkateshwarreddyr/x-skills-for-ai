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
      <p>Open console and run: await getXSkillsRuntime().execute('increment')</p>
    </div>
  );
}
```

See [example.tsx](example.tsx) for full code.

The hook automatically registers the skill on mount and unregisters on unmount.

# xskills-react

React integration for [xskills-core](..).

## Installation

```
npm install xskills-react xskills-core react react-dom
```

## Usage

```tsx
import React, { useState } from 'react';
import { useXSkill } from 'xskills-react';

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

# xskills-svelte

Svelte integration for [xskills-core](..).

## Installation

```
npm install xskills-svelte xskills-core svelte
```

## Usage

```svelte
<script lang="ts">
  import { useXSkill } from 'xskills-svelte';

  let count = 0;

  useXSkill({
    id: 'increment',
    description: 'Increase counter by 1',
    handler: () => count += 1
  });
</script>

<h1>Count: {count}</h1>
<p>Open console and run: await getXSkillsRuntime().execute('increment')</p>
```

See [example.svelte](example.svelte).

Call `useXSkill` at top-level in `<script>`. It uses `onMount`/`onDestroy` internally.

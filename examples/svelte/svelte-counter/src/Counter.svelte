<script lang="ts">
  import { useXSkill } from '@x-skills-for-ai/svelte'
  import { writable } from 'svelte/store'

  let count = writable(0)

  useXSkill({
    id: 'increment',
    description: 'Increase counter',
    handler: async () => {
      count.update(c => c + 1)
    }
  })

  useXSkill({
    id: 'decrement',
    description: 'Decrease counter',
    handler: async () => {
      count.update(c => c - 1)
    }
  })

  function inc() {
    count.update(c => c + 1)
  }

  function dec() {
    count.update(c => c - 1)
  }
</script>

<h2 data-testid="count">Counter: {$count}</h2>
<button on:click={inc}>Increment</button>
<button on:click={dec}>Decrement</button>
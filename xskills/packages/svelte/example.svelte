<script lang="ts">
  import { useXSkill } from './src/useXSkill';

  let count = 0;

  useXSkill({
    id: 'increment',
    description: 'Increase the counter by 1',
    handler: () => count += 1
  });
</script>

<h1>Count: {count}</h1>
<p>Open console and run: await getXSkillsRuntime().execute('increment')</p>
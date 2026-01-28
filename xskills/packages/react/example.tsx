import React, { useState } from 'react';
import { useXSkill } from './src/useXSkill';

/**
 * Example React component demonstrating useXSkill.
 * Run with Vite or similar to test.
 * Execute skill via console: await window.__XSKILLS__.execute('increment')
 */
export function CounterExample() {
  const [count, setCount] = useState(0);

  useXSkill({
    id: 'increment',
    description: 'Increase the counter by 1',
    handler: () => setCount((c) => c + 1)
  });

  return (
    <div>
      <h1>Count: {count}</h1>
      <p>Try executing the skill in console: getXSkillsRuntime().execute('increment')</p>
    </div>
  );
}
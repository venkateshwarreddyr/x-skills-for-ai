// exp/x-skills-for-ai/browser/examples/counter/app.js
// Counter example app using React

import React, { useState, useEffect } from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18?dev';

function CounterApp() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.globalAppState = { count };
  }, [count]);

  useEffect(() => {
    window.useSkill({
      id: "increment",
      description: "Increase counter by 1",
      handler: () => setCount(c => c + 1)
    });

    window.useSkill({
      id: "decrement",
      description: "Decrease counter by 1",
      handler: () => setCount(c => c - 1)
    });

    window.useSkill({
      id: "reset",
      description: "Reset counter to 0",
      handler: () => setCount(0)
    });

    window.getAppState = () => window.globalAppState || { count: 0 };

    window.getMarkdownView = () => {
      const state = window.globalAppState || { count: 0 };
      return `# Counter Demo

## Current Count
**${state.count}**

## Skills
- \`increment\`: Increase by 1
- \`decrement\`: Decrease by 1
- \`reset\`: Reset to 0

**State:** \`${JSON.stringify(state)}\``;
    };
  }, []);

  return React.createElement('div', null, React.createElement('h2', null, 'Counter Demo'));
}

const initApp = () => {
  const rootEl = document.getElementById('root');
  if (rootEl && !rootEl._reactRoot) {
    const root = createRoot(rootEl);
    root.render(React.createElement(CounterApp));
    rootEl._reactRoot = true;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Backward compatibility
window.App = CounterApp;

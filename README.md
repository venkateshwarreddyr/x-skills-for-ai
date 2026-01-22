# RAM - React-like Framework for AI Context

**RAM** is a JavaScript/TypeScript library that allows developers to build **AI-compatible reactive applications**, similar to React, but instead of rendering HTML, it generates **Markdown/JSON context windows** for AI agents.

It supports hooks, actions, invariants, workflows, and integrates with external libraries for building deterministic, AI-operable systems.

> **RAM does for AI what React did for browsers — but at the decision layer, not the view layer.**

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
- [Documentation](#documentation)
- [Core Concepts](#core-concepts)
- [Who This Is For](#who-this-is-for)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install ram-ai
```

or in TypeScript project:

```bash
yarn add ram-ai
```

---

## Quick Start

```ts
import { useState, useEffect } from 'ram-ai/hooks';
import { renderMarkdown } from 'ram-ai/renderer';

function MyAIApp() {
  const [state, setState] = useState({ counter: 0 });

  useEffect(() => {
    console.log('Counter changed:', state.counter);
  }, [state.counter]);

  const actions = [
    {
      name: 'Increment',
      requires: () => true,
      effects: (state) => ({ ...state, counter: state.counter + 1 }),
    },
  ];

  const goals = ['Increment the counter'];

  const markdown = renderMarkdown({ state, allowedActions: actions, goals });

  return { markdown, allowedActions: actions, state };
}
```

This creates an AI-compatible app that returns a Markdown context, current state, and allowed actions for AI interaction.

---

## Examples

- **[Employee Onboarding](examples/employee-onboarding/)**: Complete workflow with actions, invariants, and checkpoints.
- **[Todo App](examples/todo-app/)**: Simple task management with AI interactions.
- **[Counter App](examples/counter-app/)**: Basic state management example.
- **[Workflow App](examples/workflow-app/)**: Advanced workflow integration.

Run any example:

```bash
cd examples/employee-onboarding
npm install
npm run build
npm start
```

---

## Core Concepts

- **AIComponent**: Functions that output Markdown/JSON context.
- **Hooks**: `useState`, `useEffect`, `useContext`, etc., adapted for AI stability.
- **Actions**: Allowed interactions with constraints and effects.
- **Invariants**: Business rules that must hold.
- **Workflows**: State machines for multi-step processes.
- **Rendering**: Markdown/JSON output for AI consumption.

---

## Who This Is For

- Backend engineers building AI-integrated systems.
- Platform teams needing deterministic workflows.
- AI infrastructure builders.
- Domains with multi-step flows, constraints, and AI-human collaboration.

If your app has workflows, constraints, or needs AI to operate reliably, RAM is for you.

---

## Contributing

Contributions welcome! See examples for patterns, and ensure new features include tests and documentation.

---

## License

MIT

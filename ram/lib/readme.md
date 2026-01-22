Perfect — let’s create a **comprehensive README-style documentation** for building this **AI-React framework** — a library that behaves like React but renders **Markdown/JSON for AI**, supports **hooks, effects, external libraries, and Redux**, and is fully developer-friendly.

---

# 📘 [RAM] — React-Like Framework for AI Context

**[RAM]** is a JavaScript/TypeScript library that allows developers to build **AI-compatible reactive applications**, similar to React, but instead of rendering HTML, it generates **Markdown/JSON context windows** for AI agents.

It supports:

* Hooks: `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` (AI-adapted versions)
* Declarative **actions, invariants, goals**
* Integration with **Redux** or other JS state management libraries
* Calling external JS libraries / MCPs safely
* Composable **AIComponents**

---

## **Table of Contents**

1. [Installation](#installation)
2. [Core Concepts](#core-concepts)
3. [Hooks](#hooks)
4. [Advanced Hooks for AI Stability](#advanced-hooks-for-ai-stability)
5. [Actions & Effects](#actions--effects)
6. [Invariants & Allowed Actions](#invariants--allowed-actions)
7. [Rendering AI Context](#rendering-ai-context)
8. [External Libraries & Redux](#external-libraries--redux)
9. [Example App](#example-app)
10. [Best Practices](#best-practices)

---

## **Installation**

```bash
npm install ram-ai
```

or in TypeScript project:

```bash
yarn add ram-ai
```

---

## **Core Concepts**

| Concept            | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| **AIComponent**    | Function that reads state and outputs Markdown/JSON context   |
| **State**          | Workflow state (entities, actions, status)                    |
| **Effects**        | Functions that mutate state or trigger MCPs                   |
| **Actions**        | Allowed interactions by AI or humans, may have forms (inputs) |
| **Invariants**     | Constraints that must hold for safe state transitions         |
| **Goals**          | High-level objectives the AI should achieve                   |
| **Context Window** | Markdown/JSON rendered from state for AI to “see”             |

---

## **Hooks**

### `useState`

```ts
const [state, setState] = useState(initialState);
```

* `state` — current workflow state
* `setState(newState)` — updates state and triggers re-render of Markdown context

### `useEffect`

```ts
useEffect(() => {
  console.log('State changed', state);
}, [state]);
```

* Runs side-effects whenever dependencies change
* Can call MCPs, external JS libraries, or trigger Redux actions

### Advanced Hooks for AI Stability

RAM provides `useContext`, `useMemo`, and `useCallback` to ensure **context stability, safety, and determinism**, not just performance.

#### `useContext`

Shares **global state**, **policies**, **tools**, or **memory** across AIComponents. Avoids prop-drilling context-heavy AI data. Enables **capability-based access** for safety.

```ts
const AgentContext = createContext<AgentContextType>(defaultValue);

function App() {
  return (
    <AgentContext.Provider value={agentConfig}>
      <EmployeeIncomeAIApp />
    </AgentContext.Provider>
  );
}

function EmployeeIncomeAIApp() {
  const agent = useContext(AgentContext);
}
```

Context changes **must trigger re-render of AI context**. Context is part of **context window**, not just runtime config.

#### `useMemo`

Prevents re-computing **large summaries**. Stabilizes **context output** to reduce token churn. Improves determinism in agent reasoning.

```ts
const incomeSummary = useMemo(
  () => summarizeIncomes(state.employee.incomes),
  [state.employee.incomes]
);
```

**Key Difference from React:** Context stability optimization, not performance. Avoid **token noise**. Must be pure.

#### `useCallback`

Actions and effects must have **stable identity**. Prevents accidental re-registration of actions. Enables caching & auditability.

```ts
const addIncome = useCallback(
  (payload) => executeAction(AddIncome, payload),
  []
);
```

**Difference from React:** Preserves action identity for safety & traceability, not performance.

---

## **Actions & Effects**

```ts
type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};
```

* **requires:** Boolean function, determines if action is allowed
* **effects:** Function that updates state when action is executed
* **inputs:** Optional form fields (payload)

---

### **Example: Add Income**

```ts
const AddIncome: Action = {
  name: 'AddIncome',
  requires: (state) => state.employee.status !== 'NEW',
  inputs: [
    { name: 'source', type: 'string', required: true },
    { name: 'amount', type: 'number', required: true },
    { name: 'date', type: 'string', required: true },
  ],
  effects: (state, payload) => ({
    ...state,
    employee: {
      ...state.employee,
      incomes: [...state.employee.incomes, { ...payload, status: 'PENDING' }],
    },
  }),
};
```

---

## **Invariants & Allowed Actions**

* **Invariants:** Functions that enforce safe state

```ts
const invariants = [
  (state) => {
    if (state.employee.incomes.some(i => i.amount < 0))
      throw new Error('Income cannot be negative');
  }
];
```

* **Allowed actions:** Computed dynamically

```ts
const allowedActions = getAllowedActions(state, [AddIncome, VerifyIncome]);
```

---

## **Rendering AI Context**

Use `renderMarkdown` to generate **AI-readable context**:

```ts
const markdown = renderMarkdown({
  state,
  allowedActions,
  goals: ['Verify all incomes', 'Employee onboarding complete']
});
```

**Example Output:**

```markdown
# Current State
{
  "employee": {
    "name": "John Doe",
    "status": "ACTIVE",
    "incomes": []
  }
}

# Allowed Actions
1. AddIncome
   - Form fields:
     - source (string) [required]
     - amount (number) [required]
     - date (string) [required]

# Goals
- Verify all incomes
- Employee onboarding complete
```

---

## **External Libraries & Redux**

* You can use **any JS/TS library** inside `effects` or `useEffect`

```ts
import axios from 'axios';

useEffect(() => {
  axios.post('/log', state);
}, [state]);
```

* **Redux integration:**

```ts
import { createStore } from 'redux';

const store = createStore(reducer);

useEffect(() => {
  store.dispatch({ type: 'UPDATE_STATE', payload: state });
}, [state]);
```

* **Use Redux for global state**, `useState` for local component state

---

## **Example App: Employee Income**

```ts
function EmployeeIncomeAIApp(initialEmployee) {
  const [state, setState] = useState(initialEmployee);

  const actions = [AddIncome, VerifyIncome];
  const allowedActions = getAllowedActions(state, actions);

  useEffect(() => checkInvariants(state, invariants), [state]);

  return renderMarkdown({
    state,
    allowedActions,
    goals: ['Verify all incomes', 'Employee onboarding complete'],
  });
}
```

---

## **Best Practices**

1. **Always define invariants** for safe state transitions
2. **Use inputs for any dynamic forms** — AI can fill them
3. **Use Redux for global state**, AIComponents for local state
4. **Compose AIComponents** — like React Components
5. **Render Markdown / JSON** — keep AI context clear and structured
6. **Use useEffect for side-effects / MCP calls**

---

✅ **[RAM] is essentially: React + XState + Markdown/JSON context + hooks + effects for AI.**

* Hooks = reactive state
* Actions = clickable or fillable forms
* Effects = update state or trigger MCPs
* Markdown = AI “DOM”

---

If you want, I can **also draft a folder structure + starter code** for this library like React does, with hooks, renderer, and Redux integration, so you could **npm install and start building AI apps immediately**.

Do you want me to do that next?

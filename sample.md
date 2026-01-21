Perfect — since you’re comfortable with JS/TS, we can design a **minimal yet extendable AILang compiler** in Node.js. I’ll give you a **project structure**, explain each piece, and show how the pipeline flows from **AILang → IR → AI context / MCP actions**.

---

# 1️⃣ Proposed Project Structure

```
ailang/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts                  # CLI / entrypoint
│  ├─ parser/
│  │   ├─ ailang.pegjs          # PEG grammar for AILang
│  │   └─ parser.ts             # Parser wrapper: AILang text → AST
│  ├─ ir/
│  │   └─ ir.ts                 # IR definitions (State, Action, Workflow, Transition)
│  ├─ compiler/
│  │   ├─ compiler.ts            # AST → IR → AI context / MCP code
│  │   └─ contextGenerator.ts   # Generate JSON context for LLM
│  ├─ mcp/
│  │   └─ adapters.ts           # MCP integration (stub for now)
│  ├─ runtime/
│  │   ├─ stateManager.ts       # In-memory or DB-backed state
│  │   ├─ eventLog.ts           # Logs emitted events
│  │   └─ executor.ts           # Executes actions, updates state, emits events
│  └─ utils/
│      └─ helpers.ts            # Common helpers (UUID, date formatting, etc.)
├─ examples/
│  └─ todo.ail                  # Todo app workflow example
└─ README.md
```

---

# 2️⃣ Pipeline Flow

```text
AILang file (.ail)
        |
        v
    Parser (PEG) 
        |
        v
AST (Abstract Syntax Tree)
        |
        v
Compiler / IR Builder
        |
        v
IR (Intermediate Representation)
        |
        v
Context Generator → AI context JSON
        |
        v
Executor → updates state / emits events / calls MCP
```

---

# 3️⃣ Component Responsibilities

### 1️⃣ **Parser** (`src/parser/`)

* Input: `.ail` text
* Output: AST
* Tools: [PEG.js](https://pegjs.org/) or [nearley](https://nearley.js.org/)
* Minimal example:

```ts
import peg from "pegjs";
import fs from "fs";

export function parseAILang(filePath: string) {
  const grammar = fs.readFileSync(__dirname + "/ailang.pegjs", "utf8");
  const parser = peg.generate(grammar);
  const text = fs.readFileSync(filePath, "utf8");
  return parser.parse(text);
}
```

---

### 2️⃣ **IR** (`src/ir/`)

Defines structured objects representing your workflow:

```ts
export type StateField = { name: string; type: string; optional?: boolean };
export type State = { name: string; fields: StateField[] };

export type Action = {
  name: string;
  inputs: Record<string, string>;
  requires: string[]; // preconditions
  effects: string[];  // state updates
  emits: string[];    // events
};

export type Workflow = {
  name: string;
  transitions: { from: string; to: string; action: string }[];
};
```

---

### 3️⃣ **Compiler / Context Generator** (`src/compiler/`)

* Takes AST → generates IR
* Generates **AI-compatible context JSON** (current state + allowed actions + constraints)
* Optional: generates **stub MCP adapters**

Example context generator:

```ts
export function generateAIContext(todo: any, user: any, actions: Action[]) {
  const allowedActions = actions.filter(action => {
    // naive evaluation of requires
    return action.requires.every(cond => evalCondition(cond, { Todo: todo, User: user }));
  });

  return {
    state: { Todo: todo, User: user },
    allowed_actions: allowedActions.map(a => ({ name: a.name, constraints: a.requires })),
    recent_events: [],
    goal: "Complete the todo"
  };
}
```

---

### 4️⃣ **Runtime / Executor** (`src/runtime/`)

* Stores current state (in-memory for now)
* Executes actions → updates state + emits events
* Optional: persists state to DB later
* Can call MCP adapters if integrated

```ts
export function executeAction(actionName: string, input: any, state: any, actions: Action[]) {
  const action = actions.find(a => a.name === actionName);
  if (!action) throw new Error("Action not found");

  // validate requires
  const valid = action.requires.every(cond => evalCondition(cond, state));
  if (!valid) throw new Error("Constraints not satisfied");

  // execute effects (simplified)
  action.effects.forEach(effect => applyEffect(effect, state));

  // emit events
  action.emits.forEach(event => console.log(`Event emitted: ${event}`));
}
```

---

### 5️⃣ **MCP Integration Stub** (`src/mcp/adapters.ts`)

```ts
export const MCP = {
  payments: {
    charge: (amount: number) => console.log(`Charging ${amount}`)
  },
  email: {
    send: (to: string, body: string) => console.log(`Email sent to ${to}: ${body}`)
  }
};
```

---

### 6️⃣ **Example Todo App** (`examples/todo.ail`)

```ailang
state Todo {
    id: string
    title: string
    status: PENDING | IN_PROGRESS | DONE
}

action StartTodo(todo_id: string) {
    requires Todo.status == PENDING
    effect Todo.status = IN_PROGRESS
    emit EventTodoStarted(todo_id)
}

action CompleteTodo(todo_id: string) {
    requires Todo.status == IN_PROGRESS
    effect Todo.status = DONE
    emit EventTodoCompleted(todo_id)
}

workflow TodoLifecycle {
    start -> StartTodo
    StartTodo -> CompleteTodo
}
```

---

### 7️⃣ CLI Entrypoint (`src/index.ts`)

```ts
import { parseAILang } from "./parser/parser";
import { generateAIContext } from "./compiler/contextGenerator";
import fs from "fs";

const filePath = process.argv[2] || "examples/todo.ail";
const ast = parseAILang(filePath);

// TODO: convert AST → IR
const ir = astToIR(ast);

// Example AI context
const todo = { id: "42", title: "Write blog", status: "PENDING" };
const user = { id: "user_1", role: "MEMBER" };
console.log(JSON.stringify(generateAIContext(todo, user, ir.actions), null, 2));
```

---

# ✅ Notes

* Start **simple**: in-memory + JSON context + console logs
* Once working, swap **stateManager.ts** with DB or Temporal
* Once workflows are stable, integrate **MCP adapters**
* AI will consume **context JSON** → safe deterministic actions

---

If you want, I can **write the first fully working parser + IR + context generator** in JS for the Todo app so you can run `node src/index.js examples/todo.ail` immediately.

Do you want me to do that next?

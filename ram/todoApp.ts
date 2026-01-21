// todoApp.ts
import { useAIState, useAIEffect, getAllowedActions, renderMarkdown, checkInvariants, Action } from './aiReact';

type Todo = { id: string; title: string; done: boolean };
type State = { todos: Todo[] };

// Actions
const AddTodo: Action = {
  name: 'AddTodo',
  requires: (state: State) => true,
  effects: (state: State, payload?: { title: string }) => ({
    ...state,
    todos: [...state.todos, { id: crypto.randomUUID(), title: payload?.title || 'New Task', done: false }],
  }),
  payloadSchema: { title: 'string' },
};

const CompleteTodo: Action = {
  name: 'CompleteTodo',
  requires: (state: State) => state.todos.some((t) => !t.done),
  effects: (state: State) => ({
    ...state,
    todos: state.todos.map((t) => ({ ...t, done: true })),
  }),
};

// Invariants
const invariants = [
  (state: State) => {
    if (state.todos.length > 10) throw new Error('Cannot have more than 10 todos');
  },
];

// App Component
function TodoAIApp() {
  const [state, setState] = useAIState({ todos: [] });

  const actions = [AddTodo, CompleteTodo];
  const allowedActions = getAllowedActions(state, actions);

  useAIEffect(() => {
    checkInvariants(state, invariants);
  }, [state]);

  const markdown = renderMarkdown({
    state,
    allowedActions,
    goals: ['Complete all todos'],
  });

  return markdown;
}

// Simulate AI interacting
let markdown = TodoAIApp();
console.log(markdown);

// Execute an action
const [state, setState] = useAIState({ todos: [] });
const allowed = getAllowedActions(state, [AddTodo, CompleteTodo]);
const nextState = allowed[0].effects(state);
console.log(renderMarkdown({ state: nextState, allowedActions: [AddTodo, CompleteTodo], goals: ['Complete all todos'] }));
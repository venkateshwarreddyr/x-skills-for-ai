// Example Todo App using the AI-compatible framework

import { State, Action, Invariant, MCP } from '../../src/runtime/types';
import { executeAction, getAllowedActions } from '../../src/runtime/engine';
import { generateAIContext, generateMarkdownContext } from '../../src/runtime/contextGenerator';

// Define entity types
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type User = {
  name: string;
  todos: Todo[];
};

// Initial state
const initialState: State = {
  User: {
    name: 'Alice',
    todos: []
  }
};

// Actions
const addTodo: Action = {
  name: 'AddTodo',
  requires: (state) => true, // Always allowed
  effects: (state) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: 'New Todo',
      completed: false
    };
    return {
      ...state,
      User: {
        ...state.User,
        todos: [...state.User.todos, newTodo]
      }
    };
  }
};

const completeTodo: Action = {
  name: 'CompleteTodo',
  requires: (state) => state.User.todos.some((t: Todo) => !t.completed),
  effects: (state) => {
    const todos = state.User.todos.map((t: Todo) =>
      !t.completed ? { ...t, completed: true } : t
    );
    return {
      ...state,
      User: {
        ...state.User,
        todos
      }
    };
  }
};

// Invariants
const noEmptyTodos: Invariant = {
  name: 'NoEmptyTodos',
  check: (state) => {
    if (state.User.todos.some((t: Todo) => t.text.trim() === '')) {
      throw new Error('Todos cannot be empty');
    }
  }
};

// MCP example (mock)
const emailMCP: MCP = {
  name: 'EmailMCP',
  execute: async (args) => {
    console.log('Sending email:', args);
    return { success: true };
  }
};

// Framework setup
const actions = [addTodo, completeTodo];
const invariants = [noEmptyTodos];
const mcps = [emailMCP];

// Demo
async function demo() {
  let state = initialState;

  console.log('Initial State:');
  console.log(JSON.stringify(state, null, 2));

  // Generate AI context
  const context = generateAIContext(state, actions, invariants, ['Complete all todos']);
  console.log('\nAI Context (Markdown):');
  console.log(generateMarkdownContext(context));

  // Execute AddTodo
  console.log('\nExecuting AddTodo...');
  const result1 = await executeAction(addTodo, state, invariants, mcps);
  if (result1.success) {
    state = result1.newState;
    console.log('New State:', JSON.stringify(state, null, 2));
  } else {
    console.log('Error:', result1.error);
  }

  // Check allowed actions
  const allowed = getAllowedActions(state, actions);
  console.log('\nAllowed Actions:');
  allowed.forEach(aa => {
    console.log(`${aa.action.name}: ${aa.allowed ? 'Yes' : 'No'}${aa.reason ? ' - ' + aa.reason : ''}`);
  });

  // Execute CompleteTodo
  console.log('\nExecuting CompleteTodo...');
  const result2 = await executeAction(completeTodo, state, invariants, mcps);
  if (result2.success) {
    state = result2.newState;
    console.log('Final State:', JSON.stringify(state, null, 2));
  } else {
    console.log('Error:', result2.error);
  }
}

demo().catch(console.error);
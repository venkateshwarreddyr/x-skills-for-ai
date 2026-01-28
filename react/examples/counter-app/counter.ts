/// <reference types="node" />
import { useState, useEffect, resetHooks } from '../../lib/dist/index.js';
import { Action, getAllowedActions, checkInvariants, renderMarkdown, executeAction } from '../../lib/src';
import * as readline from 'readline';
// Define actions
const incrementAction: Action = {
  name: 'Increment',
  requires: () => true,
  effects: (state) => ({ ...state, count: state.count + 1 }),
};

const decrementAction: Action = {
  name: 'Decrement',
  requires: (state) => state.count > 0,
  effects: (state) => ({ ...state, count: state.count - 1 }),
};

// Invariants
const invariants = [
  (state: any) => {
    if (state.count < 0) throw new Error('Count cannot be negative');
  },
];



function CounterApp(actionInput?: string): string {
  resetHooks(CounterApp);
  const [state, setState] = useState({ count: 0 });

  const actions = [incrementAction, decrementAction];

  if (actionInput) {
    const action = actions.find(a => a.name.toLowerCase() === actionInput.toLowerCase());
    if (action) {
      try {
        const newState = executeAction(state, action);
        setState(newState);
      } catch (error) {
        console.error(`Error executing action ${actionInput}: ${(error as Error).message}`);
      }
    } else {
      console.log(`No action found for ${actionInput}`);
    }
  }

  const allowedActions = getAllowedActions(state, actions);

  useEffect(() => {
    checkInvariants(state, invariants);
  }, [state]);

  return renderMarkdown({
    state,
    allowedActions,
    goals: ['Demonstrate basic counter functionality'],
  });
}

// Interactive CLI using CounterApp component
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayState() {
  const output = CounterApp();
  console.log(output);
}

displayState();
rl.setPrompt('> ');
rl.prompt();

rl.on('line', (input) => {
  const cmd = input.trim().toLowerCase();
  if (cmd === 'exit') {
    rl.close();
    return;
  }
  CounterApp(cmd);
  displayState();
  rl.prompt();
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
import { useState, useEffect, resetHooks } from '../../lib/dist';
import { Action, getAllowedActions, checkInvariants, renderMarkdown, executeAction } from '../../lib/dist';
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

// Function to handle LLM response
function handleLLMResponse(llmResponse: string, state: any, setState: (newState: any) => void, actions: Action[]) {
  const action = actions.find(a => a.name === llmResponse);
  if (action) {
    try {
      const newState = executeAction(state, action);
      setState(newState);
    } catch (error) {
      console.error(`Error executing action ${llmResponse}: ${(error as Error).message}`);
    }
  } else {
    console.log(`No action found for LLM response: ${llmResponse}`);
  }
}

// AIComponent
function CounterApp(): string {
  const [state, setState] = useState({ count: 0 });

  const actions = [incrementAction, decrementAction];
  const allowedActions = getAllowedActions(state, actions);

  useEffect(() => {
    checkInvariants(state, invariants);
  }, [state]);

  // Example: Simulate LLM response
  // In a real app, this would be triggered by actual LLM output
  // handleLLMResponse('Increment', state, setState, actions);

  return renderMarkdown({
    state,
    allowedActions,
    goals: ['Demonstrate basic counter functionality'],
  });
}

// Main interactive function
function main() {
  let state = { count: 0 };
  const actions = [incrementAction, decrementAction];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function displayState() {
    const allowedActions = getAllowedActions(state, actions);
    const output = renderMarkdown({
      state,
      allowedActions,
      goals: ['Demonstrate basic counter functionality'],
    });
    console.log(output);
    console.log('Available commands: increment, decrement, exit');
  }

  function processCommand(command: string) {
    if (command === 'exit') {
      rl.close();
      return;
    }

    const action = actions.find(a => a.name.toLowerCase() === command);
    if (action) {
      try {
        checkInvariants(state, invariants);
        state = executeAction(state, action);
        console.log(`Executed: ${action.name}`);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
      }
    } else {
      console.log(`Unknown command: ${command}`);
    }
    displayState();
    rl.prompt();
  }

  displayState();
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', (input) => {
    processCommand(input.trim().toLowerCase());
  });

  rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
}

// Run the interactive app
main();
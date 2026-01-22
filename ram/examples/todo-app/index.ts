import * as readline from 'readline';
import { TodoApp } from './app';
import { addTodo, toggleTodo, deleteTodo, clearCompleted } from './actions';
import { Action } from './lib/src/types';

const actions = [addTodo, toggleTodo, deleteTodo, clearCompleted];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function runApp() {
  while (true) {
    console.clear();
    const appResult = TodoApp();
    console.log(appResult.markdown);

    const allowedActions = appResult.allowedActions;

    console.log('\nChoose an action (number) or "exit" to quit:');
    const choice = await prompt('> ');

    if (choice.toLowerCase() === 'exit') {
      rl.close();
      break;
    }

    const actionIndex = parseInt(choice) - 1;
    if (isNaN(actionIndex) || actionIndex < 0 || actionIndex >= allowedActions.length) {
      console.log('Invalid choice. Press enter to continue.');
      await prompt('');
      continue;
    }

    const selectedAction = allowedActions[actionIndex];

    let payload: any = {};
    if (selectedAction.inputs) {
      for (const input of selectedAction.inputs) {
        if (input.required) {
          const value = await prompt(`${input.name} (${input.type}): `);
          payload[input.name] = input.type === 'string' ? value : JSON.parse(value);
        }
      }
    }

    // Execute action by calling TodoApp with action and payload
    TodoApp(selectedAction, payload);
  }
}

runApp().catch(console.error);
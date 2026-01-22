import * as readline from 'readline';
import { TodoApp } from './app';
import { addTodo, toggleTodo, deleteTodo, clearCompleted } from './actions';
import { Action } from './lib/src/types';
import { InMemorySaver, createCheckpoint } from './checkpoint';

const actions = [addTodo, toggleTodo, deleteTodo, clearCompleted];

const saver = new InMemorySaver();
const threadId = 'todo-session';

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
    const currentState = appResult.state;

    // Save checkpoint after each render
    const checkpoint = createCheckpoint(currentState, appResult.markdown, allowedActions, { action: 'render' });
    saver.put(threadId, checkpoint);

    console.log('\nChoose an action (number), "checkpoints" to list checkpoints, or "exit" to quit:');
    const choice = await prompt('> ');

    if (choice.toLowerCase() === 'exit') {
      rl.close();
      break;
    }

    if (choice.toLowerCase() === 'checkpoints') {
      const checkpoints = saver.list(threadId);
      console.log('\nCheckpoints:');
      checkpoints.forEach((cp, index) => {
        console.log(`${index + 1}. ${cp.id} - ${cp.timestamp} - ${cp.metadata?.action || 'render'}`);
      });
      console.log('Press enter to continue.');
      await prompt('');
      continue;
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

    // Save checkpoint after action execution
    const postActionResult = TodoApp();
    const postActionCheckpoint = createCheckpoint(postActionResult.state, postActionResult.markdown, postActionResult.allowedActions, { action: selectedAction.name, payload });
    saver.put(threadId, postActionCheckpoint);
  }
}

runApp().catch(console.error);
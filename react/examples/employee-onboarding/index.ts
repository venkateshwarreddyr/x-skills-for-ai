import * as readline from 'readline';
import { EmployeeOnboardingApp } from './app';
const { InMemorySaver, createCheckpoint } = require('../lib/dist/checkpoint');

const saver = new InMemorySaver();
const threadId = 'onboarding-session';

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
    const appResult = EmployeeOnboardingApp();
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
      const checkpoints = await saver.list(threadId);
      console.log('\nCheckpoints:');
      checkpoints.forEach((cp: any, index: number) => {
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

    // Collect inputs if needed
    let payload: any = {};
    if (selectedAction.inputs) {
      for (const input of selectedAction.inputs) {
        if (input.required) {
          const value = await prompt(`Enter ${input.name} (${input.type}): `);
          payload[input.name] = input.type === 'number' ? parseFloat(value) : value;
        }
      }
    }

    // Execute action
    const postActionResult = EmployeeOnboardingApp(selectedAction, payload);
    const postActionCheckpoint = createCheckpoint(postActionResult.state, postActionResult.markdown, postActionResult.allowedActions, { action: selectedAction.name, payload });
    saver.put(threadId, postActionCheckpoint);
  }
}

runApp().catch(console.error);
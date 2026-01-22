import * as readline from 'readline';
import { spawn } from 'child_process';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('\nSelect an app to run:');
  console.log('1. Todo App');
  console.log('2. Counter App');
  console.log('3. Exit');
}

function processCommand(command: string) {
  if (command === '1') {
    console.log('Running Todo App...');
    rl.close();
    const child = spawn('npx', ['ts-node', '../examples/todo-app/index.ts'], { stdio: 'inherit', cwd: __dirname });
    child.on('close', () => {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      displayMenu();
      rl.setPrompt('> ');
      rl.prompt();
      rl.on('line', (input) => {
        processCommand(input.trim());
      });
      rl.on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
      });
    });
  } else if (command === '2') {
    console.log('Running Counter App...');
    rl.close();
    const child = spawn('npx', ['ts-node', '../examples/counter-app/counter.ts'], { stdio: 'inherit', cwd: __dirname });
    child.on('close', () => {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      displayMenu();
      rl.setPrompt('> ');
      rl.prompt();
      rl.on('line', (input) => {
        processCommand(input.trim());
      });
      rl.on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
      });
    });
  } else if (command === '3') {
    rl.close();
  } else {
    console.log('Invalid option');
    displayMenu();
    rl.prompt();
  }
}

displayMenu();
rl.setPrompt('> ');
rl.prompt();

rl.on('line', (input) => {
  processCommand(input.trim());
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
import * as readline from 'readline';
import { spawn } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\nSelect an app to run:');
  console.log('1. Todo App');
  console.log('2. Counter App');
  console.log('3. Exit');
  rl.question('> ', (answer) => {
    if (answer === '1') {
      console.log('Running Todo App...');
      const child = spawn('npx', ['ts-node', '../examples/todo-app/index.ts'], { stdio: 'inherit', cwd: __dirname });
      child.on('close', () => {
        showMenu();
      });
    } else if (answer === '2') {
      console.log('Running Counter App...');
      const child = spawn('npx', ['ts-node', '../examples/counter-app/counter.ts'], { stdio: 'inherit', cwd: __dirname });
      child.on('close', () => {
        showMenu();
      });
    } else if (answer === '3') {
      rl.close();
    } else {
      console.log('Invalid option');
      showMenu();
    }
  });
}

showMenu();
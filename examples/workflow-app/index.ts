const { createWorkflow, createRAMApp } = require('../../lib/src/index.js');
import type { Action } from '../../lib/src/index.js';

// Define workflow states
const workflow = createWorkflow({
  initial: 'NEW',
  states: {
    NEW: {
      actions: ['AddIncome'],
      transitions: {
        AddIncome: 'INCOME_ADDED'
      },
      onEnter: (state) => console.log('Entered NEW state'),
      invariants: [
        (state) => {
          if (state.employee && state.employee.incomes && state.employee.incomes.length > 0) {
            throw new Error('New employees should not have incomes yet');
          }
        }
      ]
    },
    INCOME_ADDED: {
      actions: ['VerifyIncome'],
      transitions: {
        VerifyIncome: 'VERIFIED'
      },
      onEnter: (state) => console.log('Income added, ready for verification'),
      onExit: (state) => console.log('Exiting income added state')
    },
    VERIFIED: {
      actions: [],
      onEnter: (state) => console.log('Employee verification complete')
    }
  }
});

// Define actions
const addIncome: Action = {
  name: 'AddIncome',
  requires: (state) => state.workflowState === 'NEW',
  effects: (state, payload) => ({
    ...state,
    employee: {
      ...state.employee,
      incomes: [...(state.employee?.incomes || []), payload]
    }
  })
};

const verifyIncome: Action = {
  name: 'VerifyIncome',
  requires: (state) => state.workflowState === 'INCOME_ADDED',
  effects: (state, payload) => ({
    ...state,
    employee: {
      ...state.employee,
      verified: true
    }
  })
};

const actions = [addIncome, verifyIncome];

// Create the app
const app = createRAMApp({
  workflow,
  strict: true,
  actions,
  initialState: {
    employee: {
      name: 'John Doe',
      incomes: []
    }
  },
  render: (state, allowedActions) => {
    let markdown = `# Employee Onboarding\n\n`;
    markdown += `**Current Workflow State:** ${state.workflowState}\n\n`;
    markdown += `**Employee:** ${state.employee.name}\n\n`;
    markdown += `**Incomes:** ${state.employee.incomes.length}\n\n`;
    if (state.employee.verified) {
      markdown += `**Status:** Verified ✓\n\n`;
    }

    if (allowedActions.length > 0) {
      markdown += `## Allowed Actions\n\n`;
      allowedActions.forEach(action => {
        markdown += `- ${action.name}\n`;
      });
    }

    return markdown;
  }
});

// Example usage
console.log('Initial render:');
console.log(app.render());

console.log('\nExecuting AddIncome...');
app.executeAction('AddIncome', { amount: 50000, source: 'salary' });

console.log('\nAfter AddIncome:');
console.log(app.render());

console.log('\nExecuting VerifyIncome...');
app.executeAction('VerifyIncome');

console.log('\nFinal state:');
console.log(app.render());

console.log('\nWorkflow state:', app.getWorkflowState());
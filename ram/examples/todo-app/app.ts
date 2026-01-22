import { useState, useEffect, resetHooks } from './lib/src/hooks';
import { getAllowedActions, checkInvariants, executeAction } from './lib/src/actions';
import { renderMarkdown } from './lib/src/renderer';
import { TodoState } from './types';
import { addTodo, toggleTodo, deleteTodo, clearCompleted } from './actions';
import { noEmptyText, uniqueIds } from './invariants';
import { Action } from './lib/src/types';

const initialState: TodoState = {
  todos: []
};

export function TodoApp(action?: Action, payload?: any): { markdown: string; allowedActions: Action[] } {
  resetHooks(TodoApp);

  const [state, setState] = useState<TodoState>(initialState);

  if (action) {
    const newState = executeAction(state, action, payload);
    setState(newState);
  }

  const actions = [addTodo, toggleTodo, deleteTodo, clearCompleted];
  const invariants = [noEmptyText, uniqueIds];

  useEffect(() => {
    try {
      checkInvariants(state, invariants);
    } catch (error) {
      console.error('Invariant violation:', error);
    }
  }, [state]);

  const allowedActions = getAllowedActions(state, actions);

  const goals = [
    'Manage personal tasks efficiently',
    'Keep todo list organized and up-to-date'
  ];

  const markdown = renderMarkdown({
    state,
    allowedActions,
    goals
  });

  return { markdown, allowedActions };
}
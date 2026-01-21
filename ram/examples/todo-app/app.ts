import { useState, useEffect, resetHooks } from './lib/src/hooks';
import { getAllowedActions, checkInvariants } from './lib/src/actions';
import { renderMarkdown } from './lib/src/renderer';
import { TodoState } from './types';
import { addTodo, toggleTodo, deleteTodo, clearCompleted } from './actions';
import { noEmptyText, uniqueIds } from './invariants';

const initialState: TodoState = {
  todos: []
};

export function TodoApp(): string {
  resetHooks(TodoApp);

  const [state, setState] = useState<TodoState>(initialState);

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

  return renderMarkdown({
    state,
    allowedActions,
    goals
  });
}
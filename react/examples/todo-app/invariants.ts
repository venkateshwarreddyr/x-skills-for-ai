import { Invariant } from './lib/src/types';
import { TodoState } from './types';

export const noEmptyText: Invariant = (state: TodoState) => {
  if (state.todos.some(todo => todo.text.trim() === '')) {
    throw new Error('Todo text cannot be empty');
  }
};

export const uniqueIds: Invariant = (state: TodoState) => {
  const ids = state.todos.map(todo => todo.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('Todo IDs must be unique');
  }
};
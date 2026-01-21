import { Action } from './lib/src/types';
import { Todo, TodoState } from './types';

export const addTodo: Action = {
  name: 'AddTodo',
  requires: (state: TodoState) => true,
  inputs: [
    { name: 'text', type: 'string', required: true }
  ],
  effects: (state: TodoState, payload: { text: string }) => ({
    ...state,
    todos: [
      ...state.todos,
      {
        id: Date.now().toString(),
        text: payload.text,
        completed: false
      }
    ]
  })
};

export const toggleTodo: Action = {
  name: 'ToggleTodo',
  requires: (state: TodoState) => state.todos.length > 0,
  inputs: [
    { name: 'id', type: 'string', required: true }
  ],
  effects: (state: TodoState, payload: { id: string }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === payload.id ? { ...todo, completed: !todo.completed } : todo
    )
  })
};

export const deleteTodo: Action = {
  name: 'DeleteTodo',
  requires: (state: TodoState) => state.todos.length > 0,
  inputs: [
    { name: 'id', type: 'string', required: true }
  ],
  effects: (state: TodoState, payload: { id: string }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== payload.id)
  })
};

export const clearCompleted: Action = {
  name: 'ClearCompleted',
  requires: (state: TodoState) => state.todos.some(todo => todo.completed),
  effects: (state: TodoState) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })
};
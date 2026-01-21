const completeTodo = {
  name: 'CompleteTodo',
  requires: (state, params) => !params || (params.id && state.todos.find(t => t.id === params.id && !t.completed)),
  effects: (state, params) => {
    if (!params || !params.id) throw new Error('Invalid params for CompleteTodo');
    return {
      ...state,
      todos: state.todos.map(t => t.id === params.id ? { ...t, completed: true } : t)
    };
  }
};

export { completeTodo };
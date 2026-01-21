const deleteTodo = {
  name: 'DeleteTodo',
  requires: (state, params) => !params || (params.id && state.todos.find(t => t.id === params.id)),
  effects: (state, params) => {
    if (!params || !params.id) throw new Error('Invalid params for DeleteTodo');
    return {
      ...state,
      todos: state.todos.filter(t => t.id !== params.id)
    };
  }
};

export { deleteTodo };
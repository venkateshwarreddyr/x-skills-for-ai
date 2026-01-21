const addTodo = {
  name: 'AddTodo',
  requires: (state, params) => !params || (params.text && params.text.trim() !== ''),
  effects: (state, params) => {
    if (!params || !params.text || !params.text.trim()) throw new Error('Invalid params for AddTodo');
    return {
      ...state,
      todos: [...state.todos, {
        id: Date.now().toString(),
        text: params.text.trim(),
        completed: false
      }]
    };
  }
};

export { addTodo };
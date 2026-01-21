function buildAIContext(state, actions, invariants, history) {
  const allowed = actions.filter(a => a.requires(state));
  return {
    currentState: JSON.parse(JSON.stringify(state)),
    allowedActions: allowed.map(a => ({
      name: a.name,
      description: `Execute ${a.name} action`,
      requiresParams: a.name === 'AddTodo' ? 'text: string' : a.name === 'CompleteTodo' || a.name === 'DeleteTodo' ? 'id: string' : 'none'
    })),
    invariants: invariants.map((inv, i) => ({
      id: i + 1,
      description: `Must not violate: ${inv.toString().replace(/\s+/g, ' ')}`
    })),
    recentHistory: history.slice(-10).map(e => ({
      action: e.actionName,
      timestamp: new Date(e.timestamp).toLocaleString(),
      stateChange: `Todos: ${e.beforeState.todos.length} -> ${e.afterState.todos.length}`
    })),
    summary: `Todo workflow state: ${state.todos.length} total todos, ${state.todos.filter(t => t.completed).length} completed, ${state.todos.filter(t => !t.completed).length} pending.`
  };
}

export { buildAIContext };
const invariants = [
  (state) => {
    const texts = state.todos.map(t => t.text.toLowerCase());
    if (new Set(texts).size !== texts.length) {
      throw new Error('Invariant violated: Duplicate todo texts');
    }
  },
  (state) => {
    if (state.todos.some(t => !t.text.trim())) {
      throw new Error('Invariant violated: Empty todo text');
    }
  }
];

export { invariants };
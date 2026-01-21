/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 */

/**
 * @typedef {Object} State
 * @property {Todo[]} todos
 */

/**
 * @typedef {Object} Action
 * @property {string} name
 * @property {(state: State, params?: any) => boolean} requires
 * @property {(state: State, params?: any) => State} effects
 */

/**
 * @typedef {Object} Event
 * @property {string} actionName
 * @property {State} beforeState
 * @property {State} afterState
 * @property {number} timestamp
 */

// Initial state
const initialState = {
  todos: []
};

export { initialState };
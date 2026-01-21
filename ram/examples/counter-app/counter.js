"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../lib/dist");
const dist_2 = require("../../lib/dist");
// Define actions
const incrementAction = {
    name: 'Increment',
    requires: () => true,
    effects: (state) => ({ ...state, count: state.count + 1 }),
};
const decrementAction = {
    name: 'Decrement',
    requires: (state) => state.count > 0,
    effects: (state) => ({ ...state, count: state.count - 1 }),
};
// Invariants
const invariants = [
    (state) => {
        if (state.count < 0)
            throw new Error('Count cannot be negative');
    },
];
// AIComponent
function CounterApp() {
    const [state, setState] = (0, dist_1.useState)({ count: 0 });
    const actions = [incrementAction, decrementAction];
    const allowedActions = (0, dist_2.getAllowedActions)(state, actions);
    (0, dist_1.useEffect)(() => {
        (0, dist_2.checkInvariants)(state, invariants);
    }, [state]);
    return (0, dist_2.renderMarkdown)({
        state,
        allowedActions,
        goals: ['Demonstrate basic counter functionality'],
    });
}
// Run the app
(0, dist_1.resetHooks)(CounterApp);
const output = CounterApp();
console.log(output);

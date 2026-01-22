"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = exports.useState = exports.resetHooks = void 0;
const componentHooks = new Map();
let currentComponent = null;
let currentHookIndex = 0;
function resetHooks(component) {
    currentComponent = component;
    currentHookIndex = 0;
    if (!componentHooks.has(component)) {
        componentHooks.set(component, { states: [], effects: [] });
    }
}
exports.resetHooks = resetHooks;
function useState(initialState) {
    if (!currentComponent) {
        throw new Error('useState must be called inside a component');
    }
    const hooks = componentHooks.get(currentComponent);
    const hookIndex = currentHookIndex++;
    if (hooks.states.length <= hookIndex) {
        hooks.states[hookIndex] = initialState;
    }
    const state = hooks.states[hookIndex];
    const setState = (newState) => {
        const updated = typeof newState === 'function' ? newState(state) : newState;
        hooks.states[hookIndex] = updated;
        // In a real React, this would trigger re-render
        // For now, just update the state
    };
    return [state, setState];
}
exports.useState = useState;
function useEffect(callback, deps) {
    if (!currentComponent) {
        throw new Error('useEffect must be called inside a component');
    }
    const hooks = componentHooks.get(currentComponent);
    const hookIndex = currentHookIndex++;
    const prevEffect = hooks.effects[hookIndex];
    if (!prevEffect || !deps || !prevEffect.deps || deps.some((dep, i) => dep !== prevEffect.deps[i])) {
        callback();
    }
    hooks.effects[hookIndex] = { callback, deps: deps || [] };
}
exports.useEffect = useEffect;
//# sourceMappingURL=hooks.js.map
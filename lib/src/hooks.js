"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = exports.useCallback = exports.useMemo = exports.useContext = exports.useState = exports.resetHooks = exports.createContext = void 0;
const componentHooks = new Map();
let currentComponent = null;
let currentHookIndex = 0;
// Global context map for AI contexts
const globalContexts = new Map();
function createContext(defaultValue) {
    const symbol = Symbol('context');
    globalContexts.set(symbol, defaultValue);
    return {
        Provider: ({ value, children }) => {
            globalContexts.set(symbol, value);
            // In a full implementation, this would render children with context
            // For now, just return children
            return children;
        },
        _symbol: symbol,
        _defaultValue: defaultValue,
    };
}
exports.createContext = createContext;
function resetHooks(component) {
    currentComponent = component;
    currentHookIndex = 0;
    if (!componentHooks.has(component)) {
        componentHooks.set(component, { states: [], effects: [], memos: [], callbacks: [], contexts: [] });
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
function useContext(context) {
    var _a;
    if (!currentComponent) {
        throw new Error('useContext must be called inside a component');
    }
    const hooks = componentHooks.get(currentComponent);
    const hookIndex = currentHookIndex++;
    if (hooks.contexts.length <= hookIndex) {
        hooks.contexts[hookIndex] = context;
    }
    return (_a = globalContexts.get(context._symbol)) !== null && _a !== void 0 ? _a : context._defaultValue;
}
exports.useContext = useContext;
function useMemo(factory, deps) {
    if (!currentComponent) {
        throw new Error('useMemo must be called inside a component');
    }
    const hooks = componentHooks.get(currentComponent);
    const hookIndex = currentHookIndex++;
    const prevMemo = hooks.memos[hookIndex];
    if (!prevMemo || !deps || !prevMemo.deps || deps.some((dep, i) => dep !== prevMemo.deps[i])) {
        const value = factory();
        hooks.memos[hookIndex] = { value, deps };
        return value;
    }
    return prevMemo.value;
}
exports.useMemo = useMemo;
function useCallback(callback, deps) {
    if (!currentComponent) {
        throw new Error('useCallback must be called inside a component');
    }
    const hooks = componentHooks.get(currentComponent);
    const hookIndex = currentHookIndex++;
    const prevCallback = hooks.callbacks[hookIndex];
    if (!prevCallback || !deps || !prevCallback.deps || deps.some((dep, i) => dep !== prevCallback.deps[i])) {
        hooks.callbacks[hookIndex] = { fn: callback, deps };
        return callback;
    }
    return prevCallback.fn;
}
exports.useCallback = useCallback;
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
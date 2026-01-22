// Advanced hooks for AI stability
import { Effect } from './types';

type HookState = {
  states: any[];
  effects: { callback: Effect; deps: any[] }[];
  memos: { value: any; deps: any[] }[];
  callbacks: { fn: Function; deps: any[] }[];
  contexts: any[];
};

const componentHooks = new Map<Function, HookState>();

let currentComponent: Function | null = null;
let currentHookIndex = 0;

// Global context map for AI contexts
const globalContexts = new Map<symbol, any>();

export interface Context<T> {
  Provider: (props: { value: T; children: any }) => any;
  _symbol: symbol;
  _defaultValue: T;
}

export function createContext<T>(defaultValue: T): Context<T> {
  const symbol = Symbol('context');
  globalContexts.set(symbol, defaultValue);
  return {
    Provider: ({ value, children }: { value: T; children: any }) => {
      globalContexts.set(symbol, value);
      // In a full implementation, this would render children with context
      // For now, just return children
      return children;
    },
    _symbol: symbol,
    _defaultValue: defaultValue,
  };
}

export function resetHooks(component: Function) {
  currentComponent = component;
  currentHookIndex = 0;
  if (!componentHooks.has(component)) {
    componentHooks.set(component, { states: [], effects: [], memos: [], callbacks: [], contexts: [] });
  }
}

export function useState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void] {
  if (!currentComponent) {
    throw new Error('useState must be called inside a component');
  }
  const hooks = componentHooks.get(currentComponent)!;
  const hookIndex = currentHookIndex++;
  if (hooks.states.length <= hookIndex) {
    hooks.states[hookIndex] = initialState;
  }
  const state = hooks.states[hookIndex];
  const setState = (newState: T | ((prev: T) => T)) => {
    const updated = typeof newState === 'function' ? (newState as (prev: T) => T)(state) : newState;
    hooks.states[hookIndex] = updated;
    // In a real React, this would trigger re-render
    // For now, just update the state
  };
  return [state, setState];
}

export function useContext<T>(context: Context<T>): T {
  if (!currentComponent) {
    throw new Error('useContext must be called inside a component');
  }
  const hooks = componentHooks.get(currentComponent)!;
  const hookIndex = currentHookIndex++;
  if (hooks.contexts.length <= hookIndex) {
    hooks.contexts[hookIndex] = context;
  }
  return globalContexts.get(context._symbol) ?? context._defaultValue;
}

export function useMemo<T>(factory: () => T, deps: any[]): T {
  if (!currentComponent) {
    throw new Error('useMemo must be called inside a component');
  }
  const hooks = componentHooks.get(currentComponent)!;
  const hookIndex = currentHookIndex++;
  const prevMemo = hooks.memos[hookIndex];
  if (!prevMemo || !deps || !prevMemo.deps || deps.some((dep, i) => dep !== prevMemo.deps[i])) {
    const value = factory();
    hooks.memos[hookIndex] = { value, deps };
    return value;
  }
  return prevMemo.value;
}

export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T {
  if (!currentComponent) {
    throw new Error('useCallback must be called inside a component');
  }
  const hooks = componentHooks.get(currentComponent)!;
  const hookIndex = currentHookIndex++;
  const prevCallback = hooks.callbacks[hookIndex];
  if (!prevCallback || !deps || !prevCallback.deps || deps.some((dep, i) => dep !== prevCallback.deps[i])) {
    hooks.callbacks[hookIndex] = { fn: callback, deps };
    return callback;
  }
  return prevCallback.fn as T;
}

export function useEffect(callback: () => void | (() => void), deps?: any[]) {
  if (!currentComponent) {
    throw new Error('useEffect must be called inside a component');
  }
  const hooks = componentHooks.get(currentComponent)!;
  const hookIndex = currentHookIndex++;
  const prevEffect = hooks.effects[hookIndex];
  if (!prevEffect || !deps || !prevEffect.deps || deps.some((dep, i) => dep !== prevEffect.deps[i])) {
    callback();
  }
  hooks.effects[hookIndex] = { callback, deps: deps || [] };
}
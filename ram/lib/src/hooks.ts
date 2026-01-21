import { Effect } from './types';

const componentHooks = new Map<Function, { states: any[]; effects: { callback: Effect; deps: any[] }[] }>();

let currentComponent: Function | null = null;
let currentHookIndex = 0;

export function resetHooks(component: Function) {
  currentComponent = component;
  currentHookIndex = 0;
  if (!componentHooks.has(component)) {
    componentHooks.set(component, { states: [], effects: [] });
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
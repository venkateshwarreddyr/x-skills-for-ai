// Hooks using haunted for correct semantics
import { useState as hauntedUseState, useEffect as hauntedUseEffect, useMemo as hauntedUseMemo, useCallback as hauntedUseCallback } from 'haunted';
import { Effect } from './types';

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
      return children;
    },
    _symbol: symbol,
    _defaultValue: defaultValue,
  };
}

export function resetHooks(component: Function) {
  // Not needed with haunted, hooks are managed per component instance
}

export function useState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void] {
  return hauntedUseState(initialState) as [T, (newState: T | ((prev: T) => T)) => void];
}

export function useContext<T>(context: Context<T>): T {
  return globalContexts.get(context._symbol) ?? context._defaultValue;
}

export function useMemo<T>(factory: () => T, deps: any[]): T {
  return hauntedUseMemo(factory, deps);
}

export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T {
  return hauntedUseCallback(callback, deps);
}

export function useEffect(callback: () => void | (() => void), deps?: any[]) {
  return hauntedUseEffect(callback, deps);
}
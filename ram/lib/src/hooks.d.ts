export declare function resetHooks(component: Function): void;
export declare function useState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void];
export declare function useEffect(callback: () => void | (() => void), deps?: any[]): void;
//# sourceMappingURL=hooks.d.ts.map
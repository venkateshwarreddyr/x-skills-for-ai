export interface Context<T> {
    Provider: (props: {
        value: T;
        children: any;
    }) => any;
    _symbol: symbol;
    _defaultValue: T;
}
export declare function createContext<T>(defaultValue: T): Context<T>;
export declare function resetHooks(component: Function): void;
export declare function useState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void];
export declare function useContext<T>(context: Context<T>): T;
export declare function useMemo<T>(factory: () => T, deps: any[]): T;
export declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
export declare function useEffect(callback: () => void | (() => void), deps?: any[]): void;
//# sourceMappingURL=hooks.d.ts.map
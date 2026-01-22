import { Action, Invariant } from './types';
export declare function getAllowedActions(state: any, actions: Action[]): Action[];
export declare function checkInvariants(state: any, invariants: Invariant[]): void;
export declare function executeAction(state: any, action: Action, payload?: any): any;
//# sourceMappingURL=actions.d.ts.map
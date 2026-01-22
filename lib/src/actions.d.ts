import { Action, Invariant, Workflow, StrictModeConfig } from './types';
export declare function getAllowedActions(state: any, actions: Action[]): Action[];
export declare function checkInvariants(state: any, invariants: Invariant[]): void;
export declare function executeAction(state: any, action: Action, payload?: any): any;
export declare function executeActionStrict(state: any, action: Action, payload: any, workflow: Workflow, actions: Action[], invariants: Invariant[], strictConfig: StrictModeConfig, createCheckpointFn?: (state: any, context: string, allowedActions: Action[], metadata?: any) => any): any;
//# sourceMappingURL=actions.d.ts.map
import { Action, Invariant, Workflow, StrictModeConfig } from './types';
export interface RAMAppConfig {
    workflow?: Workflow;
    strict?: boolean | StrictModeConfig;
    actions: Action[];
    invariants?: Invariant[];
    initialState: any;
    render: (state: any, allowedActions: Action[]) => string;
    onAction?: (action: Action, payload: any, newState: any) => void;
}
export interface RAMApp {
    executeAction: (actionName: string, payload?: any) => any;
    getState: () => any;
    getAllowedActions: () => Action[];
    render: () => string;
    getWorkflowState: () => string | undefined;
}
export declare function createRAMApp(config: RAMAppConfig): RAMApp;
//# sourceMappingURL=app.d.ts.map
import { interpret } from '@xstate/fsm';
export type Effect = (state: any, payload?: any) => any;
export type Action = {
    name: string;
    requires: (state: any) => boolean;
    effects: Effect;
    inputs?: {
        name: string;
        type: string;
        required: boolean;
    }[];
};
export type Invariant = (state: any) => void;
export type AIComponent = (props?: any) => string;
export interface Checkpoint {
    id: string;
    timestamp: string;
    state: any;
    context: string;
    allowedActions: Action[];
    metadata?: Record<string, any>;
}
export type WorkflowState = {
    actions: string[];
    transitions?: {
        [actionName: string]: string;
    };
    invariants?: Invariant[];
    onEnter?: Effect;
    onExit?: Effect;
};
export type WorkflowDefinition = {
    initial: string;
    states: {
        [stateName: string]: WorkflowState;
    };
};
export type StrictModeConfig = {
    requireWorkflowState?: boolean;
    requireCheckpointBeforeEffect?: boolean;
    forbidDynamicActions?: boolean;
    forbidStateMutationOutsideActions?: boolean;
    requireInvariants?: boolean;
};
export type WorkflowService = ReturnType<typeof interpret>;
export type Workflow = {
    definition: WorkflowDefinition;
    service: WorkflowService;
    currentState: string;
    transition: (currentState: string, actionName: string) => string;
    getAllowedActions: (stateName: string) => string[];
    validateTransition: (currentState: string, actionName: string) => boolean;
};
//# sourceMappingURL=types.d.ts.map
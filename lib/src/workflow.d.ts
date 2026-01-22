import { WorkflowDefinition, Workflow, WorkflowService } from './types';
export declare function toXFSM(workflow: WorkflowDefinition): import("@xstate/fsm").StateMachine.Machine<object, import("@xstate/fsm").EventObject, import("@xstate/fsm").Typestate<object>>;
export declare function createWorkflow(definition: WorkflowDefinition): Workflow;
export declare function runOnEnter(stateName: string, workflow: Workflow, state: any): void;
export declare function runOnExit(stateName: string, workflow: Workflow, state: any): void;
export declare function checkWorkflowInvariants(stateName: string, workflow: Workflow, state: any): void;
export declare function executeWorkflowAction(service: WorkflowService, actionName: string, state: any, payload: any, applyEffects: (state: any, actionName: string, payload: any) => any, workflow: Workflow): any;
//# sourceMappingURL=workflow.d.ts.map
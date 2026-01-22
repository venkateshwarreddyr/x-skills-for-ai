import { WorkflowDefinition, Workflow, WorkflowState, Invariant, Effect, Action, WorkflowService } from './types';
import { createMachine, interpret } from '@xstate/fsm';
import { createCheckpoint } from './checkpoint';

export function toXFSM(workflow: WorkflowDefinition) {
  const statesConfig: any = {};

  for (const [name, state] of Object.entries(workflow.states)) {
    statesConfig[name] = {
      on: state.transitions || {}
    };
  }

  return createMachine({
    initial: workflow.initial,
    states: statesConfig
  });
}

export function createWorkflow(definition: WorkflowDefinition): Workflow {
  const machine = toXFSM(definition);
  const service = interpret(machine).start();

  function transition(currentState: string, actionName: string): string {
    const current = service.state.value;
    if (current !== currentState) {
      throw new Error(`Current state mismatch: expected ${currentState}, got ${current}`);
    }

    const nextState = (machine as any).config.states[current].on?.[actionName];
    if (!nextState) {
      throw new Error(`Invalid transition: Action ${actionName} is not allowed in state ${current}`);
    }

    service.send(actionName);
    return service.state.value;
  }

  function getAllowedActions(stateName: string): string[] {
    const stateDef = definition.states[stateName];
    if (!stateDef) {
      throw new Error(`Unknown workflow state: ${stateName}`);
    }
    // For now, return from definition, but could be enhanced to use FSM
    return stateDef.actions;
  }

  function validateTransition(currentState: string, actionName: string): boolean {
    try {
      transition(currentState, actionName);
      return true;
    } catch {
      return false;
    }
  }

  return {
    definition,
    service,
    get currentState() { return service.state.value; },
    transition,
    getAllowedActions,
    validateTransition
  };
}

export function runOnEnter(stateName: string, workflow: Workflow, state: any): void {
  const stateDef = workflow.definition.states[stateName];
  if (stateDef?.onEnter) {
    stateDef.onEnter(state);
  }
}

export function runOnExit(stateName: string, workflow: Workflow, state: any): void {
  const stateDef = workflow.definition.states[stateName];
  if (stateDef?.onExit) {
    stateDef.onExit(state);
  }
}

export function checkWorkflowInvariants(stateName: string, workflow: Workflow, state: any): void {
  const stateDef = workflow.definition.states[stateName];
  if (stateDef?.invariants) {
    stateDef.invariants.forEach(invariant => invariant(state));
  }
}

export function executeWorkflowAction(
  service: WorkflowService,
  actionName: string,
  state: any,
  payload: any,
  applyEffects: (state: any, actionName: string, payload: any) => any,
  workflow: Workflow
): any {
  // 1) Validate allowed
  const allowed = Object.keys((service as any).machine.config.states[service.state.value].on);
  if (!allowed.includes(actionName)) {
    throw new Error(`Action ${actionName} not allowed`);
  }

  // 2) Pre-checkpoint
  createCheckpoint(state, '', [], { reason: `before ${actionName}` });

  // 3) Execute effects
  const newState = applyEffects(state, actionName, payload);

  // 4) Transition FSM
  service.send(actionName);

  // 5) Post-checkpoint invariants
  checkWorkflowInvariants(service.state.value, workflow, newState);

  return newState;
}
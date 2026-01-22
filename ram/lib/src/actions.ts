import { Action, Invariant, Workflow, StrictModeConfig } from './types';
import { createCheckpoint } from './checkpoint';
import { checkWorkflowInvariants, runOnEnter, runOnExit } from './workflow';

export function getAllowedActions(state: any, actions: Action[]): Action[] {
  return actions.filter(action => action.requires(state));
}

export function checkInvariants(state: any, invariants: Invariant[]): void {
  invariants.forEach(invariant => invariant(state));
}

export function executeAction(state: any, action: Action, payload?: any): any {
  if (action.requires(state)) {
    return action.effects(state, payload);
  }
  throw new Error(`Action ${action.name} is not allowed`);
}

export function executeActionStrict(
  state: any,
  action: Action,
  payload: any,
  workflow: Workflow,
  actions: Action[],
  invariants: Invariant[],
  strictConfig: StrictModeConfig,
  createCheckpointFn?: (state: any, context: string, allowedActions: Action[], metadata?: any) => any
): any {
  const currentWorkflowState = state.workflowState;

  // 1. Validate action exists
  if (!actions.find(a => a.name === action.name)) {
    throw new Error(`Action ${action.name} not found`);
  }

  // 2. Validate action allowed in current workflow state
  const allowedActionNames = workflow.getAllowedActions(currentWorkflowState);
  if (!allowedActionNames.includes(action.name)) {
    throw new Error(`WorkflowError: Action ${action.name} not allowed in state ${currentWorkflowState}`);
  }

  // 3. Validate workflow invariants
  checkWorkflowInvariants(currentWorkflowState, workflow, state);

  // 4. Create checkpoint (mandatory in strict mode)
  if (strictConfig.requireCheckpointBeforeEffect && createCheckpointFn) {
    createCheckpointFn(state, '', actions, { reason: 'before-action', action: action.name });
  }

  // 5. Execute action effects
  const newState = action.effects(state, payload);

  // 6. Transition workflow state
  const nextWorkflowState = workflow.transition(currentWorkflowState, action.name);
  newState.workflowState = nextWorkflowState;

  // 7. Run onExit / onEnter hooks
  runOnExit(currentWorkflowState, workflow, state);
  runOnEnter(nextWorkflowState, workflow, newState);

  // 8. Re-check invariants
  checkWorkflowInvariants(nextWorkflowState, workflow, newState);

  return newState;
}
import { Action, Invariant, Workflow, StrictModeConfig } from './types';
import { executeActionStrict } from './actions';
import { createCheckpoint } from './checkpoint';

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

export function createRAMApp(config: RAMAppConfig): RAMApp {
  const {
    workflow,
    strict,
    actions,
    invariants = [],
    initialState,
    render,
    onAction
  } = config;

  let currentState = { ...initialState };

  // Set initial workflow state if workflow is provided
  if (workflow) {
    currentState.workflowState = workflow.currentState;
  }

  const strictConfig: StrictModeConfig = typeof strict === 'boolean'
    ? {
        requireWorkflowState: strict,
        requireCheckpointBeforeEffect: strict,
        forbidDynamicActions: strict,
        forbidStateMutationOutsideActions: strict,
        requireInvariants: strict
      }
    : strict || {};

  function getAllowedActions(): Action[] {
    if (workflow && strictConfig.requireWorkflowState) {
      const allowedActionNames = workflow.getAllowedActions(currentState.workflowState);
      return actions.filter(action => allowedActionNames.includes(action.name));
    }
    return actions.filter(action => action.requires(currentState));
  }

  function executeAction(actionName: string, payload?: any): any {
    const action = actions.find(a => a.name === actionName);
    if (!action) {
      throw new Error(`Action ${actionName} not found`);
    }

    let newState: any;

    if (workflow && strictConfig.requireWorkflowState) {
      // Strict mode execution
      newState = executeActionStrict(
        currentState,
        action,
        payload,
        workflow,
        actions,
        invariants,
        strictConfig,
        (state, context, allowedActions, metadata) => createCheckpoint(state, context, allowedActions, metadata)
      );
    } else {
      // Regular execution
      newState = action.effects(currentState, payload);
    }

    currentState = newState;

    if (onAction) {
      onAction(action, payload, newState);
    }

    return newState;
  }

  function getState(): any {
    return { ...currentState };
  }

  function getWorkflowState(): string | undefined {
    return currentState.workflowState;
  }

  return {
    executeAction,
    getState,
    getAllowedActions,
    render: () => render(currentState, getAllowedActions()),
    getWorkflowState
  };
}
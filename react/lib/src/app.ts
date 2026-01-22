import { Action, Invariant, StrictModeConfig } from './types';
import { createCheckpoint } from './checkpoint';

export interface RAMAppConfig {
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
}

export function createRAMApp(config: RAMAppConfig): RAMApp {
  const {
    strict,
    actions,
    invariants = [],
    initialState,
    render,
    onAction
  } = config;

  let currentState = { ...initialState };

  const strictConfig: StrictModeConfig = typeof strict === 'boolean'
    ? {
        requireCheckpointBeforeEffect: strict,
        forbidDynamicActions: strict,
        forbidStateMutationOutsideActions: strict,
        requireInvariants: strict
      }
    : strict || {};

  function getAllowedActions(): Action[] {
    return actions.filter(action => action.requires(currentState));
  }

  function executeAction(actionName: string, payload?: any): any {
    const action = actions.find(a => a.name === actionName);
    if (!action) {
      throw new Error(`Action ${actionName} not found`);
    }

    // Create checkpoint before action if required
    if (strictConfig.requireCheckpointBeforeEffect) {
      createCheckpoint(currentState, `before ${actionName}`, getAllowedActions());
    }

    // Execute action effects
    const newState = action.effects(currentState, payload);

    // Check invariants if required
    if (strictConfig.requireInvariants && invariants.length > 0) {
      invariants.forEach(invariant => invariant(newState));
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

  return {
    executeAction,
    getState,
    getAllowedActions,
    render: () => render(currentState, getAllowedActions())
  };
}
import { Action, Invariant } from './types';

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
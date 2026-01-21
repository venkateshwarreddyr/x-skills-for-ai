import { Action, Invariant } from "../ir/ir";

function evalCondition(cond: string, state: any): boolean {
  const parts = cond.split('==').map(s => s.trim());
  if (parts.length === 2) {
    const [left, right] = parts;
    const value = getValue(left, state);
    return value === right;
  }
  return false;
}

function getValue(path: string, state: any): any {
  const [obj, prop] = path.split('.');
  return state[obj]?.[prop];
}

function applyEffect(effect: string, state: any): void {
  const parts = effect.split('=').map(s => s.trim());
  if (parts.length === 2) {
    const [left, right] = parts;
    const [obj, prop] = left.split('.');
    if (state[obj]) {
      state[obj][prop] = right;
    }
  }
}

function assertInvariants(state: any, invariants: Invariant[]): void {
  for (const invariant of invariants) {
    // Simple check for "A implies B"
    const impliesIndex = invariant.indexOf('implies');
    if (impliesIndex !== -1) {
      const antecedent = invariant.substring(0, impliesIndex).trim();
      const consequent = invariant.substring(impliesIndex + 7).trim();
      if (evalCondition(antecedent, state)) {
        if (!evalCondition(consequent, state)) {
          throw new Error(`Invariant violated: ${invariant}`);
        }
      }
    } else {
      // If no implies, assume it's a direct condition that must be true
      if (!evalCondition(invariant, state)) {
        throw new Error(`Invariant violated: ${invariant}`);
      }
    }
  }
}

export function executeAction(actionName: string, state: any, actions: Action[], invariants: Invariant[]) {
  const action = actions.find(a => a.name === actionName);
  if (!action) throw new Error("Action not found");

  // validate requires
  const valid = action.requires.every(cond => evalCondition(cond, state));
  if (!valid) throw new Error("Constraints not satisfied");

  // execute effects
  action.effects.forEach(effect => applyEffect(effect, state));

  // check invariants
  assertInvariants(state, invariants);
}
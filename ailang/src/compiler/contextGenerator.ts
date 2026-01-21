import { Action } from "../ir/ir";

function evalCondition(cond: string, state: any): boolean {
  const parts = cond.split('==').map(s => s.trim());
  if (parts.length === 2) {
    const [left, right] = parts;
    const value = getValue(left, state);
    return value === right;
  }
  // Add more operators if needed
  return false;
}

function getValue(path: string, state: any): any {
  const [obj, prop] = path.split('.');
  return state[obj]?.[prop];
}

export function generateAIContext(
  currentState: Record<string, any>, // e.g., { Todo: {...}, User: {...}, Invoice: {...} }
  actions: Action[]
) {
  const allowedActions = actions.filter(action => {
    // Check each action's requires conditions against the current state
    return action.requires.every(cond =>
      evalCondition(cond, currentState)
    );
  });

  return {
    state: currentState,
    allowed_actions: allowedActions.map(a => ({
      name: a.name,
      constraints: a.requires
    })),
    recent_events: [], // could be populated from event log
    goal: null         // optional, could come from workflow or user input
  };
}
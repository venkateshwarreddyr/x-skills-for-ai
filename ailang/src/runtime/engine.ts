import { Action, State, Invariant, MCP, ExecutionResult, AllowedAction } from './types';

export async function executeAction(
  action: Action,
  state: State,
  invariants: Invariant[],
  mcps: MCP[]
): Promise<ExecutionResult> {
  try {
    // Check requires
    if (!action.requires(state)) {
      return {
        success: false,
        newState: state,
        error: `Action "${action.name}" requires not met`
      };
    }

    // Apply effects
    const newState = action.effects(state);

    // Check invariants
    for (const invariant of invariants) {
      try {
        invariant.check(newState);
      } catch (error) {
        return {
          success: false,
          newState: state,
          error: `Invariant "${invariant.name}" violated: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }

    // Execute MCP calls
    const mcpResults: any[] = [];
    if (action.calls) {
      for (const mcp of action.calls) {
        try {
          const result = await mcp.execute({ state: newState });
          mcpResults.push(result);
        } catch (error) {
          return {
            success: false,
            newState: state,
            error: `MCP "${mcp.name}" failed: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }

    return {
      success: true,
      newState,
      mcpResults
    };
  } catch (error) {
    return {
      success: false,
      newState: state,
      error: `Execution error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export function getAllowedActions(state: State, actions: Action[]): AllowedAction[] {
  return actions.map(action => {
    const allowed = action.requires(state);
    return {
      action,
      allowed,
      reason: allowed ? undefined : 'Preconditions not satisfied'
    };
  });
}
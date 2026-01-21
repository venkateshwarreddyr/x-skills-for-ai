// Core types for the AI-compatible framework runtime

export type State = Record<string, any>;

export interface Action {
  name: string;
  requires: (state: State) => boolean;
  effects: (state: State) => State;
  calls?: MCP[];
}

export interface Invariant {
  name: string;
  check: (state: State) => void;
}

export interface MCP {
  name: string;
  execute: (args: any) => Promise<any>;
}

export interface Framework {
  initialState: State;
  actions: Action[];
  invariants: Invariant[];
  mcps: MCP[];
}

export interface ExecutionResult {
  success: boolean;
  newState: State;
  error?: string;
  mcpResults?: any[];
}

export interface AllowedAction {
  action: Action;
  allowed: boolean;
  reason?: string;
}
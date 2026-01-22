export type Effect = (state: any, payload?: any) => any;

export type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: Effect;
  inputs?: { name: string; type: string; required: boolean }[];
};

export type Invariant = (state: any) => void;

export type AIComponent = (props?: any) => string;

export interface Checkpoint {
  id: string;
  timestamp: string;
  state: any;
  context: string; // rendered markdown context
  allowedActions: Action[];
  metadata?: Record<string, any>;
}

export type StrictModeConfig = {
  requireCheckpointBeforeEffect?: boolean;
  forbidDynamicActions?: boolean;
  forbidStateMutationOutsideActions?: boolean;
  requireInvariants?: boolean;
};
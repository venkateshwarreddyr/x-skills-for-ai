export type EntityField = { name: string; type: string; optional?: boolean };

export type Entity = { name: string; fields: EntityField[] };

export type Action = {
  name: string;
  requires: string[]; // preconditions
  effects: string[];  // state updates
};

export type Invariant = string;

export interface IR {
  entities: Record<string, Record<string, any>>; // initial state
  actions: Action[];
  invariants: Invariant[];
}
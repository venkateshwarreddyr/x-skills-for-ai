import { Entity, Action, Invariant, IR } from "../ir/ir";

function getInitialValue(type: string): any {
  // Assume the first value in union is initial
  const parts = type.split('|').map(s => s.trim());
  if (parts.length > 1) {
    return parts[0];
  }
  // For simple types, maybe default
  return null; // or some default
}

export function astToIR(ast: any[]): IR {
  const entities: Record<string, Record<string, any>> = {};
  const actions: Action[] = [];
  const invariants: Invariant[] = [];

  for (const item of ast) {
    if (item.type === "entity") {
      const entityState: Record<string, any> = {};
      for (const field of item.fields) {
        entityState[field.name] = getInitialValue(field.type);
      }
      entities[item.name] = entityState;
    } else if (item.type === "action") {
      actions.push({
        name: item.name,
        requires: item.requires,
        effects: item.effects
      });
    } else if (item.type === "invariant") {
      invariants.push(item.condition);
    }
  }

  return { entities, actions, invariants };
}
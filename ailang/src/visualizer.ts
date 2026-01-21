import { IR } from "./ir/ir";

export function generateVisualization(ir: IR): string {
  // Generate XState machine code
  const { entities, actions } = ir;

  const context = Object.keys(entities).map(entity => `${entity}: ${JSON.stringify(entities[entity])}`).join(',\n    ');

  const transitions = actions.map(action => `
        ${action.name}: {
          cond: (ctx) => ${action.requires.map(req => `eval('${req.replace(/'/g, "\\'")}', { ...ctx })`).join(' && ')},
          actions: assign({
            ${action.effects.map(effect => {
              const [entityField, value] = effect.split(' = ');
              const [entity, field] = entityField.split('.');
              return `${entity}: (ctx) => ({ ...ctx.${entity}, ${field}: ${JSON.stringify(value)} })`;
            }).join(',\n            ')}
          })
        }`).join(',\n');

  const code = `
import { createMachine, assign } from "xstate";

export const machine = createMachine({
  id: "ailang",
  initial: "running",
  context: {
    ${context}
  },
  states: {
    running: {
      on: {${transitions}
      }
    }
  }
});
`;

  return code;
}
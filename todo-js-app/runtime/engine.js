function getAllowedActions(state, actions) {

  return actions.filter(action => action.requires(state)); // checks if potentially allowed

}

function executeAction(state, action, params, invariants, history) {

  if (!action.requires(state, params)) {

    throw new Error(`Cannot execute ${action.name}: requirements not met`);

  }

  const nextState = action.effects(state, params);

  invariants.forEach(inv => {

    try {

      inv(nextState);

    } catch (e) {

      throw new Error(`Invariant violated after ${action.name}: ${e.message}`);

    }

  });

  history.push({

    actionName: action.name,

    beforeState: JSON.parse(JSON.stringify(state)),

    afterState: JSON.parse(JSON.stringify(nextState)),

    timestamp: Date.now()

  });

  return nextState;

}

export { getAllowedActions, executeAction };
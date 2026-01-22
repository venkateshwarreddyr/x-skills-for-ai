"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeActionStrict = exports.executeAction = exports.checkInvariants = exports.getAllowedActions = void 0;
const workflow_1 = require("./workflow");
function getAllowedActions(state, actions) {
    return actions.filter(action => action.requires(state));
}
exports.getAllowedActions = getAllowedActions;
function checkInvariants(state, invariants) {
    invariants.forEach(invariant => invariant(state));
}
exports.checkInvariants = checkInvariants;
function executeAction(state, action, payload) {
    if (action.requires(state)) {
        return action.effects(state, payload);
    }
    throw new Error(`Action ${action.name} is not allowed`);
}
exports.executeAction = executeAction;
function executeActionStrict(state, action, payload, workflow, actions, invariants, strictConfig, createCheckpointFn) {
    const currentWorkflowState = state.workflowState;
    // 1. Validate action exists
    if (!actions.find(a => a.name === action.name)) {
        throw new Error(`Action ${action.name} not found`);
    }
    // 2. Validate action allowed in current workflow state
    const allowedActionNames = workflow.getAllowedActions(currentWorkflowState);
    if (!allowedActionNames.includes(action.name)) {
        throw new Error(`WorkflowError: Action ${action.name} not allowed in state ${currentWorkflowState}`);
    }
    // 3. Validate workflow invariants
    (0, workflow_1.checkWorkflowInvariants)(currentWorkflowState, workflow, state);
    // 4. Create checkpoint (mandatory in strict mode)
    if (strictConfig.requireCheckpointBeforeEffect && createCheckpointFn) {
        createCheckpointFn(state, '', actions, { reason: 'before-action', action: action.name });
    }
    // 5. Execute action effects
    const newState = action.effects(state, payload);
    // 6. Transition workflow state
    const nextWorkflowState = workflow.transition(currentWorkflowState, action.name);
    newState.workflowState = nextWorkflowState;
    // 7. Run onExit / onEnter hooks
    (0, workflow_1.runOnExit)(currentWorkflowState, workflow, state);
    (0, workflow_1.runOnEnter)(nextWorkflowState, workflow, newState);
    // 8. Re-check invariants
    (0, workflow_1.checkWorkflowInvariants)(nextWorkflowState, workflow, newState);
    return newState;
}
exports.executeActionStrict = executeActionStrict;
//# sourceMappingURL=actions.js.map
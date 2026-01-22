"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRAMApp = void 0;
const actions_1 = require("./actions");
const checkpoint_1 = require("./checkpoint");
function createRAMApp(config) {
    const { workflow, strict, actions, invariants = [], initialState, render, onAction } = config;
    let currentState = { ...initialState };
    // Set initial workflow state if workflow is provided
    if (workflow) {
        currentState.workflowState = workflow.currentState;
    }
    const strictConfig = typeof strict === 'boolean'
        ? {
            requireWorkflowState: strict,
            requireCheckpointBeforeEffect: strict,
            forbidDynamicActions: strict,
            forbidStateMutationOutsideActions: strict,
            requireInvariants: strict
        }
        : strict || {};
    function getAllowedActions() {
        if (workflow && strictConfig.requireWorkflowState) {
            const allowedActionNames = workflow.getAllowedActions(currentState.workflowState);
            return actions.filter(action => allowedActionNames.includes(action.name));
        }
        return actions.filter(action => action.requires(currentState));
    }
    function executeAction(actionName, payload) {
        const action = actions.find(a => a.name === actionName);
        if (!action) {
            throw new Error(`Action ${actionName} not found`);
        }
        let newState;
        if (workflow && strictConfig.requireWorkflowState) {
            // Strict mode execution
            newState = (0, actions_1.executeActionStrict)(currentState, action, payload, workflow, actions, invariants, strictConfig, (state, context, allowedActions, metadata) => (0, checkpoint_1.createCheckpoint)(state, context, allowedActions, metadata));
        }
        else {
            // Regular execution
            newState = action.effects(currentState, payload);
        }
        currentState = newState;
        if (onAction) {
            onAction(action, payload, newState);
        }
        return newState;
    }
    function getState() {
        return { ...currentState };
    }
    function getWorkflowState() {
        return currentState.workflowState;
    }
    return {
        executeAction,
        getState,
        getAllowedActions,
        render: () => render(currentState, getAllowedActions()),
        getWorkflowState
    };
}
exports.createRAMApp = createRAMApp;
//# sourceMappingURL=app.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAction = exports.checkInvariants = exports.getAllowedActions = void 0;
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
//# sourceMappingURL=actions.js.map
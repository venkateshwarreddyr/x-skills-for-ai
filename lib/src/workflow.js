"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWorkflowAction = exports.checkWorkflowInvariants = exports.runOnExit = exports.runOnEnter = exports.createWorkflow = exports.toXFSM = void 0;
const fsm_1 = require("@xstate/fsm");
const checkpoint_1 = require("./checkpoint");
function toXFSM(workflow) {
    const statesConfig = {};
    for (const [name, state] of Object.entries(workflow.states)) {
        statesConfig[name] = {
            on: state.transitions || {}
        };
    }
    return (0, fsm_1.createMachine)({
        initial: workflow.initial,
        states: statesConfig
    });
}
exports.toXFSM = toXFSM;
function createWorkflow(definition) {
    const machine = toXFSM(definition);
    const service = (0, fsm_1.interpret)(machine).start();
    function transition(currentState, actionName) {
        var _a;
        const current = service.state.value;
        if (current !== currentState) {
            throw new Error(`Current state mismatch: expected ${currentState}, got ${current}`);
        }
        const nextState = (_a = machine.states[current].on) === null || _a === void 0 ? void 0 : _a[actionName];
        if (!nextState) {
            throw new Error(`Invalid transition: Action ${actionName} is not allowed in state ${current}`);
        }
        service.send(actionName);
        return service.state.value;
    }
    function getAllowedActions(stateName) {
        const stateDef = definition.states[stateName];
        if (!stateDef) {
            throw new Error(`Unknown workflow state: ${stateName}`);
        }
        // For now, return from definition, but could be enhanced to use FSM
        return stateDef.actions;
    }
    function validateTransition(currentState, actionName) {
        try {
            transition(currentState, actionName);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    return {
        definition,
        service,
        get currentState() { return service.state.value; },
        transition,
        getAllowedActions,
        validateTransition
    };
}
exports.createWorkflow = createWorkflow;
function runOnEnter(stateName, workflow, state) {
    const stateDef = workflow.definition.states[stateName];
    if (stateDef === null || stateDef === void 0 ? void 0 : stateDef.onEnter) {
        stateDef.onEnter(state);
    }
}
exports.runOnEnter = runOnEnter;
function runOnExit(stateName, workflow, state) {
    const stateDef = workflow.definition.states[stateName];
    if (stateDef === null || stateDef === void 0 ? void 0 : stateDef.onExit) {
        stateDef.onExit(state);
    }
}
exports.runOnExit = runOnExit;
function checkWorkflowInvariants(stateName, workflow, state) {
    const stateDef = workflow.definition.states[stateName];
    if (stateDef === null || stateDef === void 0 ? void 0 : stateDef.invariants) {
        stateDef.invariants.forEach(invariant => invariant(state));
    }
}
exports.checkWorkflowInvariants = checkWorkflowInvariants;
function executeWorkflowAction(service, actionName, state, payload, applyEffects, workflow) {
    // 1) Validate allowed
    const allowed = Object.keys(service.machine.config.states[service.state.value].on);
    if (!allowed.includes(actionName)) {
        throw new Error(`Action ${actionName} not allowed`);
    }
    // 2) Pre-checkpoint
    (0, checkpoint_1.createCheckpoint)(state, '', [], { reason: `before ${actionName}` });
    // 3) Execute effects
    const newState = applyEffects(state, actionName, payload);
    // 4) Transition FSM
    service.send(actionName);
    // 5) Post-checkpoint invariants
    checkWorkflowInvariants(service.state.value, workflow, newState);
    return newState;
}
exports.executeWorkflowAction = executeWorkflowAction;
//# sourceMappingURL=workflow.js.map
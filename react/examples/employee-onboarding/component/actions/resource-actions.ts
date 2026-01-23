import { AppState } from "../state/types.js";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

/**
 * Action to assign equipment to the employee.
 */
export const AssignEquipment: Action = {
  name: "AssignEquipment",
  inputs: [
    { name: "item", type: "string", required: true }
  ],
  requires: (state: AppState) => true,
  effects: (state: AppState, payload: { item: string }) => ({
    ...state,
    employee: {
      ...state.employee,
      equipment: [
        ...state.employee.equipment,
        { ...payload, assigned: true }
      ]
    }
  })
};

/**
 * Action to complete training for the employee.
 */
export const CompleteTraining: Action = {
  name: "CompleteTraining",
  inputs: [
    { name: "course", type: "string", required: true }
  ],
  requires: (state: AppState) => true,
  effects: (state: AppState, payload: { course: string }) => ({
    ...state,
    employee: {
      ...state.employee,
      training: [
        ...state.employee.training,
        { ...payload, completed: true }
      ]
    }
  })
};

/**
 * Action to schedule a meeting for the employee.
 */
export const ScheduleMeeting: Action = {
  name: "ScheduleMeeting",
  inputs: [
    { name: "title", type: "string", required: true }
  ],
  requires: (state: AppState) => true,
  effects: (state: AppState, payload: { title: string }) => ({
    ...state,
    employee: {
      ...state.employee,
      meetings: [
        ...state.employee.meetings,
        { ...payload, scheduled: true }
      ]
    }
  })
};

/**
 * Action to create an account for the employee.
 */
export const CreateAccount: Action = {
  name: "CreateAccount",
  inputs: [
    { name: "type", type: "string", required: true }
  ],
  requires: (state: AppState) => true,
  effects: (state: AppState, payload: { type: string }) => ({
    ...state,
    employee: {
      ...state.employee,
      accounts: [
        ...state.employee.accounts,
        { ...payload, created: true }
      ]
    }
  })
};

/**
 * Action to mark resources as complete.
 * Requires all resources (equipment, training, meetings, accounts) to be assigned.
 * This action triggers the workflow transition to the next phase.
 */
export const MarkResourcesComplete: Action = {
  name: "MarkResourcesComplete",
  requires: (state: AppState) =>
    state.employee.equipment.length > 0 &&
    state.employee.training.length > 0 &&
    state.employee.meetings.length > 0 &&
    state.employee.accounts.length > 0,
  effects: (state: AppState) => state // No state change, just transition trigger
};

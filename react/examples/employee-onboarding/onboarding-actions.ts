import { AppState } from "./types.js";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

/**
 * Action to complete the entire onboarding process.
 * Requires all previous steps to be completed.
 */
export const CompleteOnboarding: Action = {
  name: "CompleteOnboarding",
  requires: (state: AppState) =>
    state.employee.incomes.length > 0 &&
    state.employee.incomes.every(i => i.verified) &&
    state.employee.documents.every(d => d.submitted) &&
    state.employee.equipment.length > 0 &&
    state.employee.training.length > 0 &&
    state.employee.meetings.length > 0 &&
    state.employee.accounts.length > 0,
  effects: (state: AppState) => ({
    ...state,
    workflow: "COMPLETED"
  })
};
import { AppState } from "./types.js";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

/**
 * Action to add a new income source for the employee.
 */
export const AddIncome: Action = {
  name: "AddIncome",
  inputs: [
    { name: "source", type: "string", required: true },
    { name: "amount", type: "number", required: true }
  ],
  requires: (state: AppState) => true,
  effects: (state: AppState, payload: { source: string; amount: number }) => ({
    ...state,
    employee: {
      ...state.employee,
      incomes: [
        ...state.employee.incomes,
        { source: payload.source, amount: Number(payload.amount), verified: false }
      ]
    }
  })
};

/**
 * Action to verify all income sources.
 * Marks all incomes as verified.
 */
export const VerifyIncome: Action = {
  name: "VerifyIncome",
  requires: (state: AppState) =>
    state.employee.incomes.some(i => !i.verified),
  effects: (state: AppState) => ({
    ...state,
    employee: {
      ...state.employee,
      incomes: state.employee.incomes.map(i => ({
        ...i,
        verified: true
      }))
    }
  })
};
import { AppState } from "./types";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

/**
 * Action to add a required document for the employee.
 */
export const AddDocument: Action = {
  name: "AddDocument",
  inputs: [
    { name: "name", type: "string", required: true }
  ],
  requires: (state: AppState) => true,
  effects: (state: AppState, payload: { name: string }) => ({
    ...state,
    employee: {
      ...state.employee,
      documents: [
        ...state.employee.documents,
        { ...payload, submitted: false }
      ]
    }
  })
};

/**
 * Action to submit all collected documents.
 * Marks all documents as submitted.
 */
export const SubmitDocuments: Action = {
  name: "SubmitDocuments",
  requires: (state: AppState) =>
    state.employee.documents.length > 0 &&
    state.employee.documents.some(d => !d.submitted),
  effects: (state: AppState) => ({
    ...state,
    employee: {
      ...state.employee,
      documents: state.employee.documents.map(d => ({
        ...d,
        submitted: true
      }))
    }
  })
};
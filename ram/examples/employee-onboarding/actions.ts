import { AppState } from "./types";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

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

export const actions = [AddIncome, VerifyIncome, AddDocument, SubmitDocuments, AssignEquipment, CompleteTraining, ScheduleMeeting, CreateAccount, CompleteOnboarding];
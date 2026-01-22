import { AppState } from "./types.js";

export const invariants = [
  (state: AppState) => {
    if (state.employee.incomes.some(i => i.amount <= 0)) {
      throw new Error("Income must be positive");
    }
  },
  (state: AppState) => {
    if (state.workflow === "INCOME_READY" && !state.employee.incomes.every(i => i.verified)) {
      throw new Error("All incomes must be verified before proceeding");
    }
  },
  (state: AppState) => {
    if (state.employee.documents.some(d => !d.name.trim())) {
      throw new Error("Document name cannot be empty");
    }
  },
  (state: AppState) => {
    if (state.workflow === "DOCUMENTS_READY" && !state.employee.documents.every(d => d.submitted)) {
      throw new Error("All documents must be submitted before proceeding");
    }
  },
  (state: AppState) => {
    if (state.employee.equipment.some(e => !e.item.trim())) {
      throw new Error("Equipment item cannot be empty");
    }
  },
  (state: AppState) => {
    if (state.workflow === "RESOURCES_READY" && state.employee.equipment.length === 0) {
      throw new Error("At least one equipment must be assigned before proceeding");
    }
  },
  (state: AppState) => {
    if (state.employee.training.some(t => !t.course.trim())) {
      throw new Error("Training course cannot be empty");
    }
  },
  (state: AppState) => {
    if (state.workflow === "RESOURCES_READY" && state.employee.training.length === 0) {
      throw new Error("At least one training must be completed before proceeding");
    }
  },
  (state: AppState) => {
    if (state.employee.meetings.some(m => !m.title.trim())) {
      throw new Error("Meeting title cannot be empty");
    }
  },
  (state: AppState) => {
    if (state.workflow === "RESOURCES_READY" && state.employee.meetings.length === 0) {
      throw new Error("At least one meeting must be scheduled before proceeding");
    }
  },
  (state: AppState) => {
    if (state.employee.accounts.some(a => !a.type.trim())) {
      throw new Error("Account type cannot be empty");
    }
  },
  (state: AppState) => {
    if (state.workflow === "RESOURCES_READY" && state.employee.accounts.length === 0) {
      throw new Error("At least one account must be created before completing onboarding");
    }
  }
];
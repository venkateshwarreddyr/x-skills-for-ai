import type { Action } from "x-skills-for-ai/types";

export const financeActions: Action[] = [
  {
    name: "RequestAdditionalDocuments",
    requires: (state: any) => state.status === "OPEN" && state.documents.length < 3,
    effects: (state: any) => ({
      ...state,
      status: "WAITING_FOR_DOCUMENTS"
    })
  },

  {
    name: "EscalateToFinanceDirector",
    requires: (state: any) =>
      state.status === "OPEN" &&
      state.amount > 100000 &&
      state.riskScore === "HIGH",
    effects: (state: any) => ({
      ...state,
      status: "PENDING_DIRECTOR_APPROVAL"
    })
  },

  {
    name: "RejectRequest",
    requires: (state: any) => state.status === "OPEN",
    effects: (state: any) => ({
      ...state,
      status: "REJECTED"
    })
  },

  {
    name: "ApproveAdjustment",
    requires: (state: any) =>
      state.status === "PENDING_DIRECTOR_APPROVAL",
    effects: (state: any) => ({
      ...state,
      status: "APPROVED"
    })
  }
];
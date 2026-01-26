import { useState, useEffect, resetHooks } from "x-skills-for-ai/hooks";
import type { Action } from "x-skills-for-ai/types";
import { getAllowedActions, checkInvariants, executeAction } from "x-skills-for-ai/actions";
import { renderMarkdown } from "x-skills-for-ai/renderer";

import { financeActions } from "./actions.js";
import { financeInvariants } from "./invariants.js";

const initialState = {
  caseId: "FIN-20391",
  status: "OPEN",
  amount: 125000,
  currency: "USD",
  reason: "Overbilled subscription",
  riskScore: "HIGH",
  documents: ["invoice", "payment_receipt"],
  auditLog: []
} as const;

export function FinancialAdjustmentApp(action?: Action, payload?: any) {
  resetHooks(FinancialAdjustmentApp);

  const [state, setState] = useState(initialState);

  if (action) {
    let nextState = executeAction(state, action, payload);

    // Append to audit log
    nextState = {
      ...nextState,
      auditLog: [
        ...(nextState.auditLog || state.auditLog),
        {
          action: action.name,
          actor: payload?.actor || "AI",
          reasoning: payload?.reasoning || "N/A",
          timestamp: new Date().toISOString()
        }
      ]
    };
    setState(nextState);
  }

  useEffect(() => {
    checkInvariants(state, financeInvariants);
  }, [state]);

  const allowedActions = getAllowedActions(state, financeActions);

  const goals = [
    "Resolve the case compliantly with minimal customer friction",
    "HIGH risk cases require dual approval",
    "Adjustments above $100k require Finance Director sign-off",
    "All actions must be auditable",
    "No direct approval from OPEN state for high-risk cases"
  ];

  const markdown = renderMarkdown({
    state,
    allowedActions,
    goals
  });

  return {
    markdown,
    allowedActions,
    state
  };
}
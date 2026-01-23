import { useState, useEffect, resetHooks } from "x-skills-for-ai/hooks";
import { getAllowedActions, checkInvariants, executeAction } from "x-skills-for-ai/actions";
import { renderMarkdown } from "x-skills-for-ai/renderer";
import { Action } from "x-skills-for-ai/types";
import { AppState, actions, invariants } from "./component";



const initialState: AppState = {
  workflow: "START",
  employee: { name: "John", incomes: [], documents: [], equipment: [], training: [], meetings: [], accounts: [] }
};



export function EmployeeOnboardingApp(action?: Action, payload?: any): { markdown: string; allowedActions: Action[]; state: AppState } {
  resetHooks(EmployeeOnboardingApp);

  const [state, setState] = useState(initialState);


  if (action) {
    const newState = executeAction(state, action, payload);
    setState(newState);
  }

  useEffect(() => {
    try {
      checkInvariants(state, invariants);
    } catch (error) {
      console.error('Invariant violation:', error);
    }
  }, [state]);



  const allowedActions = getAllowedActions(state, actions);

  const goals = [
    "Collect all income sources",
    "Verify all incomes",
    "Collect required documents",
    "Submit all documents",
    "Assign equipment",
    "Complete training",
    "Schedule meetings",
    "Create accounts",
    "Complete onboarding"
  ];



  const markdown = renderMarkdown({
    state,
    allowedActions,
    goals
  });

  return { markdown, allowedActions, state };
}
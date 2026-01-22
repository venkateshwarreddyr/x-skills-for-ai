import { useState, useEffect, resetHooks } from "../../lib/src/hooks";
import { getAllowedActions, checkInvariants, executeAction } from "../../lib/src/actions";
import { renderMarkdown } from "../../lib/src/renderer";
import { AppState } from "./types";
import { actions } from "./actions";
import { invariants } from "./invariants";
import { onboardingWorkflow } from "./workflow";
import { interpret } from "@xstate/fsm";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

const initialState: AppState = {
  workflow: "NEW",
  employee: { name: "John", incomes: [], documents: [], equipment: [], training: [], meetings: [], accounts: [] }
};

export function EmployeeOnboardingApp(action?: Action, payload?: any): { markdown: string; allowedActions: Action[]; state: AppState } {
  resetHooks(EmployeeOnboardingApp);

  const [state, setState] = useState<AppState>(initialState);
  const [workflowService] = useState(interpret(onboardingWorkflow).start());

  if (action) {
    const newState = executeAction(state, action, payload);
    // Send event to workflow machine
    workflowService.send(action.name);
    // Update workflow state
    newState.workflow = workflowService.state.value as any;
    setState(newState);
  }

  useEffect(() => {
    try {
      checkInvariants(state, invariants);
    } catch (error) {
      console.error('Invariant violation:', error);
    }
  }, [state]);

  const stateActions: { [key: string]: string[] } = {
    NEW: ['AddIncome'],
    INCOME_ADDED: ['VerifyIncome'],
    VERIFIED: ['AddDocument', 'SubmitDocuments'],
    DOCUMENTS_COLLECTED: ['AssignEquipment'],
    EQUIPMENT_ASSIGNED: ['CompleteTraining'],
    TRAINING_COMPLETED: ['ScheduleMeeting'],
    MEETINGS_SCHEDULED: ['CreateAccount'],
    ACCOUNTS_CREATED: ['CompleteOnboarding'],
    COMPLETED: []
  };

  const allowedActions = getAllowedActions(state, actions).filter(action =>
    stateActions[workflowService.state.value].includes(action.name)
  );

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

  const markdown = `# Employee Onboarding

## Workflow Phase
${workflowService.state.value}

## Employee Details
- **Name:** ${state.employee.name}
- **Incomes:** ${state.employee.incomes.map(i => `${i.source}: ${i.amount} (${i.verified ? 'Verified' : 'Unverified'})`).join(', ') || 'None'}
- **Documents:** ${state.employee.documents.map(d => `${d.name} (${d.submitted ? 'Submitted' : 'Pending'})`).join(', ') || 'None'}
- **Equipment:** ${state.employee.equipment.map(e => `${e.item} (${e.assigned ? 'Assigned' : 'Not Assigned'})`).join(', ') || 'None'}
- **Training:** ${state.employee.training.map(t => `${t.course} (${t.completed ? 'Completed' : 'Incomplete'})`).join(', ') || 'None'}
- **Meetings:** ${state.employee.meetings.map(m => `${m.title} (${m.scheduled ? 'Scheduled' : 'Not Scheduled'})`).join(', ') || 'None'}
- **Accounts:** ${state.employee.accounts.map(a => `${a.type} (${a.created ? 'Created' : 'Not Created'})`).join(', ') || 'None'}

## Allowed Actions
${allowedActions.map((action, index) => `${index + 1}. ${action.name}`).join('\n')}

## Goals
${goals.map(goal => `- ${goal}`).join('\n')}`;

  return { markdown, allowedActions, state };
}
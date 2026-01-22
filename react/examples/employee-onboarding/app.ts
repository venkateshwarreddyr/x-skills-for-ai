import { useState, useEffect, resetHooks } from "x-skills-for-ai/hooks";
import { getAllowedActions, checkInvariants, executeAction } from "x-skills-for-ai/actions";
import { AppState } from "./types.js";
import { actions } from "./actions.js";
import { invariants } from "./invariants.js";
import { onboardingWorkflow } from "./workflow.js";
import { interpret } from "@xstate/fsm";

type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: (state: any, payload?: any) => any;
  inputs?: { name: string; type: string; required: boolean }[];
};

const initialState: AppState = {
  workflow: "START",
  employee: { name: "John", incomes: [], documents: [], equipment: [], training: [], meetings: [], accounts: [] }
};

/**
 * Get allowed actions based on the current workflow phase.
 * @param workflowState Current workflow state value
 * @returns Array of allowed action names for the phase
 */
function getAllowedActionsForPhase(workflowState: string): string[] {
  const stateActions: { [key: string]: string[] } = {
    START: ['AddIncome', 'VerifyIncome'],
    INCOME_READY: ['AddDocument', 'SubmitDocuments'],
    DOCUMENTS_READY: ['AssignEquipment', 'CompleteTraining', 'ScheduleMeeting', 'CreateAccount', 'MarkResourcesComplete'],
    RESOURCES_READY: ['CompleteOnboarding'],
    COMPLETED: []
  };
  return stateActions[workflowState] || [];
}

/**
 * Get the list of business goals for the onboarding process.
 * @returns Array of goal descriptions
 */
function getBusinessGoals(): string[] {
  return [
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
}

/**
 * Render the employee onboarding status as markdown.
 * @param workflowState Current workflow phase
 * @param employee Employee data
 * @param allowedActions List of allowed actions
 * @param goals Business goals
 * @returns Markdown string
 */
function renderEmployeeMarkdown(
  workflowState: string,
  employee: any,
  allowedActions: Action[],
  goals: string[]
): string {
  return `# Employee Onboarding

## Workflow Phase
${workflowState}

## Employee Details
- **Name:** ${employee.name}
- **Incomes:** ${employee.incomes.map((i: any) => `${i.source}: ${i.amount} (${i.verified ? 'Verified' : 'Unverified'})`).join(', ') || 'None'}
- **Documents:** ${employee.documents.map((d: any) => `${d.name} (${d.submitted ? 'Submitted' : 'Pending'})`).join(', ') || 'None'}
- **Equipment:** ${employee.equipment.map((e: any) => `${e.item} (${e.assigned ? 'Assigned' : 'Not Assigned'})`).join(', ') || 'None'}
- **Training:** ${employee.training.map((t: any) => `${t.course} (${t.completed ? 'Completed' : 'Incomplete'})`).join(', ') || 'None'}
- **Meetings:** ${employee.meetings.map((m: any) => `${m.title} (${m.scheduled ? 'Scheduled' : 'Not Scheduled'})`).join(', ') || 'None'}
- **Accounts:** ${employee.accounts.map((a: any) => `${a.type} (${a.created ? 'Created' : 'Not Created'})`).join(', ') || 'None'}

## Allowed Actions
${allowedActions.map((action, index) => `${index + 1}. ${action.name}`).join('\n')}

## Goals
${goals.map(goal => `- ${goal}`).join('\n')}`;
}

export function EmployeeOnboardingApp(action?: Action, payload?: any): { markdown: string; allowedActions: Action[]; state: AppState } {
  resetHooks(EmployeeOnboardingApp);

  const [state, setState] = useState(initialState);
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

  // Define allowed actions for each workflow phase
  const stateActions: { [key: string]: string[] } = {
    START: ['AddIncome', 'VerifyIncome'],
    INCOME_READY: ['AddDocument', 'SubmitDocuments'],
    DOCUMENTS_READY: ['AssignEquipment', 'CompleteTraining', 'ScheduleMeeting', 'CreateAccount', 'MarkResourcesComplete'],
    RESOURCES_READY: ['CompleteOnboarding'],
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
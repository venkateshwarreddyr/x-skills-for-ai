import { State, Action, Invariant, AllowedAction } from './types';
import { getAllowedActions } from './engine';

export interface AIContext {
  current_state: State;
  allowed_actions: {
    name: string;
    description?: string;
  }[];
  blocked_actions: {
    name: string;
    reason: string;
  }[];
  invariants: {
    name: string;
    description?: string;
  }[];
  goals?: string[];
  recent_events?: any[];
}

export function generateAIContext(
  state: State,
  actions: Action[],
  invariants: Invariant[],
  goals?: string[],
  recentEvents?: any[]
): AIContext {
  const allowedActions = getAllowedActions(state, actions);

  const allowed = allowedActions
    .filter(aa => aa.allowed)
    .map(aa => ({
      name: aa.action.name,
      description: `Action: ${aa.action.name}`
    }));

  const blocked = allowedActions
    .filter(aa => !aa.allowed)
    .map(aa => ({
      name: aa.action.name,
      reason: aa.reason || 'Unknown'
    }));

  const invs = invariants.map(inv => ({
    name: inv.name,
    description: `Invariant: ${inv.name}`
  }));

  return {
    current_state: state,
    allowed_actions: allowed,
    blocked_actions: blocked,
    invariants: invs,
    goals,
    recent_events: recentEvents
  };
}

export function generateMarkdownContext(context: AIContext): string {
  let md = '# AI Context\n\n';

  md += '## Current State\n';
  md += '```json\n' + JSON.stringify(context.current_state, null, 2) + '\n```\n\n';

  md += '## Allowed Actions\n';
  if (context.allowed_actions.length === 0) {
    md += 'No actions are currently allowed.\n\n';
  } else {
    context.allowed_actions.forEach(action => {
      md += `- **${action.name}**\n`;
    });
    md += '\n';
  }

  md += '## Blocked Actions\n';
  if (context.blocked_actions.length === 0) {
    md += 'No actions are blocked.\n\n';
  } else {
    context.blocked_actions.forEach(action => {
      md += `- **${action.name}**: ${action.reason}\n`;
    });
    md += '\n';
  }

  md += '## Invariants\n';
  context.invariants.forEach(inv => {
    md += `- ${inv.name}\n`;
  });
  md += '\n';

  if (context.goals) {
    md += '## Goals\n';
    context.goals.forEach(goal => {
      md += `- ${goal}\n`;
    });
    md += '\n';
  }

  if (context.recent_events && context.recent_events.length > 0) {
    md += '## Recent Events\n';
    context.recent_events.forEach(event => {
      md += `- ${JSON.stringify(event)}\n`;
    });
    md += '\n';
  }

  return md;
}
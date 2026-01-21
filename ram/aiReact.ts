// aiReact.ts
export type Effect = (state: any, payload?: any) => any;
export type Action = {
  name: string;
  requires: (state: any) => boolean;
  effects: Effect;
  payloadSchema?: any; // optional schema for payload
};

export function useAIState(initialState: any) {
  let state = { ...initialState };
  const setState = (newState: any) => {
    state = { ...state, ...newState };
    return state;
  };
  return [state, setState] as const;
}

export function useAIEffect(callback: () => void, deps: any[]) {
  callback();
}

export function getAllowedActions(state: any, actions: Action[]) {
  return actions.filter((a) => a.requires(state));
}

export function checkInvariants(state: any, invariants: ((s: any) => void)[]) {
  invariants.forEach((inv) => inv(state));
}

export function renderMarkdown(options: {
  state: any;
  allowedActions: Action[];
  goals: string[];
}) {
  const { state, allowedActions, goals } = options;
  let md = `# Current State\n\n`;
  md += JSON.stringify(state, null, 2) + "\n\n";

  md += "# Allowed Actions\n";
  allowedActions.forEach((a, i) => {
    md += `${i + 1}. ${a.name}\n`;
  });

  md += "\n# Goals\n";
  goals.forEach((g) => {
    md += `- ${g}\n`;
  });

  return md;
}

export function renderHTML(options: {
  state: any;
  allowedActions: Action[];
  goals: string[];
  onAction: (action: Action, payload?: any) => void;
}) {
  const { state, allowedActions, goals, onAction } = options;
  let html = `<h1>Current State</h1><pre>${JSON.stringify(state, null, 2)}</pre>`;

  html += `<h2>Allowed Actions</h2>`;
  allowedActions.forEach((a, i) => {
    if (a.payloadSchema) {
      // For actions with payload, render form
      if (a.name === 'AddTodo') {
        html += `<form onsubmit="handleAction('${a.name}', {title: this.title.value}); return false;">
          <input type="text" name="title" placeholder="Enter todo title" required>
          <button type="submit">${a.name}</button>
        </form>`;
      }
    } else {
      html += `<button onclick="handleAction('${a.name}')">${a.name}</button>`;
    }
  });

  html += `<h2>Goals</h2><ul>`;
  goals.forEach((g) => {
    html += `<li>${g}</li>`;
  });
  html += `</ul>`;

  return html;
}
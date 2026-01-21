"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarkdown = void 0;
function renderMarkdown(options) {
    const { state, allowedActions, goals } = options;
    let md = '# Current State\n\n';
    md += '```json\n' + JSON.stringify(state, null, 2) + '\n```\n\n';
    md += '# Allowed Actions\n';
    allowedActions.forEach((action, i) => {
        md += `${i + 1}. ${action.name}\n`;
        if (action.inputs) {
            md += '   - Form fields:\n';
            action.inputs.forEach(input => {
                md += `     - ${input.name} (${input.type}) [${input.required ? 'required' : 'optional'}]\n`;
            });
        }
        md += '\n';
    });
    md += '# Goals\n';
    goals.forEach(goal => {
        md += `- ${goal}\n`;
    });
    return md;
}
exports.renderMarkdown = renderMarkdown;

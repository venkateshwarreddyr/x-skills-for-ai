// exp/x-skills-for-ai/browser/lib/skill-registry.js
let skills = [];

export function defineSkill(skill) {
  // Idempotent registration
  if (!skills.find(s => s.id === skill.id)) {
    skills.push(skill);
  }
}

window.defineSkill = defineSkill;

export function getSkills() {
  return skills;
}

// Global XSKILLS object for Playwright RPC
window.__XSKILLS__ = {
  async inspect() {
    return {
      state: window.globalAppState || {},
      skills: getSkills(),
      view: {
        markdown: typeof window.getMarkdownView === 'function' ? window.getMarkdownView() : '# App not initialized'
      }
    };
  },

  async executeSkill(skillId, payload = {}) {
    const skill = getSkills().find(s => s.id === skillId);
    if (!skill) {
      return { ok: false, error: `Skill not found: ${skillId}` };
    }
    try {
      skill.handler(payload);
      return {
        ok: true,
        state: window.globalAppState || {},
        view: {
          markdown: typeof window.getMarkdownView === 'function' ? window.getMarkdownView() : '# View not available'
        }
      };
    } catch (error) {
      return { 
        ok: false, 
        error: error.message,
        state: window.globalAppState || {}
      };
    }
  }
};
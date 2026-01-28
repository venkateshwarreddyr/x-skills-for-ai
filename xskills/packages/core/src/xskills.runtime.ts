import { XSkillDefinition } from './types';

export class XSkillsRuntime {
  private skills: Map<string, XSkillDefinition> = new Map();

  register(def: XSkillDefinition): () => void {
    if (this.skills.has(def.id)) {
      throw new Error(`Skill with id '${def.id}' is already registered.`);
    }
    this.skills.set(def.id, def);
    return () => this.skills.delete(def.id);
  }

  async execute(id: string): Promise<void> {
    const skill = this.skills.get(id);
    if (!skill) {
      const available = Array.from(this.skills.keys()).join(', ');
      throw new Error(`No skill found with id '${id}'.${available ? ` Available: ${available}` : ''}`);
    }
    await skill.handler();
  }

  inspect(): XSkillDefinition[] {
    return Array.from(this.skills.values());
  }
}
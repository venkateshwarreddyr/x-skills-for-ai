import { XSkillDefinition, ExecutionContext } from './types';

export class XSkillsRuntime {
  private skills: Map<string, XSkillDefinition> = new Map();

  register(def: XSkillDefinition): () => void {
    const id = def.id;
    if (this.skills.has(id)) {
      throw new Error(`Skill ${id} already registered.`);
    }
    this.skills.set(id, def);
    return () => {
      this.skills.delete(id);
    };
  }

  async execute(id: string, ctx?: ExecutionContext): Promise<void> {
    const skill = this.skills.get(id);
    if (!skill) {
      const available = Array.from(this.skills.keys()).join(', ');
      throw new Error(`No skill found for id '${id}'. Available ids: ${available}`);
    }

    const startTime = Date.now();
    const telemetryBase = {
      skillId: id,
      actor: String(ctx?.actor ?? 'unknown'),
    };

    try {
      await skill.handler();
      const endTime = Date.now();
      const duration = endTime - startTime;
      const eventData = {
        ...telemetryBase,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration,
        status: 'success' as const,
      };
      console.log('XSkills telemetry:', eventData);
      window.dispatchEvent(new CustomEvent('xskills:telemetry', { detail: eventData }));
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const eventData = {
        ...telemetryBase,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration,
        status: 'error' as const,
        error: error instanceof Error ? error.message : String(error),
        errorCode: 'UNKNOWN',
      };
      console.error('XSkills telemetry:', eventData);
      window.dispatchEvent(new CustomEvent('xskills:telemetry', { detail: eventData }));
      throw error;
    }
  }

  inspect(): XSkillDefinition[] {
    return Array.from(this.skills.values());
  }
}
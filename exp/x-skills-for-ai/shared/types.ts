// Shared types for x-skills-for-ai Pattern 1
export interface SkillDescriptor {
  id: string;
  description: string;
  inputSchema?: any;
}

export interface InspectResult {
  state: Record<string, any>;
  skills: SkillDescriptor[];
  view: {
    markdown: string;
  };
}

export interface ExecuteResult {
  ok: boolean;
  state: Record<string, any>;
  events?: any[];
  view: {
    markdown: string;
  };
}

export interface Skill {
  id: string;
  description: string;
  inputSchema?: any;
  handler: (input: any) => void;
}
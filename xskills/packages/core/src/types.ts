export interface XSkillDefinition {
  id: string;
  description: string;
  handler: () => Promise<void>;
}
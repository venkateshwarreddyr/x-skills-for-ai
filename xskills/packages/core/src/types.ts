export type ExecutionContext = Record<string, unknown>;

export interface XSkillDefinition {
  id: string;
  description: string;
  handler: () => Promise<void>;
  /** Optional authorization hook, unused by default */
  canExecute?: (ctx: ExecutionContext) => boolean;
}
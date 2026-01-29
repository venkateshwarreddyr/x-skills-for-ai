export type ExecutionContext = Record<string, unknown>;
export type Params = Record<string, unknown>;

export interface XSkillDefinition {
  id: string;
  description: string;
  handler: (input?: Params) => Promise<void>;
  /** Optional authorization hook, unused by default */
  canExecute?: (ctx: ExecutionContext) => boolean;
}
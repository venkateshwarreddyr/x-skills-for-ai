import { XSkillDefinition, ExecutionContext } from './types';
import { XSkillsRuntime } from './xskills.runtime';

export { XSkillsRuntime };
export type { XSkillDefinition, ExecutionContext };

export function getXSkillsRuntime(): XSkillsRuntime {
  if (typeof window === 'undefined') {
    throw new Error('XSkillsRuntime is only available in browser environments.');
  }
  const w: any = window;
  if (!w.__XSKILLS__) {
    w.__XSKILLS__ = new XSkillsRuntime();
  }
  return w.__XSKILLS__;
}

// Type augmentation
declare global {
  interface Window {
    __XSKILLS__?: XSkillsRuntime;
  }
}

// Initialize global if in browser
if (typeof window !== 'undefined') {
  getXSkillsRuntime();
}
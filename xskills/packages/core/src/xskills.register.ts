import { getXSkillsRuntime, XSkillDefinition } from './index';

/**
 * Convenience function to register a skill.
 * Returns the unregister function.
 */
export function register(def: XSkillDefinition): () => void {
  return getXSkillsRuntime().register(def);
}
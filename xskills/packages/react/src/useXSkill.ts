import { useEffect } from 'react';
import { XSkillDefinition, getXSkillsRuntime } from 'xskills-core';

/**
 * React hook to register an XSkill with automatic lifecycle management.
 * Registers on mount, unregisters on unmount.
 */
export function useXSkill(def: XSkillDefinition): void {
  useEffect(() => {
    const unregister = getXSkillsRuntime().register(def);
    return unregister;
  }, [def.id, def.handler]);
}
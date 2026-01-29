import { onMount, onDestroy } from 'svelte';
import { XSkillDefinition, getXSkillsRuntime } from '@x-skills-for-ai/core';

/**
 * Svelte "hook" to register an XSkill with automatic lifecycle management.
 * Call at top-level in <script>.
 * Registers on mount, unregisters on destroy.
 */
export function useXSkill(def: XSkillDefinition): void {
  onMount(() => {
    const unregister = getXSkillsRuntime().register(def);
    onDestroy(unregister);
  });
}
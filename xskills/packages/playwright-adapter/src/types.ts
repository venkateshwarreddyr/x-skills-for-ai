import type { Page } from '@playwright/test'
import type { ExecutionContext, XSkillDefinition } from '@x-skills-for-ai/core'

type InspectSkill = Pick<XSkillDefinition, 'id' | 'description'>

export type XSkillsPage = Page & {
  executeSkill: (
    skillId: string,
    payload?: ExecutionContext
  ) => Promise<void>;

  inspectSkills: () => Promise<InspectSkill[]>;
}

// This file only provides type augmentation. Implementation is attached at runtime
// via attachXSkills in helpers.

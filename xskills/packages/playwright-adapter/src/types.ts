import type { Page } from '@playwright/test'

declare module '@playwright/test' {
  interface Page {
    executeSkill: (
      skillId: string,
      payload?: unknown
    ) => Promise<void>

    inspectSkills: () => Promise<{
      id: string
      description?: string
    }[]>
  }
}

// This file only provides type augmentation. Implementation is attached at runtime
// via attachXSkills in helpers.

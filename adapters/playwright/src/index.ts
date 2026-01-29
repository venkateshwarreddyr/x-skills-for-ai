import type { XSkillsPage } from './types'
import { test as base } from '@playwright/test'
import { attachXSkills } from './helpers'

export { attachXSkills }

export const withXSkills = base.extend<{ page: XSkillsPage }>({
  page: async (
    { page }: { page: XSkillsPage },
    use: (page: XSkillsPage) => Promise<void>
  ) => {
    attachXSkills(page)
    await use(page)
  },
})

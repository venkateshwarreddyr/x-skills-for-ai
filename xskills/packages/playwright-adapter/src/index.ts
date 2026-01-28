import type { Page } from '@playwright/test'
import { test as base } from '@playwright/test'
import './types'
import { attachXSkills } from './helpers'

export { attachXSkills }

export const withXSkills = base.extend<{ page: Page }>({
  page: async (
    { page }: { page: Page },
    use: (page: Page) => Promise<void>
  ) => {
    attachXSkills(page)
    await use(page)
  },
})

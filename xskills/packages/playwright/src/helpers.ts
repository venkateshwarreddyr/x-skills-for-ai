import type { Page } from '@playwright/test'

export function attachXSkills(page: Page) {
  page.executeSkill = async function (skillId: string, payload?: unknown) {
    return this.evaluate(
      ({ skillId, payload }: { skillId: string; payload: unknown }) => {
        if (!(window as any).__XSKILLS__) {
          throw new Error(`XSkills runtime not found while executing skill: ${skillId}`)
        }
        return (window as any).__XSKILLS__.execute(skillId, payload)
      },
      { skillId, payload }
    )
  }

  page.inspectSkills = async function () {
    return this.evaluate(() => {
      if (!(window as any).__XSKILLS__) {
        return []
      }
      return (window as any).__XSKILLS__.inspect()
    })
  }
}

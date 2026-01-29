import type { Page } from '@playwright/test'
import type { ExecutionContext } from '@x-skills-for-ai/core'
import type { XSkillsPage } from './types'

export function attachXSkills(page: Page): asserts page is XSkillsPage {
  const executeSkill: XSkillsPage['executeSkill'] = async function (this: Page, skillId: string, payload?: ExecutionContext) {
    return this.evaluate(
      ({ skillId, payload }: { skillId: string; payload: ExecutionContext | undefined }) => {
        if (!(window as any).__XSKILLS__) {
          throw new Error(`XSkills runtime not found while executing skill: ${skillId}`)
        }
        return (window as any).__XSKILLS__.execute(skillId, payload)
      },
      { skillId, payload }
    )
  }

  ;(page as any).executeSkill = executeSkill

  const inspectSkills: XSkillsPage['inspectSkills'] = async function (this: Page) {
    return this.evaluate(() => {
      if (!(window as any).__XSKILLS__) {
        return []
      }
      return (window as any).__XSKILLS__.inspect()
    })
  }

  ;(page as any).inspectSkills = inspectSkills
}

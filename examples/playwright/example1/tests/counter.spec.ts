import { test as base, expect } from "@playwright/test"
import { withXSkills } from "@x-skills-for-ai/playwright-adapter"

const test = withXSkills

test("counter works via xskills (no UI clicks)", async ({ page }) => {
  // Load existing react-counter app
  await page.goto("/example-app-with-x-skills-for-ai/")
  await page.waitForSelector("[data-testid='count']")
  // Ensure runtime + skills exist
  const skills = await page.inspectSkills()
  const ids = skills.map(s => s.id)

  expect(ids).toContain("increment")
  expect(ids).toContain("decrement")

  // Execute skills directly
  await page.executeSkill("increment")
  await page.executeSkill("increment")
  await page.executeSkill("decrement")

  // Assert final UI state
  const text = await page.locator("[data-testid='count']").textContent()
  expect(text).toBe("Counter: 1")
})
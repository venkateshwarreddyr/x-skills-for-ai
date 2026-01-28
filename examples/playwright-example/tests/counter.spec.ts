import { test, expect } from "@playwright/test"
import { executeSkill, inspectSkills } from "@x-skills-for-ai/playwright-adapter"

test("counter works via xskills (no UI clicks)", async ({ page }) => {
  // Load existing react-counter app
  await page.goto("/")

  // Ensure runtime + skills exist
  const skills = await inspectSkills(page)
  const ids = skills.map(s => s.id)

  expect(ids).toContain("increment")
  expect(ids).toContain("decrement")

  // Execute skills directly
  await executeSkill(page, "increment")
  await executeSkill(page, "increment")
  await executeSkill(page, "decrement")

  // Assert final UI state
  const text = await page.locator("[data-testid='count']").textContent()
  expect(text).toBe("Counter: 1")
})
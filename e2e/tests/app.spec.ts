import { test, expect } from "@playwright/test";

test("create and complete a task", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[placeholder="Title"]', "Title 01");
  await page.fill('textarea[placeholder="Description (optional)"]', "desc");
  await page.click("text=Add Task");

  await page.waitForSelector("text=Title 01");
  expect(await page.locator("text=Title 01").count()).toBeGreaterThan(0);

  await page.click("text=Title 01 >> .. >> text=Done");
  await expect(page.locator("text=Title 01")).toHaveCount(0);
});

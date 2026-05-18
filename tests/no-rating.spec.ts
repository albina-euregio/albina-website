import { test, expect } from "@playwright/test";

test("no-rating", async ({ page }) => {
  await page.goto("bulletin/2022-11-27");

  // Click on Salzburg
  await page.locator("path:nth-child(45)").first().click();
  await expect(page.getByAltText("No rating")).toBeVisible();
  await expect(page.getByText("LWD Salzburg")).toBeVisible();

  // Click on Tyrol
  await page.locator("path").nth(4).click();
  await expect(page.getByAltText("No rating")).toBeVisible();
  await page.getByText("Go to blog").click();
  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "State /" })
      .getByRole("combobox")
  ).toHaveValue("AT-07");
});

import { test, expect } from "@playwright/test";

test("no-rating", async ({ page }) => {
  // Select Salzburg (AT-05) via URL param to avoid fragile nth-SVG-path clicks
  await page.goto("bulletin/2022-11-27?region=AT-05-013");
  await expect(page.getByAltText("No rating")).toBeVisible();
  await expect(page.getByText("LWD Salzburg")).toBeVisible();

  // Select Tyrol (AT-07) via URL param
  await page.goto("bulletin/2022-11-27?region=AT-07-15");
  await expect(page.getByAltText("No rating")).toBeVisible();
  await page.getByText("Go to blog").click();
  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "State /" })
      .getByRole("combobox")
  ).toHaveValue("AT-07");
});

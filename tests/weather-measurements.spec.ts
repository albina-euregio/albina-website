import { test, expect } from "@playwright/test";

test("weather/stations?view=table", async ({ page }) => {
  await page.goto("weather/stations?view=table");

  // Wait for table data to load - first data row should be visible
  const firstRow = page.getByRole("row").nth(1);
  await firstRow.waitFor({ state: "visible", timeout: 10000 });
  await expect(firstRow).toHaveText(/^A/);

  await page.getByRole("link", { name: "Station: Invert sort" }).click();
  await expect(firstRow).toHaveText(/^Z/);

  await page.getByRole("link", { name: "Elevation: Sort descending" }).click();
  await expect(firstRow).toHaveText(/Weißseespitze|Erzherzog-Johann-Hütte/);

  await expect(await page.getByRole("row").count()).toBeGreaterThan(300);

  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("gallreideschrofen");
  await page.getByPlaceholder("Search").press("Enter");
  await firstRow.getByRole("cell").nth(0).click();

  await expect(
    page.locator(".modal-weatherstation").getByRole("heading").first()
  ).toHaveText("Gallreideschrofen 2180 m");
  await page
    .locator("#section-weather-table")
    .getByRole("button", { name: " Close" })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
});

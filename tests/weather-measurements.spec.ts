import { test, expect } from "@playwright/test";

test("weather/measurements", async ({ page }) => {
  await page.goto("weather/measurements");

  const firstRow = page.getByRole("row").nth(1);
  await expect(firstRow).toHaveText(/Achenkirch|Abtenau/);

  await page.getByRole("link", { name: "Station: Invert sort" }).click();
  await expect(firstRow).toHaveText(/Zwölferkogel|Zürs/);

  await page.getByRole("link", { name: "Elevation: Sort descending" }).click();
  await expect(firstRow).toHaveText(/Weißseespitze|Erzherzog-Johann-Hütte/);

  await expect(await page.getByRole("row").count()).toBeGreaterThan(300);

  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("gallreideschrofen");
  await page.getByPlaceholder("Search").press("Enter");
  await firstRow.getByRole("cell").nth(0).click();

  await expect(
    page.locator(".modal-weatherstation").getByRole("heading")
  ).toHaveText("Gallreideschrofen 2180 m");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.locator("h1")).toContainText("Station Measurements");
});

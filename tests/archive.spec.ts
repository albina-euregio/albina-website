import { test, expect } from "@playwright/test";

test("archive", async ({ page }) => {
  await page.goto("more/archive");

  const year = page.locator("text=Year").locator("..");
  await year.locator(".selectric").selectOption("2024/2025");

  const month = page.locator("text=Month").locator("..");
  await month.locator(".selectric").selectOption("Mar 25");

  const preview = page
    .getByRole("row", { name: "29 March 2025" })
    .locator(".map-preview");
  await expect(preview).toHaveAttribute("href", "/bulletin/2025-03-29");
  await expect(preview.getByRole("img")).toHaveAttribute(
    "src",
    /bulletins\/2025-03-29\/\/.*EUREGIO_.*\.jpg$/
  );

  await page
    .getByRole("listitem")
    .filter({ hasText: "Region" })
    .getByRole("combobox")
    .selectOption("AT-07-22");

  await expect(page).toHaveURL(
    "more/archive?month=15&year=2024&region=AT-07-22"
  );

  await expect(preview).toHaveAttribute("href", "/bulletin/2025-03-29");
  await expect(preview.getByRole("img")).toHaveAttribute(
    "src",
    /bulletins\/2025-03-29\/.*\.jpg$/
  );

  const pdf = page
    .getByRole("row", { name: "29 March 2025" })
    .getByRole("link", { name: "PDF" });
  await expect(pdf).toHaveAttribute(
    "href",
    /api\/bulletins\/pdf\?date=2025-03-28T16:00:00.000Z&region=EUREGIO&microRegionId=AT-07-22&lang=en&grayscale=false$/
  );
});

test("archive headless ", async ({ page }) => {
  await page.goto("more/archive?headless=1");

  await expect(page.locator("header")).toContainText("Archive");
  await expect(page.locator(".page-header")).toHaveCount(0);

  await page.getByRole("link", { name: "Back to Avalanche Forecast" }).click();

  await expect(page).toHaveURL("bulletin/latest");
  await expect(page.locator(".page-header")).toHaveCount(0);
});

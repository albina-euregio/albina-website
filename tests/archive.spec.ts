import { test, expect } from "@playwright/test";

test("archive", async ({ page }) => {
  await page.goto("more/archive");

  const year = page.locator("text=Year").locator("..");
  await year.locator(".selectric").selectOption("2020");

  const month = page.locator("text=Month").locator("..");
  await month.locator(".selectric").selectOption("15");

  const preview = page
    .getByRole("row", { name: "Tuesday, 16/03/2021" })
    .locator(".map-preview");
  await expect(preview).toHaveAttribute("href", "/bulletin/2021-03-16");
  await expect(preview.getByRole("img")).toHaveAttribute(
    "src",
    "https://static.avalanche.report/bulletins/2021-03-16//fd_EUREGIO_thumbnail.jpg"
  );

  await page
    .getByRole("listitem")
    .filter({ hasText: "Region" })
    .getByRole("combobox")
    .selectOption("AT-07-22");
  await page.goto(
    "http://localhost:3000/more/archive?month=15&year=2020&region=AT-07-22"
  );

  await page.goto(
    "http://localhost:3000/more/archive?month=15&year=2020&region=AT-07-22"
  );
  await expect(preview).toHaveAttribute("href", "/bulletin/2021-03-16");
  await expect(preview.getByRole("img")).toHaveAttribute(
    "src",
    "https://static.avalanche.report/bulletins/2021-03-16//EUREGIO_29864acd-f3db-47e9-9416-3ae9ed4db3cd.jpg"
  );

  const pdf = page
    .getByRole("row", { name: "Tuesday, 16/03/2021" })
    .getByRole("link", { name: "PDF" });
  await expect(pdf).toHaveAttribute(
    "href",
    "https://api.avalanche.report/albina/api/bulletins/pdf?date=2021-03-15T23:00:00.000Z&region=EUREGIO&bulletinId=29864acd-f3db-47e9-9416-3ae9ed4db3cd&lang=en&grayscale=false"
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

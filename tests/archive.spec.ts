import { test, expect } from "@playwright/test";

test("archive", async ({ page }) => {
  await page.goto("/more/archive");

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
});

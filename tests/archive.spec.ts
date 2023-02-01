import { test, expect } from "@playwright/test";

test("archive", async ({ page }) => {
  await page.goto("/more/archive");
  await page.waitForTimeout(200); // selectric

  const year = page.locator("text=Year").locator("..");
  await year.locator(".selectric").click();
  await year.locator(".selectric-items").getByText("2020/2021").click();

  const month = page.locator("text=Month").locator("..");
  await month.locator(".selectric").click();
  await month.locator(".selectric-items").getByText("Mar 21").click();

  const preview = page
    .getByRole("row", { name: "Tuesday, 16/03/2021" })
    .locator(".map-preview");
  await expect(preview).toHaveAttribute("href", "/bulletin/2021-03-16");
  await expect(preview.getByRole("img")).toHaveAttribute(
    "src",
    "https://static.avalanche.report/bulletins/2021-03-16//fd_albina_thumbnail.jpg"
  );
});

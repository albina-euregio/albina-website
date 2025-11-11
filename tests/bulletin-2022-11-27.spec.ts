import { test, expect } from "@playwright/test";

test("bulletin/2022-11-27", async ({ page }) => {
  await page.goto("bulletin/2022-11-27");

  const controlbar = page.locator(".controlbar");
  await expect(controlbar).toHaveText(
    /Currently no daily avalanche forecast available/
  );
  await expect(controlbar).toHaveText(
    /Current information and announcements are posted on our blog/
  );
  await expect(controlbar.locator("a")).toHaveAttribute("href", /blog/);

  await expect(page.getByRole("link", { name: "PDF" })).toHaveCount(0);

  const yesterday = page.locator(".bulletin-flipper a").first();
  await expect(yesterday).toHaveText("26/11/2022");
  await expect(yesterday).toHaveAttribute("href", /bulletin\/2022-11-26/);
});

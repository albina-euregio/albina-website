import { test, expect } from "@playwright/test";

test("blog", async ({ page }) => {
  await page.goto("blog");
  await expect(page.locator("header")).toContainText("Blog Posts");

  await page
    .getByRole("listitem")
    .filter({ hasText: "Language" })
    .getByRole("combobox")
    .selectOption("de");
  await page
    .getByRole("listitem")
    .filter({ hasText: "State / Province" })
    .getByRole("combobox")
    .selectOption("AT-07");
  await page
    .getByRole("listitem")
    .filter({ hasText: "Year" })
    .getByRole("combobox")
    .selectOption("2018");

  await expect(page.locator("#page-main")).toContainText(
    "Monday, 31/12/2018, 19:10"
  );
  await expect(page.locator("#page-main")).toContainText(
    "Vom Waldgrenzbereich aufwärts zahlreiche, störanfällige Triebschneepakete. Wir raten zu Zurückhaltung im Steilgelände!"
  );

  await page
    .getByRole("link", {
      name: "Vom Waldgrenzbereich aufwärts zahlreiche, störanfällige Triebschneepakete. Wir raten zu Zurückhaltung im Steilgelände!"
    })
    .click();

  await expect(page.getByRole("heading").first()).toContainText(
    "Vom Waldgrenzbereich aufwärts zahlreiche, störanfällige Triebschneepakete. Wir raten zu Zurückhaltung im Steilgelände!"
  );
  await expect(page.locator("#page-main")).toContainText(
    "Ähnlich wie der 25.12.2018 stellt auch der 01.01.2019 als erster Schönwettertag nach einer stürmischen Schneefallperiode einen sehr unfallträchtigen Tag dar!"
  );

  await page.getByRole("link", { name: "All Blog Posts" }).first().click();
});

test("blog headless", async ({ page }) => {
  await page.goto("blog/?headless=1&province=AT-02&searchLang=de");

  await expect(page.locator("header")).toContainText("Blog Posts");
  await expect(page.locator(".page-header")).toHaveCount(0);

  await page.getByRole("link", { name: "Back to Avalanche Forecast" }).click();

  await expect(page).toHaveURL("bulletin/latest");
  await expect(page.locator(".page-header")).toHaveCount(0);

  await page.goBack();

  await expect(page.locator("header")).toContainText("Blog Posts");
  await expect(page.locator(".page-header")).toHaveCount(0);
});

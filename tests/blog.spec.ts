import { test, expect } from "@playwright/test";

test("blog", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator("header")).toContainText("Blog Posts");

  await page.getByRole("combobox", { name: "Language" }).selectOption("it");
  await page.getByRole("combobox", { name: "Language" }).selectOption("de");
  await page
    .getByRole("combobox", { name: "State / Province" })
    .selectOption("AT-07");
  await page.getByRole("combobox", { name: "Year" }).selectOption("2018");

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

  await expect(page.getByRole("heading")).toContainText(
    "Vom Waldgrenzbereich aufwärts zahlreiche, störanfällige Triebschneepakete. Wir raten zu Zurückhaltung im Steilgelände!"
  );
  await expect(page.locator("#page-main")).toContainText(
    "Ähnlich wie der 25.12.2018 stellt auch der 01.01.2019 als erster Schönwettertag nach einer stürmischen Schneefallperiode einen sehr unfallträchtigen Tag dar!"
  );

  await page.getByRole("link", { name: "All Blog Posts" }).first().click();
});

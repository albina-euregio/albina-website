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
    .selectOption("2025");

  await expect(
    page.getByRole("link", {
      name: /saisonrückblick \d+\/\d+/i
    })
  ).toMatchAriaSnapshot(`
    - link /.*, \\d+\\/\\d+\\/\\d+, \\d+:\\d+ \\(\\d+ days ago\\) Tyrol.*DE/:
      - list:
        - listitem:
          - time: /.*, \\d+\\/\\d+\\/\\d+, \\d+:\\d+ \\(\\d+ days ago\\)/
        - listitem: /Tyrol/
        - listitem: DE
      - heading /(SAISONRÜCKBLICK|Saisonrückblick) \\d+\\/\\d+/ [level=1]
  `);
  await page
    .getByRole("link", {
      name: /saisonrückblick \d+\/\d+/i
    })
    .click();
  await expect(page.getByRole("heading").first()).toContainText(
    /Saisonrückblick \d+\/\d+/i
  );
  // in the prod environment there are some more features we can test
  if (
    (await page.getByRole("heading").first().textContent())?.includes("2024/25")
  ) {
    await expect(page.getByRole("blockquote").first()).toContainText(
      "Alle Jahre wieder: pünktlich zum Winterstart wenden wir kurz den Kopf und blicken auf die vergangene Saison."
    );
    await expect(page.getByText("Winterrückblick")).toBeVisible();
    await page.getByRole("link", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading").first()).toContainText(
      /Season Review 2024\/25/
    );
  }
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

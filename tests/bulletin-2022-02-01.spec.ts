import { test, expect } from "@playwright/test";

test("bulletin/2022-02-01", async ({ page }) => {
  await page.goto("/bulletin/2022-02-01?region=AT-07-04");

  const header = page.locator("#section-bulletin-header");
  await expect(header).toContainText("Tuesday, 01/02/2022");
  await expect(header.locator(".bulletin-datetime-update")).toHaveText(
    "Updated 01/02/2022, 08:35"
  );

  const bulletin = page.locator(
    "li[id='0646104c-4d4c-4e4a-896b-ce3a45d0b61b']"
  );
  await expect(bulletin.locator(".bulletin-report-header")).toContainText(
    "Danger level for Tuesday, 01/02/2022"
  );
  await expect(bulletin.locator(".subheader").first()).toContainText(
    "Outside marked and open pistes a dangerous avalanche situation will be encountered over a wide area."
  );
  await expect(bulletin.locator(".bulletin-report-tendency")).toContainText(
    "Tendency: Increasing avalanche dangeron Wednesday, 02/02/2022"
  );
  await expect(
    bulletin.locator(".bulletin-report-header-danger-level")
  ).toContainText("Danger Level 4 – high");
  await expect(bulletin.locator("p").nth(1)).toContainText(
    "The danger exists in particular in alpine snow sports terrain."
  );

  // <br/> elements have been substituted
  await expect(page.locator("#section-bulletin-reports")).not.toContainText(
    "<br"
  );

  // glossary tooltips
  await page
    .getByText("strong to storm force northwesterly wind")
    .first()
    .hover();
  const tooltip = page.getByRole("tooltip", { name: "Wind speed" });
  await tooltip.isVisible();
  await expect(tooltip).toContainText("Wind speed");
  await expect(tooltip).toContainText("low: 0 – 20 km/h");
  await expect(tooltip).toContainText("moderate: 20 – 40 km/h");
  await expect(tooltip).toContainText("strong: 40 – 60 km/h");
  await expect(tooltip).toContainText("very strong: 60 – 100 km/h");
  await expect(tooltip).toContainText("gale, hurricane: > 100 km/h");
});

// test("bulletin/2022-02-01 snapshot", async ({ page }) => {
//   await page.goto("/bulletin/2022-02-01");
//   const bulletin = page.locator(
//     "li[id='0646104c-4d4c-4e4a-896b-ce3a45d0b61b']"
//   );
//   await page.locator(".page-loading-screen").waitFor({ state: "hidden" });
//   await expect(await bulletin.screenshot()).toMatchSnapshot();
// });

test("bulletin/2022-02-01 subscribe", async ({ page }) => {
  await page.goto("/bulletin/2022-02-01");
  await page
    .locator("#section-bulletin-linkbar")
    .getByRole("link", { name: "Subscribe" })
    .click();
  await page.getByRole("button", { name: "Telegram", exact: true }).click({
    force: true
  });
  await page.getByRole("button", { name: "Tyrol", exact: true }).click();
  await page.getByRole("button", { name: "DE" }).click();

  const [telegram] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button", { name: "Subscribe" }).click()
  ]);
  await expect(await telegram.evaluate("location.href")).toBe(
    "https://t.me/lawinenwarndienst_tirol"
  );
  await telegram.getByRole("link", { name: "Preview channel" }).click();
  await telegram.close();
  await page.getByRole("button", { name: "Close" }).click();
});

test("bulletin/2022-02-01 pdf", async ({ page }) => {
  test.fixme();
  await page.goto("/bulletin/2022-02-01");
  const pagePromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "PDF" }).first().click();
  const pdfPage = await pagePromise;
  await expect(pdfPage).toHaveURL(
    "https://api.avalanche.report/albina/api/bulletins/0646104c-4d4c-4e4a-896b-ce3a45d0b61b/pdf?region=EUREGIO&lang=en&grayscale=false"
  );
  await pdfPage.close();
});

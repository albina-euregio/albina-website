import { test, expect } from "@playwright/test";

test("bulletin/2022-02-01", async ({ page }) => {
  await page.goto("/bulletin/2022-02-01");

  const header = page.locator("#section-bulletin-header");
  await expect(header.getByRole("heading")).toHaveText("Tuesday, 01/02/2022");
  await expect(header.locator(".bulletin-datetime-publishing")).toHaveText(
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
  await page.locator("dialog").getByRole("link", { name: "Telegram" }).click();
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

test("bulletin/2022-02-01 pdf", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Still working on it");
  await page.goto("/bulletin/2022-02-01");
  await page.getByRole("link", { name: "PDF" }).click();
  await expect(page.getByText("Choose your region of interest")).toHaveText(
    "Choose your region of interest and get a PDF in color or black &amp; white."
  );
  await page.getByText("Entire Euregio in").click();
  const [pdf] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button", { name: "colored" }).first().click()
  ]);
  await pdf.waitForLoadState("load");
  await expect(pdf.url()).toBe(
    "https://static.avalanche.report/bulletins/2022-02-01/2022-02-01_en.pdf"
  );
  await pdf.close();
  await page.getByRole("button", { name: "Close" }).click();
});

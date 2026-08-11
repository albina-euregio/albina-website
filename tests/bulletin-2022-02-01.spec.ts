import { test, expect } from "@playwright/test";

test("bulletin/2022-02-01", async ({ page }) => {
  await page.goto("bulletin/2022-02-01?region=AT-07-04");

  const header = page.locator("#section-bulletin-header");
  await expect(header).toContainText(/Tuesday,? 1 February 2022/);
  await expect(header.locator(".bulletin-datetime-update")).toHaveText(
    "Updated: 01/02/2022, 08:35"
  );

  const bulletin = page.locator(
    "li[id='0646104c-4d4c-4e4a-896b-ce3a45d0b61b']"
  );
  await expect(bulletin.locator(".bulletin-report-header")).toContainText(
    /Tuesday,? 1 February 2022/
  );
  await expect(bulletin.locator(".bulletin-report-header")).toContainText(
    "Karwendel Mountains"
  );
  await expect(
    bulletin.locator(".bulletin-report-text .subheader").first()
  ).toContainText(
    "Outside marked and open pistes a dangerous avalanche situation will be encountered over a wide area."
  );

  // D1: avalanche-problems block heading with Kernzone info tooltip
  await expect(
    bulletin.locator(".bulletin-report-problems-headline")
  ).toBeVisible();
  // D3: danger parameters (matrix) hidden by default, revealed by the toggle arrow
  // (only present when the problem carries the "slab" avalanche type + parameters)
  const matrix = bulletin.locator(".problem-matrix .matrix-container").first();
  if (await matrix.count()) {
    await expect(matrix).not.toHaveClass(/is-open/);
    await bulletin
      .locator(".problem-matrix .matrix-avalanche-type")
      .first()
      .click();
    await expect(matrix).toHaveClass(/is-open/);
  }
  await expect(
    bulletin.locator(".bulletin-report-header-danger-level")
  ).toContainText("Danger Level 4 — high");

  // D2: each avalanche problem repeats the headline danger digit
  await expect(
    bulletin
      .locator(
        ".list-bulletin-report-pictos li.warning-level-4 .bulletin-report-picto.warning-level"
      )
      .first()
  ).toHaveText("4");

  // B3: the audio player is hidden behind a "Listen" toggle, not shown by default
  await expect(
    bulletin.locator(".bulletin-report-header-buttons audio")
  ).toHaveCount(0);
  const listenButton = bulletin
    .locator(".bulletin-report-header-buttons")
    .getByRole("button", { name: "Listen" });
  await expect(listenButton).toBeVisible();
  // clicking Listen reveals the full-width player; the button stays
  await listenButton.click();
  await expect(bulletin.locator(".bulletin-report-audio audio")).toBeVisible();
  await expect(listenButton).toBeVisible();

  // Micro-region switcher: nav-style dropdown lists the report's regions and
  // navigates on selection
  const regionToggle = bulletin.locator(
    ".bulletin-report-header .bulletin-report-region-toggle"
  );
  await expect(regionToggle).toBeVisible();
  await regionToggle.click();
  const options = bulletin.locator(
    ".bulletin-report-header .bulletin-report-region-option"
  );
  expect(await options.count()).toBeGreaterThan(1);
  const other = options.filter({ hasNotText: "Karwendel Mountains" }).first();
  await other.click();
  await expect(page).toHaveURL(/region=AT-07-/);
  await expect(bulletin.locator("p").nth(0)).toContainText(
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
  await expect(tooltip).toBeVisible();
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
  await page.goto("bulletin/2022-02-01");
  await page
    .locator("#section-bulletin-linkbar")
    .getByRole("link", { name: "Subscribe" })
    .click();
  await page.getByRole("button", { name: "Telegram", exact: true }).click({
    force: true
  });
  await page.getByRole("button", { name: "Tyrol", exact: true }).click({
    force: true
  });
  await page.getByRole("button", { name: "DE" }).click();

  const pagePromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Subscribe" }).click();
  const telegram = await pagePromise;
  await expect(await telegram.evaluate("location.href")).toMatch(
    /https:\/\/t.me\/lawinenwarndienst_tirol/
  );
  await telegram.getByRole("link", { name: "Preview channel" }).click();
  await telegram.close();
  await page.getByRole("button", { name: "Close" }).click();
});

test("click on map + download pdf", async ({ page }) => {
  await page.goto("bulletin/2022-02-01");

  const map = page.getByLabel("Map").nth(1);
  const pdfLink = page.getByRole("link", { name: "PDF" }).first();
  await expect(async () => {
    await map.click({ position: { x: 671, y: 91 } });
    await expect(pdfLink).toHaveAttribute("href", /microRegionId=AT-07-16/);
  }).toPass();

  const pdfUrl = await pdfLink.getAttribute("href");
  expect(pdfUrl).toContain(
    "/api/bulletins/pdf?date=2022-01-31T23:00:00.000Z&region=EUREGIO&microRegionId=AT-07-16&lang=en&grayscale=false"
  );

  // Verify the link actually serves a non-empty PDF, not a dead URL.
  const pdfResponse = await page.request.get(pdfUrl ?? "");
  expect(pdfResponse.status()).toBe(200);
  expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");
  expect((await pdfResponse.body()).byteLength).toBeGreaterThan(0);
});

test("map hint shows until a region is selected", async ({ page }) => {
  // visible immediately once the map is ready, no hover needed
  await page.goto("bulletin/2022-02-01");
  await expect(page.locator(".bulletin-map-cta").first()).toContainText(
    "Select region on map"
  );

  // gone once a region is selected
  await page.goto("bulletin/2022-02-01?region=AT-07-04");
  await page.locator(".page-loading-screen").waitFor({ state: "hidden" });
  await expect(page.locator(".bulletin-map-cta")).toHaveCount(0);
});

test("bulletin/2022-02-01 headless", async ({ page }) => {
  await page.goto("bulletin/2022-02-01?headless=1&region=AT-07-04");

  await expect(page.locator("header.section-centered")).toContainText(
    "Avalanche Forecast"
  );
  await expect(page.locator(".page-header")).toHaveCount(0);

  await page.getByRole("link", { name: "31/01" }).click();

  await expect(page).toHaveURL("bulletin/2022-01-31");
  await expect(page.locator("header.section-centered")).toContainText(
    "Avalanche Forecast"
  );
  await expect(page.locator(".page-header")).toHaveCount(0);
});

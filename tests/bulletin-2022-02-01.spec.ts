import { test, expect } from "@playwright/test";

test("2022-02-01", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto("2022-02-01?region=AT-07-04");

  const header = page.locator("#section-bulletin-header");
  await expect(header).toContainText(/Tuesday,? 1 February 2022/);
  await expect(header.locator(".bulletin-datetime-update")).toHaveText(
    "Updated: Tue, 01/02/2022, 08:35"
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

  // B3: the "Listen" button only appears when a synthesized audio file exists.
  // No mp3 is served for this fixture, so neither the button nor a player shows.
  await expect(
    bulletin
      .locator(".bulletin-report-header-buttons")
      .getByRole("button", { name: "Listen" })
  ).toHaveCount(0);
  await expect(bulletin.locator(".bulletin-report-audio audio")).toHaveCount(0);

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

// test("2022-02-01 snapshot", async ({ page }) => {
//   await page.goto("/2022-02-01");
//   const bulletin = page.locator(
//     "li[id='0646104c-4d4c-4e4a-896b-ce3a45d0b61b']"
//   );
//   await page.locator(".page-loading-screen").waitFor({ state: "hidden" });
//   await expect(await bulletin.screenshot()).toMatchSnapshot();
// });

test("2022-02-01 subscribe telegram", async ({ page }) => {
  await page.goto("2022-02-01");
  await page
    .locator("#section-bulletin-legendlinkbar")
    .getByRole("link", { name: "Subscribe" })
    .click();

  await page.getByRole("button", { name: "Tyrol", exact: true }).click();
  await page.getByRole("button", { name: "Telegram" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "DE" }).click();

  const pagePromise = page.waitForEvent("popup");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Subscribe" })
    .click();
  const telegram = await pagePromise;
  await expect(await telegram.evaluate("location.href")).toMatch(
    /https:\/\/t.me\/lawinenwarndienst_tirol/
  );
  await telegram.getByRole("link", { name: "Preview channel" }).click();
  await telegram.close();
  // await page.getByRole("button", { name: "Close" }).click();
});

test("2022-02-01 subscribe web push", async ({ page }) => {
  // Web Push: a real pushManager.subscribe() needs a browser push service
  // (FCM etc.), which headless browsers don't have. Stub PushManager with a
  // fake subscription so we can check what the app sends to the backend.
  await page.context().grantPermissions(["notifications"]);
  await page.addInitScript(() => {
    let current: PushSubscription | null = null;
    const fake = {
      endpoint: "https://push.example.test/fake-endpoint",
      toJSON: () => ({
        endpoint: "https://push.example.test/fake-endpoint",
        keys: { auth: "fake-auth", p256dh: "fake-p256dh" }
      }),
      unsubscribe: () => {
        current = null;
        return Promise.resolve(true);
      }
    } as unknown as PushSubscription;
    PushManager.prototype.subscribe = () => Promise.resolve((current = fake));
    PushManager.prototype.getSubscription = () => Promise.resolve(current);
  });
  // Never register fake subscriptions with the real backend.
  await page.route(/\/push\/(un)?subscribe$/, route =>
    route.fulfill({ status: 200, body: "" })
  );

  await page.goto("2022-02-01");
  await page
    .locator("#section-bulletin-legendlinkbar")
    .getByRole("link", { name: "Subscribe" })
    .click();

  await page.getByRole("button", { name: "Tyrol", exact: true }).click();
  await page.getByRole("button", { name: "Web Push" }).click();
  await page.getByRole("button", { name: "IT", exact: true }).click();

  const subscribeRequest = page.waitForRequest(/\/push\/subscribe$/);
  await page.getByRole("button", { name: "Enable Web Push" }).click();
  const subscribe = await subscribeRequest;
  expect(subscribe.method()).toBe("POST");
  expect(subscribe.headers()["content-type"]).toBe("application/json");
  expect(subscribe.postDataJSON()).toEqual({
    endpoint: "https://push.example.test/fake-endpoint",
    auth: "fake-auth",
    p256dh: "fake-p256dh",
    language: "it",
    region: "AT-07"
  });

  const unsubscribeRequest = page.waitForRequest(/\/push\/unsubscribe$/);
  await page.getByRole("button", { name: "Disable Web Push" }).click();
  const unsubscribe = await unsubscribeRequest;
  expect(unsubscribe.method()).toBe("POST");
  expect(unsubscribe.postDataJSON()).toEqual({
    endpoint: "https://push.example.test/fake-endpoint",
    auth: "fake-auth",
    p256dh: "fake-p256dh"
  });
  await expect(
    page.getByRole("button", { name: "Enable Web Push" })
  ).toBeVisible();
});

test(
  "click on map + download pdf",
  { tag: "@cross-browser" },
  async ({ page, isMobile }) => {
    await page.goto("2022-02-01");

    const map = page.getByLabel("Map").first();
    const pdfLink = page.getByRole("link", { name: "PDF" }).first();
    await expect(async () => {
      const clickPosition = isMobile ? { x: 233, y: 155 } : { x: 667, y: 140 };
      await map.click({ position: clickPosition });
      await expect(pdfLink).toHaveAttribute("href", /microRegionId=AT-07-16/);
    }).toPass();

    const pdfUrl = await pdfLink.getAttribute("href");
    expect(pdfUrl).toContain(
      "/api/bulletins/pdf?date=2022-01-31T23:00:00Z&region=EUREGIO&microRegionId=AT-07-16&lang=en&grayscale=false"
    );

    // Verify the link actually serves a non-empty PDF, not a dead URL.
    const pdfResponse = await page.request.get(pdfUrl ?? "");
    expect(pdfResponse.status()).toBe(200);
    expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");
    expect((await pdfResponse.body()).byteLength).toBeGreaterThan(0);
  }
);

test("map hint shows until a region is selected", async ({ page }) => {
  // visible immediately once the map is ready, no hover needed
  await page.goto("2022-02-01");
  await expect(page.locator(".bulletin-map-cta").first()).toContainText(
    "Select region on map"
  );

  // gone once a region is selected
  await page.goto("2022-02-01?region=AT-07-04");
  await page.locator(".page-loading-screen").waitFor({ state: "hidden" });
  await expect(page.locator(".bulletin-map-cta")).toHaveCount(0);
});

test("2022-02-01 headless", async ({ page }) => {
  await page.goto("2022-02-01?headless=1&region=AT-07-04");

  await expect(page.locator("header.section-centered")).toContainText(
    "Avalanche Forecast"
  );
  await expect(page.locator(".page-header")).toHaveCount(0);

  await page.getByRole("link", { name: "31/01" }).click();

  await expect(page).toHaveURL("2022-01-31");
  await expect(page.locator("html")).toHaveAttribute("data-headless", "");
  await expect(page.locator("header.section-centered")).toContainText(
    "Avalanche Forecast"
  );
  await expect(page.locator(".page-header")).toHaveCount(0);
});

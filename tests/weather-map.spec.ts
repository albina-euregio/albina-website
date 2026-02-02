import { test, expect, type Page } from "@playwright/test";

// Visible overlay image rendered by Leaflet
const overlayImg = ".leaflet-image-layer.map-info-layer";

/** Assert the overlay image has fully loaded (not a broken/missing image). */
async function expectOverlayLoaded(page: Page) {
  await expect
    .poll(
      () =>
        page
          .locator(overlayImg)
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
          ),
      { message: "overlay image should load successfully", timeout: 10_000 }
    )
    .toBe(true);
}

test.describe("weather map", () => {
  test("page load & default state", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");

    // Domain trigger shows current domain (new-snow)
    await expect(page.locator(".cp-layer-trigger")).toBeVisible();

    // Default timespan 12h is active
    await expect(page.locator(".cp-range-buttons .js-active")).toHaveText(
      "12h"
    );

    // Timeline range indicator is visible
    await expect(page.locator(".cp-scale-stamp-range.js-active")).toBeVisible();

    // URL contains the weather map path with a timestamp
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    // Overlay image loaded for new-snow domain with 12h timespan
    await expect(page.locator(overlayImg)).toHaveAttribute(
      "src",
      /overlays\/new-snow\/.*_new-snow_12h_V2\.gif$/
    );
    await expectOverlayLoaded(page);
  });

  test("domain switching via click", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();

    // Open domain selector panel
    await page.locator(".cp-layer-trigger").click();

    // Click the temp domain link
    await page
      .locator(".cp-layer-selector .cp-layer-selector-item", {
        hasText: "Temperature"
      })
      .click();

    // Active domain indicator updates (trigger button reflects current domain)
    await expect(page.locator(".cp-layer-trigger")).toContainText(
      "Temperature"
    );

    // URL changes to temp domain (no trailing slash required — timestamp
    // is appended asynchronously after data fetch)
    await expect(page).toHaveURL(/\/weather\/map\/temp/);

    // Timeline switches from range to point indicator
    // (.cp-scale-stamp-point has width:0 by design, so check the text child)
    await expect(
      page.locator(
        ".cp-scale-stamp-point.js-active .cp-scale-stamp-point-exact"
      )
    ).toBeVisible();

    // Overlay image switches to temp domain
    await expect(page.locator(overlayImg)).toHaveAttribute(
      "src",
      /overlays\/temp\/.*_temp_V3\.gif$/
    );
    await expectOverlayLoaded(page);
  });

  test("timespan switching", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-range-buttons .js-active").waitFor();

    // Click the 24h timespan button
    await page.locator(".cp-range-24").click();

    // Active timespan updates to 24h
    await expect(page.locator(".cp-range-buttons .js-active")).toHaveText(
      "24h"
    );

    // URL contains +24 timespan (+ may be encoded as %2B)
    await expect(page).toHaveURL(/\/(\+|%2B)24$/);

    // Overlay image updates to 24h timespan
    await expect(page.locator(overlayImg)).toHaveAttribute(
      "src",
      /overlays\/new-snow\/.*_new-snow_24h_V2\.gif$/
    );
    await expectOverlayLoaded(page);
  });

  test("timeline step navigation (flipper buttons)", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();

    // Read current time indicator text and overlay src
    const rangeEnd = page.locator(".cp-scale-stamp-range-end");
    const originalText = await rangeEnd.textContent();
    const originalSrc = await page.locator(overlayImg).getAttribute("src");
    expect(originalText).toBeTruthy();
    expect(originalSrc).toBeTruthy();

    // Click next-step button
    await page.locator(".cp-scale-flipper-right").click();
    await expect(rangeEnd).not.toHaveText(originalText ?? "");
    const advancedText = await rangeEnd.textContent();

    // Overlay image src should change (different time slot) and load
    await expect(page.locator(overlayImg)).not.toHaveAttribute(
      "src",
      originalSrc ?? ""
    );
    await expectOverlayLoaded(page);

    // Click previous-step button to return
    await page.locator(".cp-scale-flipper-left").click();
    await expect(rangeEnd).toHaveText(originalText ?? "");

    // Overlay returns to original and loads
    await expect(page.locator(overlayImg)).toHaveAttribute(
      "src",
      originalSrc ?? ""
    );
    await expectOverlayLoaded(page);

    // Verify we actually moved (advanced text was different)
    expect(advancedText).not.toBe(originalText);
  });

  test("keyboard navigation: domain switch (n/p)", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();

    // Press n to go to next domain
    await page.keyboard.press("n");
    await expect(page).not.toHaveURL(/\/weather\/map\/new-snow\//);
    const urlAfterN = page.url();

    // Press p to go back to previous domain
    await page.keyboard.press("p");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\//);

    // Verify n actually changed the domain
    expect(urlAfterN).not.toContain("/weather/map/new-snow/");
  });

  test("keyboard navigation: time step (arrows)", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();

    // Wait for URL to include a timestamp (async store resolution)
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);
    const originalUrl = page.url();

    // Press ArrowRight to advance time
    await page.keyboard.press("ArrowRight");
    await expect(page).not.toHaveURL(originalUrl);
    const advancedUrl = page.url();

    // Press ArrowLeft to go back
    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL(originalUrl);

    // Verify the step actually changed the timestamp
    expect(advancedUrl).not.toBe(originalUrl);
  });

  test("direct URL with timestamp", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Navigate to a specific timestamp (ISO format as used by the router)
    await page.goto("/weather/map/new-snow/2025-01-15T12:00:00.000Z/%2B12");

    // Timeline indicator should be visible
    await expect(page.locator(".cp-scale-stamp-range.js-active")).toBeVisible();

    // Check for obvious date errors (1970 = epoch fallback)
    const rangeText = await page
      .locator(".cp-scale-stamp-range.js-active")
      .textContent();
    expect(rangeText).not.toContain("1970");

    // No console errors referencing bad dates
    const dateErrors = consoleErrors.filter(
      e => e.includes("1970") || e.includes("Invalid Date")
    );
    expect(dateErrors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Overlay availability – verify every domain/timespan combination loads a
// real image from static.avalanche.report (src pattern + naturalWidth > 0).
// ---------------------------------------------------------------------------

test.describe("overlay availability", () => {
  // Single-timespan domains: just navigate and check
  const singleSpanDomains: { domain: string; src: RegExp }[] = [
    { domain: "snow-height", src: /_snow-height_V2\.gif$/ },
    { domain: "snow-line", src: /_snow-line_V3\.gif$/ },
    { domain: "temp", src: /_temp_V3\.gif$/ },
    { domain: "wind", src: /_wind_V3\.gif$/ },
    { domain: "gust", src: /_gust_V3\.gif$/ },
    { domain: "wind700hpa", src: /_wind700hpa\.gif$/ }
  ];

  for (const { domain, src } of singleSpanDomains) {
    test(`${domain} overlay loads`, async ({ page }) => {
      await page.goto(`/weather/map/${domain}/`);
      // Wait for overlay src to be populated (async data fetch)
      await expect(page.locator(overlayImg)).not.toHaveAttribute("src", "");
      await expect(page.locator(overlayImg)).toHaveAttribute("src", src);
      await expectOverlayLoaded(page);
    });
  }

  // new-snow: forecast timespans (+6 … +72)
  for (const hours of [6, 12, 24, 48, 72]) {
    test(`new-snow +${hours}h overlay loads`, async ({ page }) => {
      await page.goto("/weather/map/new-snow/");
      await page.locator(".cp-range-buttons .js-active").waitFor();

      // +12 is the default; click to switch for others
      if (hours !== 12) {
        await page.locator(`.cp-range-${hours}`).click();
        await expect(page.locator(".cp-range-buttons .js-active")).toHaveText(
          `${hours}h`
        );
      }

      await expect(page.locator(overlayImg)).toHaveAttribute(
        "src",
        new RegExp(`_new-snow_${hours}h_V2\\.gif$`)
      );
      await expectOverlayLoaded(page);
    });
  }

  // diff-snow: historical timespans (-6 … -72)
  for (const hours of [6, 12, 24, 48, 72]) {
    test(`diff-snow -${hours}h overlay loads`, async ({ page }) => {
      await page.goto("/weather/map/diff-snow/");
      await page.locator(".cp-range-buttons .js-active").waitFor();

      // -6 is the default (first in list); click to switch for others
      if (hours !== 6) {
        await page.locator(`.cp-range-${hours}`).click();
        await expect(page.locator(".cp-range-buttons .js-active")).toHaveText(
          `${hours}h`
        );
      }

      await expect(page.locator(overlayImg)).toHaveAttribute(
        "src",
        new RegExp(`_diff-snow_${hours}h_V2\\.gif$`)
      );
      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Regression tests for specific bug fixes
// ---------------------------------------------------------------------------

/** Extract the ISO timestamp segment from a weather-map URL. */
function extractTimestamp(url: string): string | null {
  const m = url.match(/\/weather\/map\/[^/]+\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

test.describe("regression: epoch date on reload", () => {
  test("reload preserves timestamp, no 1970 fallback", async ({ page }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    // Capture URL timestamp before reload
    const tsBefore = extractTimestamp(page.url());
    expect(tsBefore).toBeTruthy();
    expect(new Date(tsBefore!).getFullYear()).toBeGreaterThan(2020);

    // Reload the page
    await page.reload();

    // Page should re-initialise with a valid timestamp
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    // No epoch date in URL
    const tsAfter = extractTimestamp(page.url());
    expect(tsAfter).toBeTruthy();
    expect(new Date(tsAfter!).getFullYear()).toBeGreaterThan(2020);

    // No 1970 in the visible timeline text
    const rangeText = await page
      .locator(".cp-scale-stamp-range.js-active")
      .textContent();
    expect(rangeText).not.toContain("1970");

    // Overlay image must load (epoch URLs cause 404s)
    await expectOverlayLoaded(page);
  });

  test("reload on instantaneous domain preserves timestamp", async ({
    page
  }) => {
    await page.goto("/weather/map/temp/");
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    const tsBefore = extractTimestamp(page.url());
    expect(tsBefore).toBeTruthy();
    expect(new Date(tsBefore!).getFullYear()).toBeGreaterThan(2020);

    await page.reload();
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    const tsAfter = extractTimestamp(page.url());
    expect(tsAfter).toBeTruthy();
    expect(new Date(tsAfter!).getFullYear()).toBeGreaterThan(2020);

    await expectOverlayLoaded(page);
  });
});

test.describe("regression: mouse domain switch preserves time", () => {
  test("click domain button keeps timestamp close to original", async ({
    page
  }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    // Move one step so we are not at the default position
    await page.locator(".cp-scale-flipper-right").click();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    // Record the timestamp before switching domain
    const tsBefore = extractTimestamp(page.url());
    expect(tsBefore).toBeTruthy();
    const dateBefore = new Date(tsBefore!);
    expect(dateBefore.getFullYear()).toBeGreaterThan(2020);

    // Switch to temp domain via mouse click
    await page.locator(".cp-layer-trigger").click();
    await page
      .locator(".cp-layer-selector .cp-layer-selector-item", {
        hasText: "Temperature"
      })
      .click();

    // Wait for new domain to load
    await expect(page.locator(".cp-layer-trigger")).toContainText(
      "Temperature"
    );
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    // Timestamp must not be epoch and should be close to original
    // (within 12 hours, accounting for slot-snapping between domains)
    const tsAfter = extractTimestamp(page.url());
    expect(tsAfter).toBeTruthy();
    const dateAfter = new Date(tsAfter!);
    expect(dateAfter.getFullYear()).toBeGreaterThan(2020);

    const diffHours = Math.abs(+dateBefore - +dateAfter) / (1000 * 60 * 60);
    expect(diffHours).toBeLessThan(12);

    // Overlay for the new domain must load
    await expectOverlayLoaded(page);
  });

  test("mouse and keyboard domain switch produce same behaviour", async ({
    page
  }) => {
    await page.goto("/weather/map/new-snow/");
    await page.locator(".cp-scale-stamp-range.js-active").waitFor();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    const tsStart = extractTimestamp(page.url());
    expect(tsStart).toBeTruthy();

    // Keyboard: switch to next domain (n) then back (p)
    await page.keyboard.press("n");
    await expect(page).not.toHaveURL(/\/weather\/map\/new-snow\//);
    const tsKeyboard = extractTimestamp(page.url());
    expect(tsKeyboard).toBeTruthy();
    expect(new Date(tsKeyboard!).getFullYear()).toBeGreaterThan(2020);

    await page.keyboard.press("p");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\//);

    // Mouse: switch to the same next domain via click
    await page.locator(".cp-layer-trigger").click();

    // Get the next domain name from the selector (2nd item = next domain)
    const nextDomainItem = page
      .locator(".cp-layer-selector .cp-layer-selector-item")
      .nth(1);
    await nextDomainItem.click();
    await expect(page).not.toHaveURL(/\/weather\/map\/new-snow\//);

    const tsMouse = extractTimestamp(page.url());
    expect(tsMouse).toBeTruthy();
    expect(new Date(tsMouse!).getFullYear()).toBeGreaterThan(2020);

    // Both switches should produce timestamps within 1 hour of each other
    const diffMs = Math.abs(+new Date(tsKeyboard!) - +new Date(tsMouse!));
    expect(diffMs / (1000 * 60 * 60)).toBeLessThan(1);
  });
});

test.describe("regression: station markers clear on future time", () => {
  // Use a generous timeout — this test navigates many timeline steps
  test.setTimeout(30_000);

  test("stations disappear when moving from past to future", async ({
    page
  }) => {
    const stationMarkers = page.locator(
      ".leaflet-marker-pane .leaflet-marker-icon"
    );

    // Navigate to instantaneous domain (stations are shown for past times)
    await page.goto("/weather/map/temp/");
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    // Move backward into the past to reach times with station data
    for (let i = 0; i < 6; i++) {
      await page.locator(".cp-scale-flipper-left").click();
      await page.waitForTimeout(400);
    }

    // Wait for station markers to appear
    // If none appear (server data unavailable), skip the rest
    await page.waitForTimeout(2000);
    const count = await stationMarkers.count();
    test.skip(count === 0, "No station data available for past times");

    // Move forward well past the data availability boundary
    for (let i = 0; i < 18; i++) {
      await page.locator(".cp-scale-flipper-right").click();
      await page.waitForTimeout(300);
    }

    // Allow time for any in-flight async loadStationData callbacks to land
    await page.waitForTimeout(3000);

    // Station markers must be gone — stale data should not reappear
    await expect(stationMarkers).toHaveCount(0);
  });
});

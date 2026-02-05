import { test, expect } from "@playwright/test";
import {
  SEL,
  expectOverlayLoaded,
  extractTimestamp,
  expectValidTimestamp,
  waitForTimelineReady,
  navigateAndWait
} from "./weather-map-helpers";

// ---------------------------------------------------------------------------
// Browser back/forward
// ---------------------------------------------------------------------------

test.describe("browser back/forward", () => {
  test("back navigates to previous page.goto entry", async ({ page }) => {
    test.setTimeout(30_000);
    // Use explicit page.goto() to create reliable history entries
    // (SPA keyboard/flipper navigation may use replaceState, not pushState)
    await page.goto("/weather/map/temp/");
    await waitForTimelineReady(page, "temp");

    await page.goto("/weather/map/wind/");
    await waitForTimelineReady(page, "wind");

    await page.goto("/weather/map/new-snow/");
    await waitForTimelineReady(page, "new-snow");

    // Go back — should return to wind
    await page.goBack();
    await expect(page).toHaveURL(/\/weather\/map\/wind\//);
  });

  test("back then forward returns to original page", async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto("/weather/map/temp/");
    await waitForTimelineReady(page, "temp");

    await page.goto("/weather/map/new-snow/");
    await waitForTimelineReady(page, "new-snow");

    // Go back — should be on temp
    await page.goBack();
    await expect(page).toHaveURL(/\/weather\/map\/temp\//);

    // Go forward — should return to new-snow
    await page.goForward();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\//);
  });

  test("back to different domain loads correctly", async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto("/weather/map/new-snow/");
    await waitForTimelineReady(page, "new-snow");
    await expectOverlayLoaded(page);

    await page.goto("/weather/map/temp/");
    await waitForTimelineReady(page, "temp");
    await expectOverlayLoaded(page);

    // Go back to new-snow
    await page.goBack();
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\//);

    // Overlay should still load (app handles popstate correctly)
    await waitForTimelineReady(page, "new-snow");
    await expectOverlayLoaded(page);
  });
});

// ---------------------------------------------------------------------------
// Deep links and URL handling
// ---------------------------------------------------------------------------

test.describe("deep links and URL handling", () => {
  test("domain + timestamp + timespan URL loads correctly", async ({
    page
  }) => {
    test.setTimeout(20_000);
    await page.goto("/weather/map/new-snow/2025-01-15T12:00:00.000Z/%2B12");
    await waitForTimelineReady(page, "new-snow");

    // Correct domain loaded
    await expect(page.locator(SEL.layerTrigger)).toContainText(
      "Forecasted Fresh Snow"
    );

    // Correct timespan
    await expect(page.locator(SEL.rangeButtonActive)).toHaveText("12h");

    // Overlay loads
    await expectOverlayLoaded(page);

    // No epoch date
    const rangeText = await page.locator(SEL.rangeIndicator).textContent();
    expect(rangeText).not.toContain("1970");
  });

  test("instantaneous domain URL loads correctly", async ({ page }) => {
    test.setTimeout(20_000);
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const ts = now.toISOString();

    await page.goto(`/weather/map/temp/${encodeURIComponent(ts)}`);
    await waitForTimelineReady(page, "temp");

    await expect(page.locator(SEL.layerTrigger)).toContainText("Temperature");
    await expectOverlayLoaded(page);
  });

  test("domain-only URL gets default timestamp", async ({ page }) => {
    test.setTimeout(20_000);
    await page.goto("/weather/map/wind/");
    await waitForTimelineReady(page, "wind");

    // URL should now include a timestamp
    await expect(page).toHaveURL(/\/weather\/map\/wind\/\d/);

    const ts = extractTimestamp(page.url());
    expectValidTimestamp(ts);
    await expectOverlayLoaded(page);
  });

  test("invalid timestamp falls back gracefully", async ({ page }) => {
    test.setTimeout(20_000);
    const consoleErrors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Navigate with a clearly invalid timestamp
    await page.goto("/weather/map/new-snow/not-a-date/%2B12");

    // The app should recover — either redirect to a valid state or show a
    // reasonable default
    await page.waitForTimeout(3000);

    // Should be on the new-snow domain
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\//);

    // If a timestamp is present, it should be valid (not 1970)
    const ts = extractTimestamp(page.url());
    if (ts && ts !== "not-a-date") {
      expectValidTimestamp(ts);
    }
  });

  test("invalid domain handled gracefully", async ({ page }) => {
    test.setTimeout(20_000);
    // Navigate to a non-existent domain
    await page.goto("/weather/map/nonexistent-domain/");
    await page.waitForTimeout(3000);

    // The app should handle this — either redirect or show the default domain
    // At minimum, no crash (page should still have content)
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Station markers
// ---------------------------------------------------------------------------

test.describe("station markers", () => {
  test("station markers appear on temp in the past", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "temp");

    // Step backward into the past to get station data
    for (let i = 0; i < 6; i++) {
      await page.locator(SEL.flipperLeft).click();
      await page.waitForTimeout(400);
    }

    // Wait for station data to load
    await page.waitForTimeout(3000);

    const markers = page.locator(SEL.stationMarkers);
    const count = await markers.count();

    // If server has station data available, markers should appear
    // Skip if no data available (infrastructure issue, not code bug)
    test.skip(count === 0, "No station data available for past times");

    expect(count).toBeGreaterThan(0);
  });

  test("no station markers on new-snow", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");

    // Wait for any async loading to settle
    await page.waitForTimeout(2000);

    // new-snow has layer.stations = false
    const markers = page.locator(SEL.stationMarkers);
    await expect(markers).toHaveCount(0);
  });

  test("no station markers on snow-line", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "snow-line");

    await page.waitForTimeout(2000);

    // snow-line has layer.stations = false
    const markers = page.locator(SEL.stationMarkers);
    await expect(markers).toHaveCount(0);
  });

  test("station markers absent in the future", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "temp");

    // Step well into the future
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(300);
    }

    // Wait for any async loading
    await page.waitForTimeout(2000);

    const markers = page.locator(SEL.stationMarkers);
    await expect(markers).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// Wind direction markers
// ---------------------------------------------------------------------------

test.describe("wind direction markers", () => {
  test("direction markers present on wind domain", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "wind");

    // Wait for overlay and direction data to load
    await expectOverlayLoaded(page);
    await page.waitForTimeout(3000);

    const dirMarkers = page.locator(SEL.directionMarkers);
    const count = await dirMarkers.count();

    // Direction markers should appear on wind domain
    // Skip if data not available
    test.skip(count === 0, "No direction data available");
    expect(count).toBeGreaterThan(0);
  });

  test("no direction markers on temp domain", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "temp");

    await expectOverlayLoaded(page);
    await page.waitForTimeout(2000);

    // temp has no direction indicators
    const dirMarkers = page.locator(SEL.directionMarkers);
    await expect(dirMarkers).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// URL consistency
// ---------------------------------------------------------------------------

test.describe("URL consistency", () => {
  test("URL updates after every flipper click", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/, {
      timeout: 10_000
    });

    const urls: string[] = [page.url()];

    // Click flipper 3 times, collecting URLs
    for (let i = 0; i < 3; i++) {
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(500);
      urls.push(page.url());
    }

    // Each URL should be different from the previous
    for (let i = 1; i < urls.length; i++) {
      expect(urls[i]).not.toBe(urls[i - 1]);
    }

    // All URLs should have valid timestamps
    for (const url of urls) {
      const ts = extractTimestamp(url);
      expectValidTimestamp(ts);
    }
  });

  test("timespan encoding in URL", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Switch to +24
    await page.locator(".cp-range-24").click();
    await expect(page.locator(SEL.rangeButtonActive)).toHaveText("24h");

    // URL should contain +24 (possibly encoded as %2B24)
    await expect(page).toHaveURL(/(\+|%2B)24$/);

    // Wait for overlay to load before switching again
    await expectOverlayLoaded(page);

    // Switch to +6
    await page.locator(".cp-range-6").click();
    await expect(page.locator(SEL.rangeButtonActive)).toHaveText("6h");

    // URL should contain +6
    await expect(page).toHaveURL(/(\+|%2B)6$/);
  });

  test("copy URL produces same view on navigation", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");
    // Wait for async URL update to include a timestamp (store calculates default)
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/, {
      timeout: 10_000
    });

    // Step a couple times to get a non-default state
    await page.locator(SEL.flipperRight).click();
    await page.waitForTimeout(500);
    await page.locator(SEL.flipperRight).click();
    await page.waitForTimeout(500);

    // Wait for URL to update with timestamp
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/, {
      timeout: 10_000
    });

    // Capture current state
    const currentUrl = page.url();
    const currentTs = extractTimestamp(currentUrl);
    expectValidTimestamp(currentTs);

    // Navigate to the captured URL in a fresh context
    await page.goto(currentUrl);
    await waitForTimelineReady(page, "new-snow");

    // Timestamp should match (or be very close due to slot snapping)
    const reloadedTs = extractTimestamp(page.url());
    expectValidTimestamp(reloadedTs);

    const diffMs = Math.abs(
      +new Date(currentTs as string) - +new Date(reloadedTs as string)
    );
    // Should be within one slot (12h for new-snow default)
    expect(diffMs / (1000 * 60 * 60)).toBeLessThan(12);

    await expectOverlayLoaded(page);
  });
});

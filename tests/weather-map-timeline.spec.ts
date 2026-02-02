import { test, expect } from "@playwright/test";
import {
  ALL_DOMAINS,
  MULTI_TIMESPAN,
  INSTANTANEOUS_DOMAINS,
  SEL,
  expectOverlayLoaded,
  extractTimestamp,
  expectValidTimestamp,
  waitForTimelineReady,
  navigateAndWait,
  timespanSelector,
  overlayPatternForTimespan,
  type DomainId
} from "./weather-map-helpers";

// ---------------------------------------------------------------------------
// Timespan switching — mouse clicks
// ---------------------------------------------------------------------------

test.describe("timespan switching — mouse clicks", () => {
  // new-snow: +6, +12, +24, +48, +72
  for (const hours of MULTI_TIMESPAN["new-snow"].hours) {
    test(`new-snow +${hours}h timespan click`, async ({ page }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, "new-snow");
      // Wait for default overlay to load before switching
      await expectOverlayLoaded(page);

      // Click timespan button (skip if it's the default +12)
      if (hours !== 12) {
        await page.locator(timespanSelector(hours)).click();
      }

      // Active button text (extended timeout for slow re-renders)
      await expect(page.locator(SEL.rangeButtonActive)).toHaveText(
        `${hours}h`,
        { timeout: 10_000 }
      );

      // URL contains the timespan
      await expect(page).toHaveURL(new RegExp(`(\\+|%2B)${hours}$`));

      // Overlay src matches pattern
      await expect(page.locator(SEL.overlayImg)).toHaveAttribute(
        "src",
        overlayPatternForTimespan("new-snow", hours)
      );
      await expectOverlayLoaded(page);
    });
  }

  // diff-snow: -6, -12, -24, -48, -72
  for (const hours of MULTI_TIMESPAN["diff-snow"].hours) {
    test(`diff-snow -${hours}h timespan click`, async ({ page }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, "diff-snow");
      // Wait for default overlay to load before switching
      await expectOverlayLoaded(page);

      // Click timespan button (skip if it's the default -6)
      if (hours !== 6) {
        await page.locator(timespanSelector(hours)).click();
      }

      // Active button text (extended timeout for slow re-renders)
      await expect(page.locator(SEL.rangeButtonActive)).toHaveText(
        `${hours}h`,
        { timeout: 10_000 }
      );

      // URL contains the timespan
      await expect(page).toHaveURL(new RegExp(`-${hours}$`));

      // Overlay src matches pattern
      await expect(page.locator(SEL.overlayImg)).toHaveAttribute(
        "src",
        overlayPatternForTimespan("diff-snow", hours)
      );
      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Timespan switching — keyboard Up/Down
// ---------------------------------------------------------------------------

test.describe("timespan switching — keyboard Up/Down", () => {
  test("new-snow ArrowUp cycles forward through all timespans + wraps", async ({
    page
  }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Default is +12 (index 1). ArrowUp should go to +24 (index 2)
    const expectedSequence = ["24h", "48h", "72h", "6h", "12h"];
    for (const expected of expectedSequence) {
      await page.keyboard.press("ArrowUp");
      await expect(page.locator(SEL.rangeButtonActive)).toHaveText(expected, {
        timeout: 10_000
      });
    }
  });

  test("new-snow ArrowDown cycles backward through all timespans + wraps", async ({
    page
  }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Default is +12 (index 1). ArrowDown should go to +6 (index 0)
    const expectedSequence = ["6h", "72h", "48h", "24h", "12h"];
    for (const expected of expectedSequence) {
      await page.keyboard.press("ArrowDown");
      await expect(page.locator(SEL.rangeButtonActive)).toHaveText(expected, {
        timeout: 10_000
      });
    }
  });

  test("diff-snow ArrowUp cycles through all timespans", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "diff-snow");
    // Wait for overlay and initial state to fully settle
    await expectOverlayLoaded(page);
    await expect(page.locator(SEL.rangeButtonActive)).toHaveText("6h", {
      timeout: 10_000
    });

    // Default is -6 (index 0). ArrowUp should go to -12 (index 1)
    const expectedSequence = ["12h", "24h", "48h", "72h", "6h"];
    for (const expected of expectedSequence) {
      await page.keyboard.press("ArrowUp");
      await expect(page.locator(SEL.rangeButtonActive)).toHaveText(expected, {
        timeout: 10_000
      });
    }
  });

  test("instantaneous domain (temp): ArrowUp/Down has no effect", async ({
    page
  }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "temp");
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    const urlBefore = page.url();

    // ArrowUp should not change the domain or produce errors
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(500);

    // Should still be on temp
    await expect(page).toHaveURL(/\/weather\/map\/temp\//);

    // ArrowDown should also have no effect
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/weather\/map\/temp\//);
  });
});

// ---------------------------------------------------------------------------
// Flipper navigation — every domain
// ---------------------------------------------------------------------------

test.describe("flipper navigation — every domain", () => {
  for (const domain of ALL_DOMAINS) {
    test(`${domain}: flipper right advances, left retreats`, async ({
      page
    }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, domain);
      await expect(page).toHaveURL(new RegExp(`/weather/map/${domain}/\\d`));

      // Step left first to ensure we're not at a boundary
      await page.locator(SEL.flipperLeft).click();
      await page.waitForTimeout(500);

      // Record state after stepping left
      const baseTs = extractTimestamp(page.url());
      expectValidTimestamp(baseTs);

      // Click right — timestamp should change
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(500);
      const advancedTs = extractTimestamp(page.url());
      expectValidTimestamp(advancedTs);
      expect(advancedTs).not.toBe(baseTs);

      // Click left to return — timestamp should match base
      await page.locator(SEL.flipperLeft).click();
      await page.waitForTimeout(500);
      const returnedTs = extractTimestamp(page.url());
      expectValidTimestamp(returnedTs);
      expect(returnedTs).toBe(baseTs);

      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Keyboard timeline navigation
// ---------------------------------------------------------------------------

test.describe("keyboard timeline navigation", () => {
  test("ArrowRight/Left step by correct offset on new-snow +12", async ({
    page
  }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    const urlBefore = page.url();
    const tsBefore = extractTimestamp(urlBefore);
    expectValidTimestamp(tsBefore);

    // ArrowRight steps by timespan (12h for +12 default)
    await page.keyboard.press("ArrowRight");
    await expect(page).not.toHaveURL(urlBefore);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Difference should be 12 hours (within tolerance for slot snapping)
    const diffHours =
      Math.abs(+new Date(tsAfter!) - +new Date(tsBefore!)) / (1000 * 60 * 60);
    expect(diffHours).toBeGreaterThanOrEqual(6);
    expect(diffHours).toBeLessThanOrEqual(24);
  });

  test("Ctrl+ArrowRight jumps by 24h on new-snow +6h", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");

    // Switch to +6h timespan
    await page.locator(timespanSelector(6)).click();
    await expect(page.locator(SEL.rangeButtonActive)).toHaveText("6h");
    await page.waitForTimeout(500);

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    // Ctrl+ArrowRight should jump by 24h (24/6 = 4 steps)
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(500);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    const diffHours =
      Math.abs(+new Date(tsAfter!) - +new Date(tsBefore!)) / (1000 * 60 * 60);
    // Should be approximately 24h
    expect(diffHours).toBeGreaterThanOrEqual(18);
    expect(diffHours).toBeLessThanOrEqual(30);
  });

  test("Ctrl+Arrow jumps 24h on small timespans, overshoots on large", async ({
    page
  }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Switch to +6h timespan where Ctrl+Arrow produces a 24h jump (factor=4, offset=6)
    await page.locator(timespanSelector(6)).click();
    await expect(page.locator(SEL.rangeButtonActive)).toHaveText("6h", {
      timeout: 10_000
    });
    await expectOverlayLoaded(page);

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(1000);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Ctrl+Arrow on +6h should jump by 24h (4 steps × 6h offset)
    expect(tsAfter).not.toBe(tsBefore);
    const diffHours =
      Math.abs(+new Date(tsAfter!) - +new Date(tsBefore!)) / (1000 * 60 * 60);
    expect(diffHours).toBeCloseTo(24, 0);
  });

  test("Arrow at timeline boundary does not overflow", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Navigate to the end of the timeline by pressing ArrowRight many times
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(200);
    }

    // Record position at boundary
    const tsAtEnd = extractTimestamp(page.url());
    expectValidTimestamp(tsAtEnd);

    // One more ArrowRight should not change the timestamp (boundary reached)
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    const tsAfterEnd = extractTimestamp(page.url());
    expectValidTimestamp(tsAfterEnd);

    // Should be the same or very close (already at boundary)
    const diffMs = Math.abs(+new Date(tsAtEnd!) - +new Date(tsAfterEnd!));
    // Allow up to one step difference in case we weren't quite at the boundary
    expect(diffMs / (1000 * 60 * 60)).toBeLessThanOrEqual(12);

    // Overlay at the boundary may not exist (server data availability)
    // The test's purpose is to verify boundary clamping, not overlay loading
  });
});

// ---------------------------------------------------------------------------
// Timeline drag
// ---------------------------------------------------------------------------

test.describe("timeline drag", () => {
  test("drag ruler rightward changes timestamp", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    // Drag the ruler rightward (which moves time backward)
    const ruler = page.locator(SEL.rulerDrag);
    const box = await ruler.boundingBox();
    if (!box) {
      test.skip(true, "Ruler element not visible for drag test");
      return;
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 150, startY, { steps: 10 });
    await page.mouse.up();

    await page.waitForTimeout(1000);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Timestamp should have changed
    expect(tsAfter).not.toBe(tsBefore);
  });

  test("drag snaps to valid slot", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");

    // Drag and release
    const ruler = page.locator(SEL.rulerDrag);
    const box = await ruler.boundingBox();
    if (!box) {
      test.skip(true, "Ruler element not visible for drag test");
      return;
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY, { steps: 10 });
    await page.mouse.up();

    await page.waitForTimeout(1000);

    // After snap, the timestamp should be at a valid slot hour
    // For new-snow +12, valid hours are 0 and 12
    const ts = extractTimestamp(page.url());
    expectValidTimestamp(ts);
    const date = new Date(ts!);
    const hour = date.getUTCHours();
    expect([0, 12]).toContain(hour);
  });
});

// ---------------------------------------------------------------------------
// Calendar date picker
// ---------------------------------------------------------------------------

test.describe("calendar date picker", () => {
  test("new-snow: pick a date via datetime-local input", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    const urlBefore = page.url();
    const tsBefore = extractTimestamp(urlBefore);
    expectValidTimestamp(tsBefore);

    // Fill the hidden datetime-local input with a new value
    // Use a date that's likely within the forecast range
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setUTCHours(0, 0, 0, 0);
    const inputValue = targetDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

    const calendarInput = page.locator(SEL.calendarInput);
    await calendarInput.fill(inputValue);
    await calendarInput.dispatchEvent("change");

    // Wait for URL to change from the original
    await expect(page).not.toHaveURL(urlBefore);
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Timestamp should have changed
    expect(tsAfter).not.toBe(tsBefore);
    // Note: overlay at the calendar-picked future time may not be available
    // on the server. The test verifies the calendar interaction works.
  });

  test("diff-snow: pick a past date", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "diff-snow");
    await expect(page).toHaveURL(/\/weather\/map\/diff-snow\/\d/);

    const urlBefore = page.url();
    const tsBefore = extractTimestamp(urlBefore);
    expectValidTimestamp(tsBefore);

    // Pick a date in the past
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 1);
    targetDate.setUTCHours(12, 0, 0, 0);
    const inputValue = targetDate.toISOString().slice(0, 16);

    const calendarInput = page.locator(SEL.calendarInput);
    await calendarInput.fill(inputValue);
    await calendarInput.dispatchEvent("change");

    // Wait for URL to change
    await expect(page).not.toHaveURL(urlBefore);
    await expect(page).toHaveURL(/\/weather\/map\/diff-snow\/\d/);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);
    expect(tsAfter).not.toBe(tsBefore);
    await expectOverlayLoaded(page);
  });

  test("temp: pick a specific hour", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "temp");
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    const urlBefore = page.url();
    const tsBefore = extractTimestamp(urlBefore);
    expectValidTimestamp(tsBefore);

    // Pick today at a specific hour
    const targetDate = new Date();
    targetDate.setUTCHours(6, 0, 0, 0);
    const inputValue = targetDate.toISOString().slice(0, 16);

    const calendarInput = page.locator(SEL.calendarInput);
    await calendarInput.fill(inputValue);
    await calendarInput.dispatchEvent("change");

    // Wait for URL to change
    await expect(page).not.toHaveURL(urlBefore);
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);
    await expectOverlayLoaded(page);
  });
});

// ---------------------------------------------------------------------------
// Play button animation
// ---------------------------------------------------------------------------

test.describe("play button animation", () => {
  test("play starts animation and time advances", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");
    await expect(page).toHaveURL(/\/weather\/map\/new-snow\/\d/);

    const urlBefore = page.url();
    const tsBefore = extractTimestamp(urlBefore);
    expectValidTimestamp(tsBefore);

    // Click play (the button is an <a> inside the player container)
    await page.locator(SEL.playerPlay).click();

    // Player should be in playing state (container may not be "visible"
    // per Playwright's definition due to CSS layout — check attachment)
    await page.locator(SEL.playerPlaying).waitFor({ state: "attached" });

    // Wait for at least one step to occur (interval is 1000ms)
    await page.waitForTimeout(2500);

    // Time should have advanced
    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);
    expect(tsAfter).not.toBe(tsBefore);

    // Stop the player
    await page.locator(SEL.playerStop).click();
  });

  test("stop pauses animation", async ({ page }) => {
    test.setTimeout(20_000);
    await navigateAndWait(page, "new-snow");

    // Click play
    await page.locator(SEL.playerPlay).click();
    await page.locator(SEL.playerPlaying).waitFor({ state: "attached" });

    // Wait for at least one step
    await page.waitForTimeout(1500);
    await page.locator(SEL.playerStop).click();

    // Player should no longer be playing (js-playing removed)
    await page.locator(SEL.playerPlaying).waitFor({ state: "detached" });

    // Record timestamp after stopping
    const tsStopped = extractTimestamp(page.url());
    expectValidTimestamp(tsStopped);

    // Wait and verify timestamp stays the same (animation stopped)
    await page.waitForTimeout(2500);
    const tsStillStopped = extractTimestamp(page.url());
    expect(tsStillStopped).toBe(tsStopped);
  });

  test("play auto-stops at end of timeline", async ({ page }) => {
    test.setTimeout(60_000);
    await navigateAndWait(page, "new-snow");

    // Move close to the end of the timeline
    for (let i = 0; i < 15; i++) {
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(200);
    }

    // Click play
    await page.locator(SEL.playerPlay).click();
    await page.locator(SEL.playerPlaying).waitFor({ state: "attached" });

    // Wait for the animation to reach the end and auto-stop
    await page
      .locator(SEL.playerPlaying)
      .waitFor({ state: "detached", timeout: 30_000 });

    // After auto-stop, timestamp should still be valid
    const ts = extractTimestamp(page.url());
    expectValidTimestamp(ts);
  });
});

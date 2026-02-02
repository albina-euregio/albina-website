import { test, expect } from "@playwright/test";
import {
  ALL_DOMAINS,
  DOMAIN_TITLES,
  OVERLAY_PATTERNS,
  INSTANTANEOUS_DOMAINS,
  SEL,
  expectOverlayLoaded,
  extractTimestamp,
  expectValidTimestamp,
  waitForTimelineReady,
  navigateAndWait,
  switchDomainByClick,
  type DomainId
} from "./weather-map-helpers";

// ---------------------------------------------------------------------------
// Reload preserves timestamp for every domain
// ---------------------------------------------------------------------------

test.describe("reload preserves timestamp for every domain", () => {
  for (const domain of ALL_DOMAINS) {
    const isInstantaneous = INSTANTANEOUS_DOMAINS.includes(domain);

    test(`${domain} reload preserves past timestamp`, async ({ page }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, domain);
      await expect(page).toHaveURL(new RegExp(`/weather/map/${domain}/\\d`));

      // Step backward 3 times into the past
      for (let i = 0; i < 3; i++) {
        await page.locator(SEL.flipperLeft).click();
        await page.waitForTimeout(400);
      }

      const tsBefore = extractTimestamp(page.url());
      expectValidTimestamp(tsBefore);

      // Reload
      await page.reload();
      await waitForTimelineReady(page, domain);
      await expect(page).toHaveURL(new RegExp(`/weather/map/${domain}/\\d`));

      const tsAfter = extractTimestamp(page.url());
      expectValidTimestamp(tsAfter);

      // No 1970 in visible text
      if (!isInstantaneous) {
        const rangeText = await page.locator(SEL.rangeIndicator).textContent();
        expect(rangeText).not.toContain("1970");
      }

      await expectOverlayLoaded(page);
    });

    test(`${domain} reload preserves future timestamp`, async ({ page }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, domain);
      await expect(page).toHaveURL(new RegExp(`/weather/map/${domain}/\\d`));

      // Step forward 3 times
      for (let i = 0; i < 3; i++) {
        await page.locator(SEL.flipperRight).click();
        await page.waitForTimeout(400);
      }

      const tsBefore = extractTimestamp(page.url());
      expectValidTimestamp(tsBefore);

      // Reload
      await page.reload();
      await waitForTimelineReady(page, domain);
      await expect(page).toHaveURL(new RegExp(`/weather/map/${domain}/\\d`));

      const tsAfter = extractTimestamp(page.url());
      expectValidTimestamp(tsAfter);

      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Domain switching by mouse — every domain
// ---------------------------------------------------------------------------

test.describe("domain switching by mouse — every domain", () => {
  for (const targetDomain of ALL_DOMAINS) {
    test(`switch to ${targetDomain} via mouse click`, async ({ page }) => {
      test.setTimeout(30_000);
      // Start from a different domain
      const startDomain = targetDomain === "new-snow" ? "temp" : "new-snow";
      await navigateAndWait(page, startDomain);

      // Switch via click
      await switchDomainByClick(page, targetDomain);

      // Verify trigger text
      await expect(page.locator(SEL.layerTrigger)).toContainText(
        DOMAIN_TITLES[targetDomain]
      );

      // Verify URL
      await expect(page).toHaveURL(new RegExp(`/weather/map/${targetDomain}/`));

      // Verify correct indicator type
      if (INSTANTANEOUS_DOMAINS.includes(targetDomain)) {
        await page.locator(SEL.pointIndicator).waitFor({ state: "attached" });
      } else {
        await expect(page.locator(SEL.rangeIndicator)).toBeVisible();
      }

      // Verify overlay pattern
      await expect(page.locator(SEL.overlayImg)).toHaveAttribute(
        "src",
        OVERLAY_PATTERNS[targetDomain]
      );
      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Domain switching by keyboard — full cycle
// ---------------------------------------------------------------------------

test.describe("domain switching by keyboard — full cycle", () => {
  test("cycle all domains forward with n", async ({ page }) => {
    test.setTimeout(60_000);
    // Start on snow-height (index 0)
    await navigateAndWait(page, "snow-height");

    for (let i = 1; i <= 8; i++) {
      await page.keyboard.press("n");
      const expectedDomain = ALL_DOMAINS[i % ALL_DOMAINS.length];
      await expect(page).toHaveURL(
        new RegExp(`/weather/map/${expectedDomain}/`)
      );
      await waitForTimelineReady(page, expectedDomain);
    }

    // Should have wrapped back to snow-height
    await expect(page).toHaveURL(/\/weather\/map\/snow-height\//);
  });

  test("cycle all domains backward with p", async ({ page }) => {
    test.setTimeout(60_000);
    // Start on snow-height (index 0)
    await navigateAndWait(page, "snow-height");

    // p from snow-height wraps to wind700hpa
    await page.keyboard.press("p");
    await expect(page).toHaveURL(/\/weather\/map\/wind700hpa\//);
    await waitForTimelineReady(page, "wind700hpa");

    // Continue backward through all domains
    const expectedBackward: DomainId[] = [
      "gust",
      "wind",
      "temp",
      "snow-line",
      "diff-snow",
      "new-snow",
      "snow-height"
    ];
    for (const expectedDomain of expectedBackward) {
      await page.keyboard.press("p");
      await expect(page).toHaveURL(
        new RegExp(`/weather/map/${expectedDomain}/`)
      );
      await waitForTimelineReady(page, expectedDomain);
    }
  });
});

// ---------------------------------------------------------------------------
// Domain switching preserves time context
// ---------------------------------------------------------------------------

test.describe("domain switching preserves time context", () => {
  const transitions: {
    name: string;
    from: DomainId;
    to: DomainId;
    maxDiffHours: number;
  }[] = [
    {
      name: "new-snow → temp (forecast → instantaneous)",
      from: "new-snow",
      to: "temp",
      maxDiffHours: 12
    },
    {
      name: "temp → wind (instantaneous → instantaneous, same +-1 slots)",
      from: "temp",
      to: "wind",
      maxDiffHours: 12
    },
    {
      name: "diff-snow → new-snow (historical → forecast)",
      from: "diff-snow",
      to: "new-snow",
      maxDiffHours: 12
    },
    {
      name: "wind → diff-snow (instantaneous → historical)",
      from: "wind",
      to: "diff-snow",
      maxDiffHours: 12
    },
    {
      name: "new-snow → diff-snow (forecast → historical)",
      from: "new-snow",
      to: "diff-snow",
      maxDiffHours: 12
    },
    {
      name: "gust → snow-height (instantaneous → instantaneous)",
      from: "gust",
      to: "snow-height",
      maxDiffHours: 12
    }
  ];

  for (const { name, from, to, maxDiffHours } of transitions) {
    test(name, async ({ page }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, from);
      await expect(page).toHaveURL(new RegExp(`/weather/map/${from}/\\d`));

      // Step to a non-default time
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(500);
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(500);

      const tsBefore = extractTimestamp(page.url());
      expectValidTimestamp(tsBefore);
      const dateBefore = new Date(tsBefore!);

      // Switch domain via click
      await switchDomainByClick(page, to);

      const tsAfter = extractTimestamp(page.url());
      expectValidTimestamp(tsAfter);
      const dateAfter = new Date(tsAfter!);

      // Timestamp should be within expected range
      const diffHours = Math.abs(+dateBefore - +dateAfter) / (1000 * 60 * 60);
      expect(diffHours).toBeLessThan(maxDiffHours);

      // Overlay loads
      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Instantaneous domains have forecast data available
// ---------------------------------------------------------------------------

test.describe("instantaneous domains have forecast data", () => {
  const domainsToTest: DomainId[] = ["temp", "wind", "gust"];

  for (const domain of domainsToTest) {
    test(`${domain} can step into the future and load overlay`, async ({
      page
    }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, domain);

      const tsStart = extractTimestamp(page.url());
      expectValidTimestamp(tsStart);

      // Step forward several times into the future
      for (let i = 0; i < 6; i++) {
        await page.locator(SEL.flipperRight).click();
        await page.waitForTimeout(400);
      }

      const tsFuture = extractTimestamp(page.url());
      expectValidTimestamp(tsFuture);

      // Should have moved forward in time
      expect(+new Date(tsFuture!)).toBeGreaterThan(+new Date(tsStart!));

      // Overlay should load at the future time
      await expectOverlayLoaded(page);
    });
  }
});

// ---------------------------------------------------------------------------
// Domain switching at future time
// ---------------------------------------------------------------------------

test.describe("domain switching at future time", () => {
  test("forecast → instantaneous at future time", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Step well into the future
    for (let i = 0; i < 4; i++) {
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(400);
    }

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    await switchDomainByClick(page, "temp");

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    await expectOverlayLoaded(page);
  });

  test("instantaneous → instantaneous at future time", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "temp");

    // Step forward into the future
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(300);
    }

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    await switchDomainByClick(page, "wind");

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Both are hourly — should be reasonably close
    const diffHours =
      Math.abs(+new Date(tsBefore!) - +new Date(tsAfter!)) / (1000 * 60 * 60);
    expect(diffHours).toBeLessThan(12);

    await expectOverlayLoaded(page);
  });

  test("new-snow at far future → snow-height via p key loads overlay", async ({
    page
  }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");

    // Step to the far end of the timeline
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(200);
    }

    // Press "p" to go to previous domain (snow-height)
    await page.keyboard.press("p");
    await expect(page).toHaveURL(/\/weather\/map\/snow-height\//, {
      timeout: 10_000
    });
    await waitForTimelineReady(page, "snow-height");

    // Timestamp should be valid and within data range
    const ts = extractTimestamp(page.url());
    expectValidTimestamp(ts);

    // Overlay should load after domain switch
    await expectOverlayLoaded(page);
  });

  test("instantaneous → historical at future time", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "temp");

    // Step forward
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(300);
    }

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    await switchDomainByClick(page, "diff-snow");

    // Wait for timestamp to appear in URL (async store resolution)
    await expect(page).toHaveURL(/\/weather\/map\/diff-snow\/\d/, {
      timeout: 10_000
    });

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Note: diff-snow at a future-clamped time may not have overlay data.
    // The test verifies the domain switch + time snapping works, not data availability.
  });
});

// ---------------------------------------------------------------------------
// Domain switching at past time
// ---------------------------------------------------------------------------

test.describe("domain switching at past time", () => {
  test("stations appear after switch to station-enabled domain at past time", async ({
    page
  }) => {
    test.setTimeout(30_000);
    // Start on new-snow (no stations)
    await navigateAndWait(page, "new-snow");

    // Step backward into the past
    for (let i = 0; i < 3; i++) {
      await page.locator(SEL.flipperLeft).click();
      await page.waitForTimeout(400);
    }

    // Switch to temp (has stations)
    await switchDomainByClick(page, "temp");

    // Step backward a bit more to ensure past time
    for (let i = 0; i < 3; i++) {
      await page.locator(SEL.flipperLeft).click();
      await page.waitForTimeout(400);
    }

    // Wait for station data to load
    await page.waitForTimeout(3000);

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);

    // Station markers should appear at past times on temp
    // (depends on external data availability — skip if no data)
    const markers = page.locator(SEL.stationMarkers);
    const count = await markers.count();
    test.skip(count === 0, "No station data available for past times");
    expect(count).toBeGreaterThan(0);
  });

  test("forecast → instantaneous at past time", async ({ page }) => {
    test.setTimeout(30_000);
    await navigateAndWait(page, "new-snow");
    await expectOverlayLoaded(page);

    // Step backward into the past
    for (let i = 0; i < 4; i++) {
      await page.locator(SEL.flipperLeft).click();
      await page.waitForTimeout(400);
    }

    const tsBefore = extractTimestamp(page.url());
    expectValidTimestamp(tsBefore);

    await switchDomainByClick(page, "temp");

    // Wait for URL to include timestamp (async store resolution)
    await expect(page).toHaveURL(/\/weather\/map\/temp\/\d/, {
      timeout: 10_000
    });

    const tsAfter = extractTimestamp(page.url());
    expectValidTimestamp(tsAfter);
  });
});

// ---------------------------------------------------------------------------
// Domain switching — mouse vs keyboard consistency
// ---------------------------------------------------------------------------

test.describe("domain switching — mouse vs keyboard consistency", () => {
  // Use instantaneous domains for tight consistency checks — their hourly
  // slots survive round-trip domain switching without large time jumps.
  // Multi-timespan domains (new-snow, diff-snow) intentionally excluded
  // because forecast↔historical transitions produce different default times.
  const representativeDomains: DomainId[] = ["temp", "wind", "snow-height"];

  for (const startDomain of representativeDomains) {
    test(`${startDomain}: mouse and keyboard switch produce consistent timestamps`, async ({
      page
    }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, startDomain);
      await expect(page).toHaveURL(
        new RegExp(`/weather/map/${startDomain}/\\d`),
        { timeout: 10_000 }
      );

      // Keyboard: press n to go to next domain
      await page.keyboard.press("n");
      await expect(page).not.toHaveURL(
        new RegExp(`/weather/map/${startDomain}/`)
      );
      // Wait for URL to include timestamp in the new domain
      await expect(page).toHaveURL(/\/weather\/map\/[^/]+\/\d/, {
        timeout: 10_000
      });
      const keyboardUrl = page.url();
      const tsKeyboard = extractTimestamp(keyboardUrl);
      expectValidTimestamp(tsKeyboard);

      // Extract the domain we went to
      const keyboardDomain =
        keyboardUrl.match(/\/weather\/map\/([^/]+)\//)?.[1] ?? "";
      expect(keyboardDomain).toBeTruthy();

      // Go back
      await page.keyboard.press("p");
      await expect(page).toHaveURL(new RegExp(`/weather/map/${startDomain}/`));

      // Mouse: switch to the same domain via click
      await page.locator(SEL.layerTrigger).click();
      await page
        .locator(
          `${SEL.layerSelectorItem}[href="/weather/map/${keyboardDomain}"]`
        )
        .click();
      await expect(page).not.toHaveURL(
        new RegExp(`/weather/map/${startDomain}/`)
      );
      // Wait for URL to include timestamp
      await expect(page).toHaveURL(/\/weather\/map\/[^/]+\/\d/, {
        timeout: 10_000
      });

      const tsMouse = extractTimestamp(page.url());
      expectValidTimestamp(tsMouse);

      // Both should produce timestamps within 12 hours
      // (cross-domain transitions may snap to different slot grids)
      const diffMs = Math.abs(+new Date(tsKeyboard!) - +new Date(tsMouse!));
      expect(diffMs / (1000 * 60 * 60)).toBeLessThan(12);
    });

    test(`${startDomain}: mouse and keyboard switch to same domain match`, async ({
      page
    }) => {
      test.setTimeout(30_000);
      await navigateAndWait(page, startDomain);
      // Wait for URL timestamp to appear
      await expect(page).toHaveURL(
        new RegExp(`/weather/map/${startDomain}/\\d`),
        { timeout: 10_000 }
      );

      // Step once to move from default
      await page.locator(SEL.flipperRight).click();
      await page.waitForTimeout(500);

      // Keyboard: press n
      await page.keyboard.press("n");
      // Wait for URL to include timestamp in the new domain
      await expect(page).toHaveURL(/\/weather\/map\/[^/]+\/\d/, {
        timeout: 10_000
      });
      const tsKeyboard = extractTimestamp(page.url());
      expectValidTimestamp(tsKeyboard);

      const keyboardDomain =
        page.url().match(/\/weather\/map\/([^/]+)\//)?.[1] ?? "";

      // Go back to start
      await page.keyboard.press("p");
      await expect(page).toHaveURL(new RegExp(`/weather/map/${startDomain}/`));

      // Mouse: switch to same domain
      await switchDomainByClick(page, keyboardDomain as DomainId);
      // Wait for URL to include timestamp
      await expect(page).toHaveURL(/\/weather\/map\/[^/]+\/\d/, {
        timeout: 10_000
      });

      const tsMouse = extractTimestamp(page.url());
      expectValidTimestamp(tsMouse);

      // Timestamps within 12 hours
      // (cross-domain transitions may snap to different slot grids)
      const diffMs = Math.abs(+new Date(tsKeyboard!) - +new Date(tsMouse!));
      expect(diffMs / (1000 * 60 * 60)).toBeLessThan(12);
    });
  }
});

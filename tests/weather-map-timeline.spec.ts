import {
  HOUR,
  SEL,
  expect,
  iso,
  pickerValue,
  resolveTime,
  test,
  type DomainId
} from "./weather-map-helpers";

test.describe("keyboard", () => {
  for (const [domain, timeRange] of [
    ["temp", 1],
    ["new-snow", 6]
  ] as [DomainId, number][]) {
    test(`${domain} ${timeRange}h: arrows step by the time step, ctrl+arrows by a day`, async ({
      weather,
      page
    }) => {
      const cfg = await weather.config(domain);
      const tr = await weather.timeRangeConfig(domain, timeRange);
      const step = tr.timeStepHours * HOUR;
      const time = resolveTime(tr.maxAnalysisTimestamp - 48 * HOUR, tr, cfg);
      await weather.open(domain, time, timeRange);

      await page.keyboard.press("ArrowRight");
      await weather.expectTime(time + step);
      await page.keyboard.press("ArrowLeft");
      await weather.expectTime(time);
      await page.keyboard.press("Control+ArrowRight");
      await weather.expectTime(time + 24 * HOUR);
      await weather.expectOverlay(domain, timeRange, time + 24 * HOUR);
      await page.keyboard.press("Control+ArrowLeft");
      await weather.expectTime(time);
    });
  }

  for (const domain of ["new-snow", "diff-snow"] as DomainId[]) {
    test(`${domain}: up/down cycle through the time ranges`, async ({
      weather,
      page
    }) => {
      const ranges = (await weather.config(domain)).timeRanges.map(
        tr => tr.timeRange
      );
      await weather.open(domain);

      for (const timeRange of [...ranges.slice(1), ranges[0]]) {
        await page.keyboard.press("ArrowUp");
        await weather.expectTimeRange(timeRange);
      }
      for (const timeRange of [...ranges].reverse()) {
        await page.keyboard.press("ArrowDown");
        await weather.expectTimeRange(timeRange);
      }
    });
  }

  test("up/down do nothing with a single time range", async ({
    weather,
    page
  }) => {
    const time = (await weather.timeRangeConfig("temp")).initialTimestamp;
    await weather.open("temp");

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowLeft");
    await weather.expectTime(time - HOUR);
    await weather.expectTimeRange(1);
  });
});

test.describe("boundaries", () => {
  test("stepping stops at the end of the forecast", async ({
    weather,
    page
  }) => {
    const tr = await weather.timeRangeConfig("temp");
    await weather.open("temp", tr.maxForecastTimestamp);

    await page.locator(SEL.flipperRight).click();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await weather.expectTime(tr.maxForecastTimestamp - HOUR);
  });

  test("stepping stops at the start of the data", async ({ weather, page }) => {
    const { minTimestamp } = await weather.config("temp");
    await weather.open("temp", minTimestamp);

    await page.locator(SEL.flipperLeft).click();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await weather.expectTime(minTimestamp + HOUR);
  });
});

// Playwright runs in Europe/Vienna: local-time arithmetic would gain or lose
// an hour across these DST switches.
test.describe("DST", () => {
  for (const switchDay of ["2026-03-29", "2025-10-26"]) {
    test(`hourly steps stay 1h apart on ${switchDay}`, async ({
      weather,
      page
    }) => {
      const time = Date.parse(`${switchDay}T00:00:00Z`);
      await weather.open("temp", time);

      for (let i = 1; i <= 3; i++) {
        await page.locator(SEL.flipperRight).click();
        await weather.expectTime(time + i * HOUR);
      }
    });
  }
});

test.describe("dragging", () => {
  test(
    "dragging the ruler right goes back in time, by whole steps",
    { tag: "@cross-browser" },
    async ({ weather, page }) => {
      const cfg = await weather.config("new-snow");
      const tr = cfg.timeRanges[0];
      const time = resolveTime(tr.maxAnalysisTimestamp, tr, cfg);
      await weather.open("new-snow", time, tr.timeRange);
      await expect(page.locator(SEL.rangeIndicator)).toBeVisible();

      const box = await page.locator(SEL.ruler).boundingBox();
      if (!box) throw new Error("Ruler not rendered");
      const y = box.y + box.height / 2;
      await page.mouse.move(box.x + box.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 150, y, { steps: 10 });
      await page.mouse.up();

      await expect.poll(() => weather.time()).toBeLessThan(time);
      const dragged = weather.time();
      expect((time - dragged) % (tr.timeStepHours * HOUR)).toBe(0);
      await weather.expectOverlay("new-snow", tr.timeRange, dragged);
    }
  );
});

test.describe("date picker", () => {
  test(
    "picks the hour to show",
    { tag: "@cross-browser" },
    async ({ weather, page }) => {
      const tr = await weather.timeRangeConfig("temp");
      await weather.open("temp");
      const time = tr.maxAnalysisTimestamp - 30 * HOUR;

      await page.locator(SEL.calendarInput).fill(pickerValue(time));
      await weather.expectTime(time);
      await weather.expectOverlay("temp", 1, time);
      await expect(page.locator(SEL.pointExact)).toHaveText(
        `${iso(time).slice(11, 16)} UTC`
      );
    }
  );

  test("picks the start of a period", async ({ weather, page }) => {
    const tr = await weather.timeRangeConfig("new-snow");
    await weather.open("new-snow");
    const start = tr.maxAnalysisTimestamp - 24 * HOUR;
    const end = start + tr.timeRange * HOUR;

    await page.locator(SEL.calendarInput).fill(pickerValue(start));
    await weather.expectTime(end);
    await weather.expectOverlay("new-snow", tr.timeRange, end);
    await expect(page.locator(SEL.rangeBegin)).toHaveText(
      iso(start).slice(11, 16)
    );
  });
});

test.describe("player", () => {
  test("plays to the end of the forecast and stops", async ({
    weather,
    page
  }) => {
    const tr = await weather.timeRangeConfig("new-snow");
    const step = tr.timeStepHours * HOUR;
    await weather.open("new-snow", tr.maxForecastTimestamp - 2 * step);

    await page.locator(SEL.playerPlay).click();
    await expect(page.locator(SEL.playerPlaying)).toBeAttached();
    await expect(page.locator(SEL.playerPlaying)).not.toBeAttached({
      timeout: 10_000
    });
    await weather.expectTime(tr.maxForecastTimestamp);
  });

  test("stop pauses the player", async ({ weather, page }) => {
    const tr = await weather.timeRangeConfig("temp");
    const time = tr.maxAnalysisTimestamp - 30 * HOUR;
    await weather.open("temp", time);

    await page.locator(SEL.playerPlay).click();
    await expect
      .poll(() => weather.time())
      .toBeGreaterThanOrEqual(time + 2 * HOUR);
    await page.locator(SEL.playerStop).click();
    await expect(page.locator(SEL.playerPlaying)).not.toBeAttached();
    // A step taken just before stopping navigates on the next frame.
    await page.evaluate(() => new Promise(requestAnimationFrame));

    const stopped = weather.time();
    // Longer than the player's 1s interval.
    await page.waitForTimeout(1500);
    expect(iso(weather.time())).toBe(iso(stopped));
  });
});

import {
  DOMAINS,
  HOUR,
  SEL,
  expect,
  iso,
  resolveTime,
  test,
  type DomainId,
  type WeatherMap
} from "./weather-map-helpers";

/** A whole hour safely inside every domain's analysis period. */
async function pastTime(weather: WeatherMap): Promise<number> {
  const tr = await weather.timeRangeConfig("temp");
  return tr.maxAnalysisTimestamp - 30 * HOUR;
}

/**
 * Switching domain keeps the selected time; the new domain resolves it to its
 * default time range's slots. Returns the resolved time.
 */
async function expectSwitchedTo(
  weather: WeatherMap,
  domain: DomainId,
  time: number
): Promise<number> {
  await weather.expectDomain(domain);
  await weather.expectTime(time);
  const cfg = await weather.config(domain);
  const tr = cfg.timeRanges[0];
  const resolved = resolveTime(time, tr, cfg);
  await weather.expectOverlay(domain, tr.timeRange, resolved);
  return resolved;
}

test.describe("domain switching", () => {
  test("clicking switches to every domain, keeping the time", async ({
    weather,
    page
  }) => {
    test.setTimeout(90_000);
    let time = await pastTime(weather);
    await weather.open("temp", time);
    // Ends on temp, so every click switches to a different domain.
    const start = DOMAINS.indexOf("temp") + 1;
    const targets = [...DOMAINS.slice(start), ...DOMAINS.slice(0, start)];

    for (const target of targets) {
      await test.step(target, async () => {
        await page.locator(SEL.layerTrigger).click();
        await page
          .locator(`${SEL.layerSelectorItem}[href="/weather/map/${target}"]`)
          .click();
        time = await expectSwitchedTo(weather, target, time);
      });
    }
  });

  for (const [key, direction] of [
    ["n", 1],
    ["p", -1]
  ] as const) {
    test(`${key} cycles through every domain`, async ({ weather, page }) => {
      test.setTimeout(90_000);
      let time = await pastTime(weather);
      await weather.open("temp", time);
      const start = DOMAINS.indexOf("temp");

      for (let i = 1; i <= DOMAINS.length; i++) {
        await page.keyboard.press(key);
        const domain =
          DOMAINS[(start + direction * i + DOMAINS.length) % DOMAINS.length];
        time = await expectSwitchedTo(weather, domain, time);
      }
    });
  }

  test("switching in the forecast loads no station data", async ({
    weather,
    page
  }) => {
    const tr = await weather.timeRangeConfig("temp");
    const forecast = tr.maxAnalysisTimestamp + 6 * HOUR;
    await weather.open("temp", forecast);

    await page.keyboard.press("n");
    await expectSwitchedTo(weather, "wind", forecast);
    expect(weather.wasRequested(weather.stationsURL(forecast))).toBe(false);
  });
});

test.describe("URLs", () => {
  test("the bare map URL opens new-snow", async ({ weather, page }) => {
    await page.goto("/weather/map/");
    await weather.expectDomain("new-snow");
    const tr = await weather.timeRangeConfig("new-snow");
    await weather.expectTime(tr.initialTimestamp);
    await weather.expectTimeRange(tr.timeRange);
  });

  test("a deep link opens its time and time range", async ({
    weather,
    page
  }) => {
    const cfg = await weather.config("new-snow");
    const tr = await weather.timeRangeConfig("new-snow", 12);
    const time = resolveTime(tr.maxAnalysisTimestamp - 48 * HOUR, tr, cfg);
    await weather.open("new-snow", time, 12);

    await weather.expectTimeRange(12);
    await weather.expectOverlay("new-snow", 12, time);
    await expect(page.locator(SEL.rangeBegin)).toHaveText(
      iso(time - 12 * HOUR).slice(11, 16)
    );
    await expect(page.locator(SEL.rangeEnd)).toHaveText(
      `${iso(time).slice(11, 16)} UTC`
    );
  });

  test("the point indicator shows the time in UTC", async ({
    weather,
    page
  }) => {
    const time = await pastTime(weather);
    await weather.open("temp", time);
    await expect(page.locator(SEL.pointExact)).toHaveText(
      `${iso(time).slice(11, 16)} UTC`
    );
  });

  test("a time after the forecast is clamped to its end", async ({
    weather,
    page
  }) => {
    const tr = await weather.timeRangeConfig("temp");
    await weather.open("temp", tr.maxForecastTimestamp + 48 * HOUR);
    await weather.expectOverlay("temp", 1, tr.maxForecastTimestamp);

    await page.keyboard.press("ArrowLeft");
    await weather.expectTime(tr.maxForecastTimestamp - HOUR);
  });

  test("a time before the data is clamped to its start", async ({
    weather,
    page
  }) => {
    const { minTimestamp } = await weather.config("temp");
    await weather.open("temp", minTimestamp - 365 * 24 * HOUR);
    await weather.expectOverlay("temp", 1, minTimestamp);

    await page.keyboard.press("ArrowRight");
    await weather.expectTime(minTimestamp + HOUR);
  });

  test("an invalid time falls back to the default", async ({
    weather,
    page
  }) => {
    test.fail(true, "initDomain throws on an unparsable timestamp");
    await page.goto("/weather/map/temp/not-a-date");
    await weather.expectDomain("temp");
    const tr = await weather.timeRangeConfig("temp");
    await weather.expectOverlay("temp", 1, tr.initialTimestamp);
  });

  test("an unknown domain shows no map", async ({ page }) => {
    await page.goto("/weather/map/nonexistent/");
    await expect(page.locator("#section-weather-map")).toBeAttached();
    await expect(page.locator(".map-cockpit")).toHaveCount(0);
  });

  test("back and forward restore the domain", async ({ weather, page }) => {
    await weather.open("temp");
    await weather.open("new-snow");

    await page.goBack();
    await weather.expectDomain("temp");
    const tr = await weather.timeRangeConfig("temp");
    await weather.expectOverlay("temp", 1, tr.initialTimestamp);

    await page.goForward();
    await weather.expectDomain("new-snow");
  });
});

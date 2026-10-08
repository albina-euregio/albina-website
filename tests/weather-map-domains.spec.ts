import {
  DOMAINS,
  HOUR,
  SEL,
  STATION_TIME_RANGES,
  WIND_DIRECTION_OVERLAYS,
  expect,
  iso,
  resolveTime,
  test
} from "./weather-map-helpers";

for (const domain of DOMAINS) {
  test.describe(domain, () => {
    test("opens at the config's default time and time range", async ({
      weather,
      page
    }) => {
      await weather.open(domain);
      const { timeRanges } = await weather.config(domain);
      const tr = timeRanges[0];

      await weather.expectTime(tr.initialTimestamp);
      await weather.expectTimeRange(tr.timeRange);
      await weather.expectOverlay(domain, tr.timeRange, tr.initialTimestamp);
      await expect(
        page.locator(tr.timeRange > 1 ? SEL.rangeIndicator : SEL.pointIndicator)
      ).toBeAttached();
      if (timeRanges.length > 1) {
        await expect(page.locator(SEL.rangeButtons)).toHaveText(
          timeRanges.map(t => `${t.timeRange}h`)
        );
      } else {
        await expect(page.locator(SEL.rangeLabel)).toBeVisible();
      }
    });

    test("loads the overlay of every time range", async ({ weather, page }) => {
      const cfg = await weather.config(domain);
      test.skip(cfg.timeRanges.length < 2, "single time range");
      await weather.open(domain);

      // Switching keeps the selected time, resolved to the new range's slots.
      let time = cfg.timeRanges[0].initialTimestamp;
      for (const tr of cfg.timeRanges.slice(1)) {
        await page.locator(`.cp-range-${tr.timeRange}`).click();
        await weather.expectTimeRange(tr.timeRange);
        time = resolveTime(time, tr, cfg);
        await weather.expectOverlay(domain, tr.timeRange, time);
      }
    });

    test("flipper steps by the time step, reload keeps the time", async ({
      weather,
      page
    }) => {
      await weather.open(domain);
      const cfg = await weather.config(domain);
      const tr = cfg.timeRanges[0];
      const step = tr.timeStepHours * HOUR;
      // The default URL is re-read and snapped to a slot (matters for
      // relative-snow, whose synthesized default is the current hour).
      const start = resolveTime(tr.initialTimestamp, tr, cfg);

      await page.locator(SEL.flipperLeft).click();
      await weather.expectTime(start - step);
      await weather.expectOverlay(domain, tr.timeRange, start - step);

      await page.locator(SEL.flipperRight).click();
      await weather.expectTime(start);
      if (start + step <= tr.maxForecastTimestamp) {
        await page.locator(SEL.flipperRight).click();
        await weather.expectTime(start + step);
        await weather.expectOverlay(domain, tr.timeRange, start + step);
      }

      const url = page.url();
      await page.reload();
      await weather.expectDomain(domain);
      expect(page.url()).toBe(url);
    });

    const stationTimeRanges = STATION_TIME_RANGES[domain];
    if (stationTimeRanges) {
      test("loads station data up to the analysis time only", async ({
        weather
      }) => {
        const timeRange = stationTimeRanges[0];
        const cfg = await weather.config(domain);
        const tr = await weather.timeRangeConfig(domain, timeRange);
        const analysis = resolveTime(tr.maxAnalysisTimestamp, tr, cfg);

        await weather.open(domain, analysis, timeRange);
        await weather.expectOverlay(domain, timeRange, analysis);
        expect(weather.wasRequested(weather.stationsURL(analysis))).toBe(true);

        const forecast = analysis + tr.timeStepHours * HOUR;
        test.skip(forecast > tr.maxForecastTimestamp, "no forecast");
        await weather.open(domain, forecast, timeRange);
        // Station data is requested before the overlay.
        await weather.expectOverlay(domain, timeRange, forecast);
        expect(weather.wasRequested(weather.stationsURL(forecast))).toBe(false);
      });
    } else {
      test("loads no station data", async ({ weather }) => {
        await weather.open(domain);
        const tr = await weather.timeRangeConfig(domain);
        await weather.expectOverlay(domain, tr.timeRange, tr.initialTimestamp);
        expect(weather.wasRequested("_linea.geojson")).toBe(false);
      });
    }

    const windDirection = WIND_DIRECTION_OVERLAYS[domain];
    test(
      windDirection
        ? "loads the wind direction overlay"
        : "loads no wind direction overlay",
      async ({ weather }) => {
        await weather.open(domain);
        const tr = await weather.timeRangeConfig(domain);
        const time = tr.initialTimestamp;
        await weather.expectOverlay(domain, tr.timeRange, time);
        if (windDirection) {
          const s = iso(time);
          await weather.expectLoaded(
            `/zamg_meteo/overlays/${windDirection.domain}/${s.slice(0, 4)}/${s.slice(0, 10)}/${s.slice(0, 10)}_${s.slice(11, 13)}-00_${windDirection.file}.png`
          );
        } else {
          expect(weather.wasRequested("wind-dir")).toBe(false);
        }
      }
    );
  });
}

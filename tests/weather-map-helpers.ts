import { test as base, expect, type Page } from "@playwright/test";

/** Mirrors `config.domains` in app/stores/weatherMapStore.ts. */
export const DOMAINS = [
  "snow-height",
  "new-snow",
  "diff-snow",
  "relative-snow",
  "snow-line",
  "temp",
  "wind",
  "gust",
  "wind700hpa"
] as const;

export type DomainId = (typeof DOMAINS)[number];

export const DOMAIN_TITLES: Record<DomainId, string> = {
  "snow-height": "Snow Height",
  "new-snow": "Forecasted Fresh Snow",
  "diff-snow": "Snow Height Diff",
  "relative-snow": "Relative Snow Height",
  "snow-line": "Snowfall Limit",
  temp: "Temperature",
  wind: "Wind",
  gust: "Gust",
  wind700hpa: "High Altitude Wind"
};

/** Mirrors `DATA_ID_BY_DOMAIN_TIME_RANGE` in app/stores/weatherMapStore.ts. */
export const STATION_TIME_RANGES: Partial<Record<DomainId, number[]>> = {
  "snow-height": [1],
  "diff-snow": [24, 48, 72],
  temp: [1],
  wind: [1],
  gust: [1],
  wind700hpa: [1]
};

/** Mirrors `WIND_DIRECTION_OVERLAY_BY_DOMAIN` in app/stores/weatherMapStore.ts. */
export const WIND_DIRECTION_OVERLAYS: Partial<
  Record<DomainId, { domain: DomainId; file: string }>
> = {
  wind: { domain: "wind", file: "wind-dir" },
  gust: { domain: "wind", file: "wind-dir" },
  wind700hpa: { domain: "wind700hpa", file: "wind-dir700hpa" }
};

export const HOUR = 3_600_000;

export const SEL = {
  layerTrigger: ".cp-layer-trigger",
  layerSelectorItem: ".cp-layer-selector .cp-layer-selector-item",
  rangeButtons: ".cp-range-buttons a",
  rangeButtonActive: ".cp-range-buttons .js-active",
  rangeLabel: ".cp-range-label",
  rangeIndicator: ".cp-scale-stamp-range.js-active",
  rangeBegin: ".cp-scale-stamp-range-begin",
  rangeEnd: ".cp-scale-stamp-range-end",
  // Width 0 by design: wait for it attached, read its text child.
  pointIndicator: ".cp-scale-stamp-point.js-active",
  pointExact: ".cp-scale-stamp-point-exact",
  flipperLeft: ".cp-scale-flipper-left",
  flipperRight: ".cp-scale-flipper-right",
  playerPlay: ".cp-movie-play",
  playerStop: ".cp-movie-stop",
  playerPlaying: ".cp-movie.js-playing",
  calendarInput: 'input[type="datetime-local"]',
  ruler: ".cp-scale-days-2024"
} as const;

/** One `timeRanges[]` entry of a domain's live config.json, times as epoch ms. */
export interface TimeRangeConfig {
  timeRange: number;
  timeStepHours: number;
  imageOverlayURL: string;
  initialTimestamp: number;
  maxAnalysisTimestamp: number;
  maxForecastTimestamp: number;
}

export interface DomainConfig {
  timeRanges: TimeRangeConfig[];
  minTimestamp: number;
}

/**
 * relative-snow has no config.json yet; the app synthesizes one around the
 * current hour (`buildRelativeSnowFallbackConfig`).
 */
function relativeSnowConfig(): DomainConfig {
  const now = Math.floor(Date.now() / HOUR) * HOUR;
  return {
    timeRanges: [
      {
        timeRange: 24,
        timeStepHours: 24,
        imageOverlayURL:
          "https://models.avalanche.report/relativesnowheight/$date/$date_00-00_REL.gif",
        initialTimestamp: now,
        maxAnalysisTimestamp: now,
        maxForecastTimestamp: now
      }
    ],
    minTimestamp: Date.parse("2021-01-01T00:00:00Z")
  };
}

export const iso = (ms: number) => new Date(ms).toISOString();

/** `ms` as the `datetime-local` value the date picker reads as UTC. */
export const pickerValue = (ms: number) => iso(ms).slice(0, 16);

/**
 * The time `initDomain` resolves a requested time to: the nearest
 * `timeStepHours` slot of the day (ties to the earlier one), clamped to the
 * selectable range.
 */
export function resolveTime(
  ms: number,
  tr: TimeRangeConfig,
  cfg: DomainConfig
): number {
  const step = tr.timeStepHours * HOUR;
  const dayStart = Math.floor(ms / (24 * HOUR)) * 24 * HOUR;
  const sinceDayStart = ms - dayStart;
  const lower = Math.floor(sinceDayStart / step) * step;
  const snapped =
    dayStart +
    (sinceDayStart - lower <= lower + step - sinceDayStart
      ? lower
      : lower + step);
  return Math.min(Math.max(snapped, cfg.minTimestamp), tr.maxForecastTimestamp);
}

/** Fill `$year`/`$date`/`$hour` of a config URL template for `ms`. */
function fillTemplate(template: string, ms: number): string {
  const s = iso(ms);
  return template
    .replace(/\$year/g, s.slice(0, 4))
    .replace(/\$date/g, s.slice(0, 10))
    .replace(/\$hour/g, s.slice(11, 13));
}

/**
 * Page object for /weather/map. Tracks every request the page makes, so
 * tests can assert what the map actually loaded: the overlays render on a
 * MapLibre canvas, and the station and wind markers are canvas layers too.
 */
export class WeatherMap {
  private readonly requested: string[] = [];
  private readonly statuses = new Map<string, number>();
  private readonly configs = new Map<DomainId, Promise<DomainConfig>>();
  readonly pageErrors: Error[] = [];

  constructor(readonly page: Page) {
    page.on("request", r => this.requested.push(r.url()));
    page.on("response", r => this.statuses.set(r.url(), r.status()));
    page.on("requestfailed", r => this.statuses.set(r.url(), 0));
    page.on("pageerror", e => {
      // How WebKit rejects the map's fetches that a navigation cancels.
      if (e.message.endsWith(" due to access control checks.")) return;
      this.pageErrors.push(e);
    });
  }

  config(domain: DomainId): Promise<DomainConfig> {
    let cfg = this.configs.get(domain);
    if (!cfg) {
      cfg = this.fetchConfig(domain);
      this.configs.set(domain, cfg);
    }
    return cfg;
  }

  private async fetchConfig(domain: DomainId): Promise<DomainConfig> {
    if (domain === "relative-snow") return relativeSnowConfig();
    const response = await this.page.request.get(
      `/zamg_meteo/overlays/${domain}/config.json`
    );
    expect(response.ok(), `${domain} config.json`).toBe(true);
    const json = await response.json();
    return {
      minTimestamp: Date.parse(json.boundingBoxes[0].validity[0]),
      timeRanges: json.timeRanges.map(
        (tr: Record<string, string | number>) => ({
          timeRange: tr.timeRange,
          timeStepHours: tr.timeStepHours,
          imageOverlayURL: tr.imageOverlayURL,
          initialTimestamp: Date.parse(tr.initialTimestamp as string),
          maxAnalysisTimestamp: Date.parse(tr.maxAnalysisTimestamp as string),
          maxForecastTimestamp: Date.parse(tr.maxForecastTimestamp as string)
        })
      )
    };
  }

  /** The config's entry for `timeRange`, else the default (first) one. */
  async timeRangeConfig(
    domain: DomainId,
    timeRange?: number
  ): Promise<TimeRangeConfig> {
    const { timeRanges } = await this.config(domain);
    return timeRanges.find(tr => tr.timeRange === timeRange) ?? timeRanges[0];
  }

  /**
   * Open the map, optionally deep-linked, and wait until the cockpit shows
   * the domain. Without a time, also wait for the default to land in the URL.
   */
  async open(domain: DomainId, time?: number, timeRange?: number) {
    let path = `/weather/map/${domain}/`;
    if (time !== undefined) path += encodeURIComponent(iso(time));
    if (timeRange !== undefined) path += `/${timeRange}`;
    await this.page.goto(path);
    if (time === undefined) {
      await expect(this.page).toHaveURL(
        new RegExp(`/weather/map/${domain}/\\d[^/]*/\\d+$`)
      );
    }
    await this.expectDomain(domain);
  }

  async expectDomain(domain: DomainId) {
    await expect(this.page).toHaveURL(
      new RegExp(`/weather/map/${domain}(/|$)`)
    );
    await expect(
      this.page.locator(`${SEL.layerSelectorItem}.js-active`)
    ).toHaveAttribute("href", `/weather/map/${domain}`);
    await expect(this.page.locator(SEL.layerTrigger)).toContainText(
      DOMAIN_TITLES[domain]
    );
  }

  /** The time in the URL, as epoch ms. */
  time(): number {
    const ts = /\/weather\/map\/[^/]+\/([^/]+)/.exec(this.page.url())?.[1];
    if (!ts) throw new Error(`No timestamp in ${this.page.url()}`);
    return Date.parse(decodeURIComponent(ts));
  }

  async expectTime(ms: number) {
    await expect.poll(() => iso(this.time())).toBe(iso(ms));
  }

  async expectTimeRange(timeRange: number) {
    await expect(this.page).toHaveURL(new RegExp(`/${timeRange}$`));
    if ((await this.config(this.domain())).timeRanges.length > 1) {
      await expect(this.page.locator(SEL.rangeButtonActive)).toHaveText(
        `${timeRange}h`
      );
    }
  }

  domain(): DomainId {
    return /\/weather\/map\/([^/]+)/.exec(this.page.url())?.[1] as DomainId;
  }

  /** Assert the overlay image for this state was fetched successfully. */
  async expectOverlay(domain: DomainId, timeRange: number, time: number) {
    const tr = await this.timeRangeConfig(domain, timeRange);
    const file = fillTemplate(tr.imageOverlayURL, time);
    const url =
      domain === "relative-snow"
        ? file
        : `/zamg_meteo/overlays/${domain}/${iso(time).slice(0, 4)}/${iso(time).slice(0, 10)}/${file.slice(file.lastIndexOf("/") + 1)}`;
    await this.expectLoaded(url);
  }

  /** Assert a request whose URL ends with `suffix` succeeded. */
  async expectLoaded(suffix: string) {
    await expect
      .poll(() => this.statusOf(suffix), {
        message: `HTTP status of ${suffix}`
      })
      .toBe(200);
  }

  private statusOf(suffix: string): number | undefined {
    for (const [url, status] of this.statuses) {
      if (url.endsWith(suffix)) return status;
    }
  }

  stationsURL(time: number): string {
    const date = iso(time).slice(0, 10);
    return `/eaws_weather_stations/${date}/${date}_${iso(time).slice(11, 13)}-00_linea.geojson`;
  }

  wasRequested(suffix: string): boolean {
    return this.requested.some(url => url.endsWith(suffix));
  }
}

/**
 * `weather` wraps the page in a `WeatherMap` and fails the test on any
 * uncaught page error. These tests run against live data, hence the longer
 * timeout.
 */
export const test = base.extend<{ weather: WeatherMap }>({
  // Not named `use`, which the React hooks lint rule mistakes for a hook.
  weather: async ({ page }, provide, testInfo) => {
    testInfo.slow();
    const weather = new WeatherMap(page);
    await provide(weather);
    expect(weather.pageErrors.map(e => e.message)).toEqual([]);
  }
});

export { expect };

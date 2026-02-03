import { expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Domain definitions
// ---------------------------------------------------------------------------

/** All 8 domain IDs in config iteration order. */
export const ALL_DOMAINS = [
  "snow-height",
  "new-snow",
  "diff-snow",
  "snow-line",
  "temp",
  "wind",
  "gust",
  "wind700hpa"
] as const;

export type DomainId = (typeof ALL_DOMAINS)[number];

/** English display titles as they appear in the cockpit trigger/selector. */
export const DOMAIN_TITLES: Record<DomainId, string> = {
  "snow-height": "Snow Height",
  "new-snow": "Forecasted Fresh Snow",
  "diff-snow": "Snow Height Diff",
  "snow-line": "Snowfall Limit",
  temp: "Temperature",
  wind: "Wind",
  gust: "Gust",
  wind700hpa: "High Altitude Wind"
};

/** RegExp matching the overlay image src for each domain. */
export const OVERLAY_PATTERNS: Record<DomainId, RegExp> = {
  "snow-height": /_snow-height_V2\.gif$/,
  "new-snow": /_new-snow_\d+h_V2\.gif$/,
  "diff-snow": /_diff-snow_\d+h_V2\.gif$/,
  "snow-line": /_snow-line_V3\.gif$/,
  temp: /_temp_V3\.gif$/,
  wind: /_wind_V3\.gif$/,
  gust: /_gust_V3\.gif$/,
  wind700hpa: /_wind700hpa\.gif$/
};

/** Domains that use instantaneous (+-1) timespan — hourly slots. */
export const INSTANTANEOUS_DOMAINS: DomainId[] = [
  "snow-height",
  "snow-line",
  "temp",
  "wind",
  "gust",
  "wind700hpa"
];

/** Domains that use forecast (+N) timespans. */
export const FORECAST_DOMAINS: DomainId[] = ["new-snow"];

/** Domains that use historical (-N) timespans. */
export const HISTORICAL_DOMAINS: DomainId[] = ["diff-snow"];

/** Domains where `layer.stations = true`. */
export const STATION_DOMAINS: DomainId[] = [
  "snow-height",
  "diff-snow",
  "temp",
  "wind",
  "gust",
  "wind700hpa"
];

/** Domains with wind direction grid indicators. */
export const DIRECTION_DOMAINS: DomainId[] = ["wind", "gust", "wind700hpa"];

/** Domains with no station markers. */
export const NO_STATION_DOMAINS: DomainId[] = ["new-snow", "snow-line"];

/** Timespan configs for multi-timespan domains. */
export const MULTI_TIMESPAN = {
  "new-snow": {
    timespans: ["+6", "+12", "+24", "+48", "+72"],
    default: "+12",
    hours: [6, 12, 24, 48, 72]
  },
  "diff-snow": {
    timespans: ["-6", "-12", "-24", "-48", "-72"],
    default: "-6",
    hours: [6, 12, 24, 48, 72]
  }
} as const;

// ---------------------------------------------------------------------------
// CSS selectors
// ---------------------------------------------------------------------------

export const SEL = {
  // Overlay image
  overlayImg: ".leaflet-image-layer.map-info-layer",

  // Cockpit — domain selector
  layerTrigger: ".cp-layer-trigger",
  layerSelector: ".cp-layer-selector",
  layerSelectorItem: ".cp-layer-selector .cp-layer-selector-item",

  // Cockpit — timespan buttons
  rangeButtons: ".cp-range-buttons",
  rangeButtonActive: ".cp-range-buttons .js-active",
  rangeHourlyActive: ".cp-range-hourly.js-active",

  // Timeline — range indicator (>1h timespans)
  rangeIndicator: ".cp-scale-stamp-range.js-active",
  rangeEnd: ".cp-scale-stamp-range-end",
  rangeBegin: ".cp-scale-stamp-range-begin",

  // Timeline — point indicator (1h / +-1 timespans)
  pointIndicator: ".cp-scale-stamp-point.js-active",
  pointExact: ".cp-scale-stamp-point.js-active .cp-scale-stamp-point-exact",

  // Flipper buttons
  flipperLeft: ".cp-scale-flipper-left",
  flipperRight: ".cp-scale-flipper-right",

  // Player
  playerPlay: ".cp-movie-play",
  playerStop: ".cp-movie-stop",
  playerPlaying: ".cp-movie.js-playing",

  // Calendar
  calendarButton: ".cp-calendar-select",
  calendarInput: 'input[type="datetime-local"]',

  // Timeline ruler / drag
  rulerDrag: ".cp-scale-days-2024",
  scale: ".cp-scale",

  // Station markers (excluding wind direction arrows)
  stationMarkers:
    '.leaflet-marker-pane .leaflet-marker-icon:not([title="directionMarker"])',
  // All markers including direction arrows
  allMarkers: ".leaflet-marker-pane .leaflet-marker-icon",
  // Direction markers only
  directionMarkers:
    '.leaflet-marker-pane .leaflet-marker-icon[title="directionMarker"]'
} as const;

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Assert the overlay image has fully loaded (not a broken/missing image). */
export async function expectOverlayLoaded(page: Page) {
  await expect
    .poll(
      () =>
        page
          .locator(SEL.overlayImg)
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
          ),
      { message: "overlay image should load successfully", timeout: 10_000 }
    )
    .toBe(true);
}

/** Extract the ISO timestamp segment from a weather-map URL. */
export function extractTimestamp(url: string): string | null {
  const m = url.match(/\/weather\/map\/[^/]+\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Extract the domain slug from a weather-map URL. */
export function extractDomain(url: string): string | null {
  const m = url.match(/\/weather\/map\/([^/]+)/);
  return m ? m[1] : null;
}

/** Assert a timestamp string represents a valid date (year 2020–2030). */
export function expectValidTimestamp(ts: string | null): asserts ts is string {
  expect(ts).toBeTruthy();
  const year = new Date(ts as string).getFullYear();
  expect(year).toBeGreaterThan(2020);
  expect(year).toBeLessThan(2030);
}

/**
 * Wait for the timeline indicator appropriate for the given domain.
 * - Range indicator for forecast/historical domains (new-snow, diff-snow)
 * - Point indicator (attached) for instantaneous domains
 */
export async function waitForTimelineReady(page: Page, domain: DomainId) {
  if (domain === "new-snow" || domain === "diff-snow") {
    await page.locator(SEL.rangeIndicator).waitFor();
  } else {
    // Point indicator has width:0 — only check DOM attachment
    await page.locator(SEL.pointIndicator).waitFor({ state: "attached" });
  }
}

/**
 * Navigate to a domain URL, wait for the timeline to be ready,
 * and assert the URL contains the domain.
 */
export async function navigateAndWait(page: Page, domain: DomainId) {
  await page.goto(`/weather/map/${domain}/`);
  await waitForTimelineReady(page, domain);
  await expect(page).toHaveURL(new RegExp(`/weather/map/${domain}/`));
}

/**
 * Switch to a target domain via mouse click on the cockpit selector.
 * Waits for the domain trigger text to update and overlay to start loading.
 */
export async function switchDomainByClick(page: Page, targetDomain: DomainId) {
  // Open domain selector panel
  await page.locator(SEL.layerTrigger).click();

  // Click the target domain item using href to avoid ambiguous text matches
  // (e.g. "Snow Height" vs "Snow Height Diff", "Wind" vs "High Altitude Wind")
  await page
    .locator(`${SEL.layerSelectorItem}[href="/weather/map/${targetDomain}"]`)
    .click();

  // Wait for trigger to update and URL to change
  await expect(page).toHaveURL(new RegExp(`/weather/map/${targetDomain}/`));

  // Wait for the appropriate timeline indicator
  await waitForTimelineReady(page, targetDomain);
}

/** Timespan button selector for a given hours value (e.g. 6 → ".cp-range-6"). */
export function timespanSelector(hours: number): string {
  return `.cp-range-${hours}`;
}

/**
 * Return the overlay src pattern for a specific domain and timespan hours.
 * For multi-timespan domains (new-snow, diff-snow) the pattern includes the hours.
 */
export function overlayPatternForTimespan(
  domain: DomainId,
  hours: number
): RegExp {
  if (domain === "new-snow") {
    return new RegExp(`_new-snow_${hours}h_V2\\.gif$`);
  }
  if (domain === "diff-snow") {
    return new RegExp(`_diff-snow_${hours}h_V2\\.gif$`);
  }
  return OVERLAY_PATTERNS[domain];
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import type { MessageId } from "../i18n";
import { $router, redirectPageQuery } from "../components/router";
import { fetchJSON } from "../util/fetch";

const DEFAULT_RANGE_DAYS = 30;

export const SNOW_PROFILE_STABILITIES = [
  "good",
  "fair",
  "poor",
  "very-poor",
  "no-test"
] as const;

export type SnowProfileStability = (typeof SNOW_PROFILE_STABILITIES)[number];

/**
 * Ranks a stability so the least stable draws on top of the map / sorts first.
 * "No test" carries no assessment and ranks below all graded profiles.
 */
const STABILITY_SEVERITY: Record<SnowProfileStability, number> = {
  "very-poor": 4,
  poor: 3,
  fair: 2,
  good: 1,
  "no-test": 0
};

export function snowProfileStabilitySeverity(
  stability: SnowProfileStability
): number {
  return STABILITY_SEVERITY[stability];
}

/** i18n message id for a stability's human label. */
export function stabilityLabelId(stability: SnowProfileStability): MessageId {
  return `profiles:stability:${stability}` as MessageId;
}

interface RawSnowProfile {
  id: string;
  dateTime?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  regionId?: string;
  location?: string;
  elevation?: number;
  snowHeight?: number;
  stability?: string;
}

export class SnowProfileData {
  readonly id: string;
  readonly raw: RawSnowProfile;

  constructor(raw: RawSnowProfile) {
    this.id = raw.id;
    this.raw = raw;
  }

  get location(): string {
    return this.raw.location ?? "";
  }

  get lat(): number | undefined {
    return this.raw.latitude;
  }

  get lon(): number | undefined {
    return this.raw.longitude;
  }

  get hasLocation(): boolean {
    return typeof this.lat === "number" && typeof this.lon === "number";
  }

  get dateTime(): Date | undefined {
    return this.raw.dateTime ? new Date(this.raw.dateTime) : undefined;
  }

  get stability(): SnowProfileStability | undefined {
    const stability = this.raw.stability;
    return stability &&
      (SNOW_PROFILE_STABILITIES as readonly string[]).includes(stability)
      ? (stability as SnowProfileStability)
      : undefined;
  }

  /** Macro-region code (config.regionCodes) derived from lawis' hierarchical regionId. */
  get region(): string | undefined {
    const regionId = this.raw.regionId;
    return regionId
      ? config.stationRegions.find(code => regionId.startsWith(code))
      : undefined;
  }
}

function toISODate(date: Temporal.PlainDate) {
  return date.toString();
}

function defaultDateFrom() {
  return toISODate(
    Temporal.Now.plainDateISO().subtract({ days: DEFAULT_RANGE_DAYS })
  );
}

function defaultDateTo() {
  return toISODate(Temporal.Now.plainDateISO());
}

async function fetchSnowProfiles(
  dateFrom: string,
  dateTo: string
): Promise<SnowProfileData[]> {
  const url = `${config.apis.profiles}/profiles/export?format=json&dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  try {
    const raw = await fetchJSON<RawSnowProfile[]>(url);
    return raw.map(r => new SnowProfileData(r));
  } catch (e) {
    console.error("Failed fetching snow profiles", e);
    return [];
  }
}

export type SortableField = "location" | "dateTime" | "region" | "stability";
type SortDir = "asc" | "desc";

/**
 * Per-column value accessors for fields that must sort by meaning rather than
 * alphabetically. Stability sorts by severity (least stable first).
 */
const SORT_ACCESSORS: Partial<
  Record<SortableField, (r: SnowProfileData) => unknown>
> = {
  stability: r =>
    r.stability ? -snowProfileStabilitySeverity(r.stability) : undefined
};

function compareSnowProfileData(
  a: SnowProfileData,
  b: SnowProfileData,
  sortValue: SortableField,
  sortDir: SortDir
): number {
  const order = sortDir === "asc" ? [-1, 1] : [1, -1];
  const accessor =
    SORT_ACCESSORS[sortValue] ?? ((r: SnowProfileData) => r[sortValue]);
  const va = accessor(a);
  const vb = accessor(b);
  if (va === vb) return 0;
  if (va === undefined) return order[1];
  if (vb === undefined) return order[0];
  if (va instanceof Date && vb instanceof Date) {
    return va < vb ? order[0] : order[1];
  }
  if (typeof va === "number" && typeof vb === "number") {
    return va < vb ? order[0] : order[1];
  }
  return String(va) < String(vb) ? order[0] : order[1];
}

export function useSnowProfileData() {
  const router = useStore($router);
  const [data, setData] = useState<SnowProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  const dateFrom = router?.search?.dateFrom || defaultDateFrom();
  const dateTo = router?.search?.dateTo || defaultDateTo();
  const setDateRange = (nextDateFrom: string, nextDateTo: string) =>
    redirectPageQuery({ dateFrom: nextDateFrom, dateTo: nextDateTo });

  const activeRegion = router?.search?.activeRegion || "";
  const setActiveRegion = (region: string) =>
    redirectPageQuery({ activeRegion: region === "all" ? "" : region });

  const searchText = router?.search?.searchText || "";
  const setSearchText = (searchText: string) =>
    redirectPageQuery({ searchText });

  const sortValue = (router?.search?.sortValue as SortableField) || "dateTime";
  const sortDir = (router?.search?.sortDir as SortDir) || "desc";
  const sortBy = (sortValue: SortableField, sortDir: SortDir) =>
    redirectPageQuery({ sortValue, sortDir });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchSnowProfiles(dateFrom, dateTo));
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const sortedFilteredData = useMemo(() => {
    const pattern = searchText ? new RegExp(searchText, "i") : undefined;
    return data
      .filter(row => !activeRegion || row.region === activeRegion)
      .filter(row => !pattern || row.location.match(pattern))
      .sort((a, b) => compareSnowProfileData(a, b, sortValue, sortDir));
  }, [data, activeRegion, searchText, sortValue, sortDir]);

  return {
    data,
    loading,
    dateFrom,
    dateTo,
    setDateRange,
    activeRegion,
    setActiveRegion,
    searchText,
    setSearchText,
    sortValue,
    sortDir,
    sortBy,
    sortedFilteredData
  };
}

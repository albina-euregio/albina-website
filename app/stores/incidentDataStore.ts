import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { $router, redirectPageQuery } from "../components/router";
import { fetchJSON } from "../util/fetch";
import { currentSeasonYear } from "../util/date-season";
import { getWarnlevelNumber, WARNLEVEL_COLORS } from "../util/warn-levels";
import type { DangerRatingValue } from "./bulletin";

/**
 * Shape of `Incident.publicData` as returned by GET /incidents. The OpenAPI
 * spec (https://dev.avalanche.report/api/openapi.json) types this as a bare
 * `object` (the backend keeps it generic), so this interface is inferred from
 * observed responses rather than a generated schema.
 */
export interface IncidentPublicData {
  dateTime?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: string;
  avalancheRegion?: string | null;
  dangerRating?: DangerRatingValue;
  avalancheType?: string;
  avalancheSize?: string;
  trigger?: string;
  remoteTriggering?: string;
  personInvolvement?: string;
  otherDamages?: string;
  startZoneElevation?: number;
}

interface RawIncident {
  id: string;
  publishedAt?: string;
  publicData?: IncidentPublicData;
}

export class IncidentData {
  readonly id: string;
  readonly region: string;
  readonly publicData: IncidentPublicData;
  readonly publishedAt?: Date;

  constructor(raw: RawIncident, region: string) {
    this.id = raw.id;
    this.region = region;
    this.publicData = raw.publicData ?? {};
    this.publishedAt = raw.publishedAt ? new Date(raw.publishedAt) : undefined;
  }

  get location(): string {
    return this.publicData.location ?? "";
  }

  get lat(): number | undefined {
    return this.publicData.latitude;
  }

  get lon(): number | undefined {
    return this.publicData.longitude;
  }

  get hasLocation(): boolean {
    return typeof this.lat === "number" && typeof this.lon === "number";
  }

  get dateTime(): Date | undefined {
    return this.publicData.dateTime
      ? new Date(this.publicData.dateTime)
      : undefined;
  }

  get dangerRating(): DangerRatingValue | undefined {
    return this.publicData.dangerRating;
  }

  get avalancheType(): string | undefined {
    return this.publicData.avalancheType;
  }

  get avalancheSize(): string | undefined {
    return this.publicData.avalancheSize;
  }

  get personInvolvement(): string | undefined {
    return this.publicData.personInvolvement;
  }

  /** Marker/legend color, reusing the standard avalanche danger scale colors. */
  get color(): string {
    const rating = this.dangerRating;
    return WARNLEVEL_COLORS[rating ? getWarnlevelNumber(rating) : 0];
  }
}

async function fetchIncidentsForRegion(
  region: string,
  seasonYear: number
): Promise<IncidentData[]> {
  const url = `${config.apis.incidents}?region=${encodeURIComponent(region)}&seasonYear=${seasonYear}`;
  try {
    const raw = await fetchJSON<RawIncident[]>(url);
    return raw.map(r => new IncidentData(r, region));
  } catch (e) {
    console.error("Failed fetching incidents for region " + region, e);
    return [];
  }
}

export async function loadIncidentData(
  seasonYear: number
): Promise<IncidentData[]> {
  const all = await Promise.all(
    config.regionCodes.map(region =>
      fetchIncidentsForRegion(region, seasonYear)
    )
  );
  return all.flat();
}

type SortableField = "location" | "dateTime" | "region";
type SortDir = "asc" | "desc";

function compareIncidentData(
  a: IncidentData,
  b: IncidentData,
  sortValue: SortableField,
  sortDir: SortDir
): number {
  const order = sortDir === "asc" ? [-1, 1] : [1, -1];
  const va = a[sortValue];
  const vb = b[sortValue];
  if (va === vb) return 0;
  if (va === undefined) return order[1];
  if (vb === undefined) return order[0];
  if (va instanceof Date && vb instanceof Date) {
    return va < vb ? order[0] : order[1];
  }
  return String(va) < String(vb) ? order[0] : order[1];
}

export function useIncidentData() {
  const router = useStore($router);
  const [data, setData] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);

  const activeRegion = router?.search?.activeRegion || "";
  const setActiveRegion = (region: string) =>
    redirectPageQuery({ activeRegion: region === "all" ? "" : region });

  const seasonYear = +(router?.search?.seasonYear || currentSeasonYear());
  const setSeasonYear = (seasonYear: number) =>
    redirectPageQuery({ seasonYear });

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
      setData(await loadIncidentData(seasonYear));
    } finally {
      setLoading(false);
    }
  }, [seasonYear]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const sortedFilteredData = useMemo(() => {
    const pattern = searchText ? new RegExp(searchText, "i") : undefined;
    return data
      .filter(row => !activeRegion || row.region === activeRegion)
      .filter(row => !pattern || row.location.match(pattern))
      .sort((a, b) => compareIncidentData(a, b, sortValue, sortDir));
  }, [data, activeRegion, searchText, sortValue, sortDir]);

  return {
    data,
    loading,
    activeRegion,
    setActiveRegion,
    seasonYear,
    setSeasonYear,
    searchText,
    setSearchText,
    sortValue,
    sortDir,
    sortBy,
    sortedFilteredData
  };
}

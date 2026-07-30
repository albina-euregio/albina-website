import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import * as v from "valibot";
import {
  vIncidentsAttachment,
  vIncidentsAvalancheProblem,
  vIncidentsIncidentSchema
} from "../api/valibot.gen";
import { $router, redirectPageQuery } from "../components/router";
import { fetchJSON } from "../util/fetch";
import { currentSeasonYear } from "../util/date-season";
import { getWarnlevelNumber } from "../util/warn-levels";
import type { DangerRatingValue } from "./bulletin";

/** The full incident schema (all fields) as generated from the OpenAPI spec. */
export type IncidentSchema = v.InferOutput<typeof vIncidentsIncidentSchema>;
export type IncidentAvalancheProblem = v.InferOutput<
  typeof vIncidentsAvalancheProblem
>;
export type IncidentAttachment = v.InferOutput<typeof vIncidentsAttachment>;

/** A public attachment with a resolved download URL, ready for rendering. */
export type IncidentAttachmentView = Partial<IncidentAttachment> & {
  url: string;
};

export type IncidentPublicData = Partial<IncidentSchema>;

/**
 * How people were affected by an incident, ordered from most to least severe.
 */
export const INCIDENT_INVOLVEMENTS = [
  "fatal",
  "injured",
  "involved",
  "uninvolved",
  "unknown"
] as const;

export type IncidentInvolvement = (typeof INCIDENT_INVOLVEMENTS)[number];

/** Ranks an involvement, most severe highest. */
export function involvementSeverity(involvement: IncidentInvolvement): number {
  return (
    INCIDENT_INVOLVEMENTS.length - INCIDENT_INVOLVEMENTS.indexOf(involvement)
  );
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

  get numberInvolved(): number {
    return this.publicData.involvementsFatalitiesBurials?.numberInvolved ?? 0;
  }

  get fatalities(): number {
    return this.publicData.involvementsFatalitiesBurials?.fatalities ?? 0;
  }

  get injuredSurvivors(): number {
    return this.publicData.involvementsFatalitiesBurials?.injuredSurvivors ?? 0;
  }

  /**
   * Public attachments with resolved download URLs. The public JSON omits the
   * binary; it is served (unauthenticated) from
   * `/incidents/{id}/attachment/{attachmentId}`.
   */
  get attachments(): IncidentAttachmentView[] {
    return (this.publicData.attachments ?? [])
      .filter(a => a.public !== false && a.id)
      .map(a => ({
        ...a,
        url: `${config.apis.incidents}/${this.id}/attachment/${a.id}`
      }));
  }

  get involvement(): IncidentInvolvement {
    if (this.fatalities) return "fatal";
    if (this.injuredSurvivors) return "injured";
    if (this.personInvolvement === "Yes" || this.numberInvolved)
      return "involved";
    if (this.personInvolvement === "No") return "uninvolved";
    return "unknown";
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

export type SortableField =
  | "location"
  | "dateTime"
  | "region"
  | "dangerRating"
  | "avalancheType"
  | "avalancheSize"
  | "personInvolvement";
type SortDir = "asc" | "desc";

/** EAWS avalanche-size ordering (smallest first); `unknown` sorts last. */
const AVALANCHE_SIZE_ORDER: Record<string, number> = {
  small: 0,
  small_medium: 1,
  medium: 2,
  medium_large: 3,
  large: 4,
  large_very_large: 5,
  very_large: 6,
  very_large_extreme: 7,
  extreme: 8
};

/**
 * Per-column value accessors for fields that must sort by meaning rather than
 * alphabetically.
 */
const SORT_ACCESSORS: Partial<
  Record<SortableField, (r: IncidentData) => unknown>
> = {
  dangerRating: r =>
    r.dangerRating ? getWarnlevelNumber(r.dangerRating) : undefined,
  avalancheSize: r =>
    r.avalancheSize ? AVALANCHE_SIZE_ORDER[r.avalancheSize] : undefined,
  personInvolvement: r => -involvementSeverity(r.involvement)
};

const collator = new Intl.Collator("de");

function compareIncidentData(
  a: IncidentData,
  b: IncidentData,
  sortValue: SortableField,
  sortDir: SortDir
): number {
  const order = sortDir === "asc" ? [-1, 1] : [1, -1];
  const accessor =
    SORT_ACCESSORS[sortValue] ?? ((r: IncidentData) => r[sortValue]);
  const va = accessor(a);
  const vb = accessor(b);
  if (va === vb) return 0;
  if (va === undefined || va === null) return order[1];
  if (vb === undefined || vb === null) return order[0];
  if (va instanceof Date && vb instanceof Date) {
    return va < vb ? order[0] : order[1];
  }
  if (typeof va === "number" && typeof vb === "number") {
    return va < vb ? order[0] : order[1];
  }
  return collator.compare(String(va), String(vb)) < 0 ? order[0] : order[1];
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

import { useStore } from "@nanostores/react";
import { currentSeasonYear } from "../util/date-season";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod/mini";
import { $router, redirectPageQuery } from "../components/router";

const number = z
  .nullish(z.number())
  .check(z.overwrite(v => (v === -777 ? undefined : v)));
const string = z.nullish(z.string());
const FeaturePropertiesSchema = z.object({
  $smet: string,
  $png: string,
  $stationsArchiveFile: string,
  "LWD-Nummer": string,
  "LWD-Region": string,
  altitude: number,
  Beobachtungsbeginn: string,
  date: z.nullish(z.coerce.date()),
  GS_O: number,
  GS_U: number,
  HS: number,
  HSD24: number,
  HSD48: number,
  HSD72: number,
  LD: number,
  LT_MAX: number,
  LT_MIN: number,
  LT: number,
  N24: number,
  N48: number,
  N6: number,
  N72: number,
  name: z.string(),
  OFT: number,
  operator: string,
  operatorLink: string,
  operatorLicense: string,
  operatorLicenseLink: string,
  plot: string,
  RH: number,
  TD: number,
  WG_BOE: number,
  WG: number,
  WR: number
});

type FeatureProperties = z.infer<typeof FeaturePropertiesSchema>;

export class StationData {
  id: string;
  geometry: GeoJSON.Point;
  properties: FeatureProperties;

  constructor(
    object: GeoJSON.Feature<GeoJSON.Point, Partial<FeatureProperties>>
  ) {
    this.id = object.id as string;
    this.geometry = object.geometry;
    this.properties = FeaturePropertiesSchema.parse(object.properties);
  }
  get lon() {
    return this.geometry.coordinates[0];
  }
  get lat() {
    return this.geometry.coordinates[1];
  }
  get elev() {
    return this.geometry.coordinates[2] ?? this.properties.altitude;
  }
  get name() {
    return this.properties.name;
  }
  get operator() {
    return this.properties.operator;
  }
  get operatorLink() {
    return this.properties.operatorLink || "";
  }
  get observationStart() {
    return this.properties.Beobachtungsbeginn;
  }
  get province() {
    const region = this.properties["LWD-Region"];
    if (typeof region !== "string") {
      return "";
    }
    const regions = [...config.regionCodes, ...config.extraRegions];
    return regions.find(r => region.startsWith(r)) ?? "";
  }
  get microRegion() {
    const region = this.properties["LWD-Region"];
    if (typeof region !== "string") {
      return "";
    }
    return region.split(/ /)?.[0];
  }
  get date() {
    return this.properties.date;
  }
  get temp() {
    return this.properties.LT;
  }
  get temp_srf() {
    return this.properties.OFT;
  }
  get dewp() {
    return this.properties.TD;
  }
  get temp_max() {
    return this.properties.LT_MAX;
  }
  get temp_min() {
    return this.properties.LT_MIN;
  }
  get snow() {
    return this.properties.HS;
  }
  get snow24() {
    return this.properties.HSD24;
  }
  get snow48() {
    return this.properties.HSD48;
  }
  get snow72() {
    return this.properties.HSD72;
  }
  get precipitation6() {
    return this.properties.N6;
  }
  get precipitation24() {
    return this.properties.N24;
  }
  get precipitation48() {
    return this.properties.N48;
  }
  get precipitation72() {
    return this.properties.N72;
  }
  get rhum() {
    return this.properties.RH;
  }
  get wdir() {
    return this.properties.WR;
  }
  get x_wdir() {
    if (typeof this.properties.WR !== "number") {
      return false;
    }
    const index = Math.round(((this.properties.WR + 360 - 22.5) % 360) / 45);
    const classes = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    return classes[index];
  }
  get wspd() {
    return this.properties.WG;
  }
  get wgus() {
    return this.properties.WG_BOE;
  }
  get gr_a() {
    return this.properties.GS_O;
  }
  get gr_b() {
    return this.properties.GS_U;
  }

  get plot() {
    return this.properties.plot;
  }

  get $smet() {
    return this.properties.$smet;
  }
  get $png() {
    return this.properties.$png;
  }

  get parametersForDialog() {
    const types = [
      { type: "snow", digits: 0, unit: "cm" },
      { type: "temp", digits: 1, unit: "°C" },
      { type: "rhum", digits: 0, unit: "%" },
      { type: "wspd", digits: 0, unit: "km/h" },
      { type: "wgus", digits: 0, unit: "km/h" }
    ] as const;
    return types
      .filter(t => this[t.type] !== undefined)
      .map(t => ({
        ...t,
        value: this[t.type]
      }));
  }

  round(value: number, digits = 0) {
    if (typeof value === "number") {
      return +value.toFixed(digits);
    } else if (value === undefined) {
      return false;
    } else {
      return value;
    }
  }
}

export function useStationData(
  sortValue0: keyof StationData = "name",
  activeRegionPredicate: (r: string) => boolean = () => true,
  activeYear0: number | "" = currentSeasonYear(),
  filterObservationStart0 = false
) {
  const router = useStore($router);

  const [dateTime, setDateTime] = useState<Temporal.ZonedDateTime>();
  const dateTimeMax = Temporal.Now.zonedDateTimeISO("Europe/Vienna");
  const [data, setData] = useState<StationData[]>([]);

  const [activeYear, setActiveYear] = [
    router?.search.activeYear
      ? parseInt(router?.search.activeYear)
      : activeYear0,
    (activeYear: string) => redirectPageQuery({ activeYear })
  ];

  const [searchText, setSearchText] = [
    router?.search?.searchText,
    (searchText: string) => redirectPageQuery({ searchText })
  ];

  const [sortValue, setSortValue] = [
    (router?.search.sortValue as keyof StationData) || sortValue0,
    (sortValue: keyof StationData) => redirectPageQuery({ sortValue })
  ];

  const [sortDir, setSortDir] = [
    (router?.search.sortDir ?? "asc") as "asc" | "desc",
    (sortDir: "asc" | "desc") => redirectPageQuery({ sortDir })
  ];

  const [activeRegion, setActiveRegion] = [
    router?.search.activeRegion || router?.search.province || "all",
    (activeRegion: string | "" | "all" | null | undefined) =>
      // activate all if undefined or null is given
      redirectPageQuery({ activeRegion: activeRegion ?? "all" })
  ];

  const [activeData, setActiveData] = useState({
    snow: true,
    temp: true,
    wind: true,
    radiation: true
  });
  const [filterObservationStart, setFilterObservationStart] = useState<boolean>(
    filterObservationStart0
  );

  function sortBy(sortValue: keyof StationData, sortDir: "asc" | "desc") {
    setSortValue(sortValue);
    setSortDir(sortDir);
  }

  const minYear = useMemo(
    () =>
      data.length
        ? Math.min(
            ...data.map(d => +d.observationStart).filter(year => isFinite(year))
          )
        : 2000,
    [data]
  );

  function toggleActiveData(key: keyof typeof activeData) {
    setActiveData({ ...activeData, [key]: !activeData[key] });
  }

  const compareStationData = useCallback(
    function compareStationData(val1: StationData, val2: StationData): number {
      const collator = new Intl.Collator("de");
      const order = sortDir == "asc" ? [-1, 1] : [1, -1];
      const a = val1[sortValue];
      const b = val2[sortValue];

      if (a === b) {
        return 0;
      }
      if (typeof a === "string" && typeof b === "string") {
        return (sortDir == "asc" ? 1 : -1) * collator.compare(a, b);
      }
      if (typeof b === "undefined" || b === false || b === null) {
        return order[1];
      }
      if (typeof a === "undefined" || a === false || a === null) {
        return order[0];
      }
      return a < b ? order[0] : order[1];
    },
    [sortDir, sortValue]
  );

  const sortedFilteredData = useMemo(() => {
    const pattern = searchText ? new RegExp(searchText, "i") : undefined;
    const regions = [...config.regionCodes, ...config.extraRegions];
    const region = regions.includes(activeRegion) ? activeRegion : undefined;
    return data
      .filter(
        row =>
          !pattern ||
          row.name.match(pattern) ||
          row.properties["LWD-Nummer"]?.match(pattern) ||
          row.microRegion.match(pattern) ||
          row.operator.match(pattern)
      )
      .filter(row => !region || row.province == region)
      .filter(
        row =>
          !filterObservationStart ||
          !activeYear ||
          +row.observationStart <= activeYear
      )
      .sort((val1, val2) => compareStationData(val1, val2));
  }, [
    activeRegion,
    activeYear,
    compareStationData,
    data,
    filterObservationStart,
    searchText
  ]);

  const load = useCallback(
    async function load({ dateTime, ogd }: LoadOptions = {}): Promise<
      StationData[]
    > {
      const data = await loadStationData({ dateTime, ogd });
      data.sort((val1, val2) => compareStationData(val1, val2));
      setData(data);
      setDateTime(dateTime);
      return data;
    },
    [compareStationData]
  );

  return {
    activeData,
    activeRegion,
    activeYear,
    compareStationData,
    data,
    dateTime,
    dateTimeMax,
    filterObservationStart,
    load,
    minYear,
    searchText,
    setActiveData,
    setActiveRegion,
    setActiveYear,
    setData,
    setDateTime,
    setFilterObservationStart,
    setSearchText,
    setSortDir,
    setSortValue,
    sortBy,
    sortDir,
    sortedFilteredData,
    sortValue,
    toggleActiveData
  };
}

interface LoadOptions {
  consumer?: (station: StationData[]) => void;
  dateTime?: Temporal.ZonedDateTime;
  ogd?: boolean;
}

export async function loadStationData({
  consumer,
  dateTime,
  ogd
}: LoadOptions = {}): Promise<StationData[]> {
  const all = window.config.apis.stations.map(
    async ({
      smet,
      smetOperators,
      png,
      pngOperators,
      stations: url,
      stationsDateTime,
      stationsArchiveFile,
      stationsArchiveOperators
    }) => {
      if (dateTime instanceof Temporal.ZonedDateTime) {
        const timePrefix = `${dateTime.withTimeZone("UTC").toString().slice(0, "2006-01-02T12".length).replace("T", "_")}-00_`;
        url = window.config.template(stationsDateTime, {
          dateTime: timePrefix
        });
      }

      if (
        import.meta.env.DEV &&
        url.startsWith("https://smet.hydrographie.info/")
      ) {
        url = url.slice("https:/".length);
        smet = smet.slice("https:/".length);
      }

      try {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) throw new Error(response.statusText);
        if (response.status === 404) return [];

        if (
          url ===
          "https://dataset.api.hub.geosphere.at/v1/station/historical/tawes-v1-10min/metadata"
        ) {
          if (ogd) return [];
          const metadata: GeoSphereMetadata = await response.json();
          const stations = metadata.stations.map(station =>
            mapGeoSphere(station, smet)
          );
          consumer?.(stations);
          return stations;
        }

        const json: GeoJSON.FeatureCollection<
          GeoJSON.Point,
          FeatureProperties
        > = await response.json();
        const stations = json.features
          .filter(el => ogd || el.properties.date)
          .filter(el => !ogd || !el.properties.name.startsWith("Beobachter"))
          .map(feature => {
            const operator = feature.properties.operator ?? "";
            feature.properties.$smet = new RegExp(smetOperators).test(operator)
              ? smet
              : "";
            feature.properties.$png = new RegExp(pngOperators).test(operator)
              ? png
              : "";
            feature.properties.$stationsArchiveFile = stationsArchiveFile;

            if (ogd && !new RegExp(stationsArchiveOperators).exec(operator)) {
              return;
            }

            if (!feature.properties.$smet && !feature.properties.$png) {
              return;
            }

            return new StationData(feature);
          })
          .filter(d => !!d);
        consumer?.(stations);
        return stations;
      } catch (e) {
        console.error("Failed fetching station data from " + url, e);
        return [];
      }
    }
  );

  const data = await Promise.all(all);
  return data.flat();
}

interface GeoSphereMetadata {
  title: string;
  parameters: GeoSphereParameter[];
  frequency: string;
  type: string;
  mode: string;
  response_formats: string[];
  start_time: string;
  end_time: string;
  stations: GeoSphereStation[];
  id_type: string;
}

interface GeoSphereParameter {
  name: string;
  long_name: string;
  desc: string;
  unit: string;
}

interface GeoSphereStation {
  type: string;
  id: string;
  group_id: null;
  name: string;
  state: string;
  lat: number;
  lon: number;
  altitude: number;
  valid_from: string;
  valid_to: string;
  has_sunshine: boolean;
  has_global_radiation: boolean;
  is_active: boolean;
}

function mapGeoSphere(station: GeoSphereStation, smet: string): StationData {
  return new StationData({
    type: "Feature",
    id: station.id,
    geometry: {
      type: "Point",
      coordinates: [station.lon, station.lat, station.altitude]
    },
    properties: {
      name: station.name
        .toLocaleLowerCase("de")
        // capitalize "ACHENKIRCH CAMPINGPLATZ"
        .replace(/(^|[-./()\s])\w/g, c => c.toLocaleUpperCase("de")),
      $smet: smet,
      operator: "GeoSphere Austria",
      operatorLink: "https://www.geosphere.at/",
      operatorLicense: "CC BY 4.0",
      operatorLicenseLink:
        "https://creativecommons.org/licenses/by/4.0/legalcode"
    }
  });
}

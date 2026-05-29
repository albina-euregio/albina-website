import { useStore } from "@nanostores/react";
import { currentSeasonYear } from "../util/date-season";
import { useCallback, useEffect, useMemo, useState } from "react";
import { $router, redirectPageQuery } from "../components/router";
import {
  Feature,
  FeatureCollectionSchema
} from "@albina-euregio/linea/listing";
import { fetchJSON } from "../util/fetch";

export class StationData implements Feature {
  readonly type = "Feature" as const;
  id: Feature["id"];
  geometry: Feature["geometry"];
  properties: Feature["properties"];
  $stationsArchiveFile: string | undefined;

  constructor(object: {
    id: Feature["id"];
    geometry: Feature["geometry"];
    properties: Feature["properties"];
  }) {
    this.id = object.id;
    this.geometry = object.geometry;
    this.properties = object.properties;
  }
  get lon() {
    return this.geometry.coordinates[0];
  }
  get lat() {
    return this.geometry.coordinates[1];
  }
  get altitude() {
    return this.geometry.coordinates[2] ?? this.properties.altitude;
  }
  get name() {
    return this.properties.name;
  }
  get operator() {
    return this.properties.operator;
  }
  get startYear() {
    return this.properties.startYear;
  }
  get province() {
    const region = this.properties.microRegionID;
    if (typeof region !== "string") {
      return "";
    }
    const regions = [...config.regionCodes, ...config.extraRegions];
    return regions.find(r => region.startsWith(r)) ?? "";
  }
  get microRegion() {
    const region = this.properties.microRegionID;
    if (typeof region !== "string") {
      return "";
    }
    return region.split(/ /)?.[0];
  }
  get date() {
    return this.properties.date;
  }
  get TA() {
    return this.properties.TA.convertTo("℃");
  }
  get TSS() {
    return this.properties.TSS.convertTo("℃");
  }
  get TD() {
    return this.properties.TD.convertTo("℃");
  }
  get TA_MAX() {
    return this.properties.TA_MAX.convertTo("℃");
  }
  get TA_MIN() {
    return this.properties.TA_MIN.convertTo("℃");
  }
  get HS() {
    return this.properties.HS.convertTo("cm");
  }
  get HSD_6() {
    return this.properties.HSD_6.convertTo("cm");
  }
  get HSD_24() {
    return this.properties.HSD_24.convertTo("cm");
  }
  get HSD_48() {
    return this.properties.HSD_48.convertTo("cm");
  }
  get HSD_72() {
    return this.properties.HSD_72.convertTo("cm");
  }
  get PSUM_6() {
    return this.properties.PSUM_6.convertTo("mm");
  }
  get PSUM_24() {
    return this.properties.PSUM_24.convertTo("mm");
  }
  get PSUM_48() {
    return this.properties.PSUM_48.convertTo("mm");
  }
  get PSUM_72() {
    return this.properties.PSUM_72.convertTo("mm");
  }
  get RH() {
    return this.properties.RH.convertTo("%");
  }
  get DW() {
    return this.properties.DW.convertTo("°");
  }
  get aspectDW() {
    if (typeof this.DW !== "number") {
      return false;
    }
    const index = Math.round(((this.DW + 360 - 22.5) % 360) / 45);
    const classes = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    return classes[index];
  }
  get VW() {
    return this.properties.VW.convertTo("km/h");
  }
  get VW_MAX() {
    return this.properties.VW_MAX.convertTo("km/h");
  }
  get ISWR() {
    return this.properties.ISWR.convertTo("W/m²");
  }
  get RSWR() {
    return this.properties.RSWR.convertTo("W/m²");
  }

  get parametersForDialog() {
    const types = [
      { type: "HS", digits: 0, unit: "cm" },
      { type: "TA", digits: 1, unit: "℃" },
      { type: "RH", digits: 0, unit: "%" },
      { type: "VW", digits: 0, unit: "km/h" },
      { type: "VW_MAX", digits: 0, unit: "km/h" }
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
  activeYear0: number | "" = currentSeasonYear(),
  filterStartYear0 = false
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

  const activeRegionFromRouter =
    router?.search.activeRegion || router?.search.province || "all";
  const [activeRegion, setActiveRegionState] = useState(activeRegionFromRouter);
  useEffect(() => {
    setActiveRegionState(activeRegionFromRouter);
  }, [activeRegionFromRouter]);
  const setActiveRegion = (
    activeRegion: string | "" | "all" | null | undefined
  ) => {
    const nextActiveRegion = activeRegion ?? "all";
    setActiveRegionState(nextActiveRegion);
    // Keep deep-link query in sync with the UI state.
    redirectPageQuery({ activeRegion: nextActiveRegion });
  };

  const [activeData, setActiveData] = useState({
    snow: true,
    temp: true,
    wind: true,
    radiation: true
  });
  const [filterStartYear, setfilterStartYear] =
    useState<boolean>(filterStartYear0);
  const [elevationRange, setElevationRange] = useState<[number, number]>([
    0, 4000
  ]);

  function sortBy(sortValue: keyof StationData, sortDir: "asc" | "desc") {
    setSortValue(sortValue);
    setSortDir(sortDir);
  }

  const minYear = useMemo(
    () =>
      data.length
        ? Math.min(
            ...data.map(d => +d.startYear).filter(year => isFinite(year))
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
          row.properties.shortName?.match(pattern) ||
          row.microRegion.match(pattern) ||
          row.properties.operator?.match(pattern)
      )
      .filter(row => !region || row.province == region)
      .filter(
        row => !filterStartYear || !activeYear || +row.startYear <= activeYear
      )
      .filter(
        row =>
          typeof row.altitude !== "number" ||
          (row.altitude >= elevationRange[0] &&
            row.altitude <= elevationRange[1])
      )
      .sort((val1, val2) => compareStationData(val1, val2));
  }, [
    activeRegion,
    activeYear,
    compareStationData,
    data,
    elevationRange,
    filterStartYear,
    searchText
  ]);

  const loadStationData = useCallback(
    async function loadStationData({ dateTime }: LoadOptions = {}): Promise<
      StationData[]
    > {
      const data = await _loadStationData({ dateTime });
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
    elevationRange,
    filterStartYear,
    loadStationData,
    minYear,
    searchText,
    setActiveData,
    setActiveRegion,
    setActiveYear,
    setData,
    setDateTime,
    setElevationRange,
    setfilterStartYear,
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
}

export async function _loadStationData({
  consumer,
  dateTime
}: LoadOptions = {}): Promise<StationData[]> {
  let url = config.apis.linea.stations;

  if (dateTime instanceof Temporal.ZonedDateTime) {
    url = window.config.template(config.apis.linea.stationsDateTime, {
      date: dateTime
        .withTimeZone("UTC")
        .toString()
        .slice(0, "2006-01-02".length),
      dateTime: dateTime
        .withTimeZone("UTC")
        .toString()
        .slice(0, "2006-01-02T12:00".length)
        .replace("T", "_")
        .replace(":", "-")
    });
  }

  const json = await fetchJSON(url);
  const collection = await FeatureCollectionSchema.parseAsync(json);

  const all = window.config.apis.stations.map(
    ({
      dataProviderID,
      smetOperators,
      licenseCCBY,
      png,
      pngOperators,
      stationsArchiveFile,
      stationsArchiveOperators
    }) => {
      try {
        const stations = collection.features
          .filter(f => f.properties.dataProviderID === dataProviderID)
          .map(feature => {
            const data = new StationData(feature);
            const operator = feature.properties.operator ?? "";
            if (smetOperators && !new RegExp(smetOperators).test(operator)) {
              data.properties.dataURLs = [];
            }
            if (new RegExp(pngOperators).test(operator)) {
              data.properties.plot = png.replace(
                "{name}",
                data.properties.plot ?? ""
              );
            } else {
              data.properties.plot = undefined;
            }
            if (new RegExp(licenseCCBY ?? "---").test(operator)) {
              data.properties.operatorLicense ??= "CC BY 4.0";
            }

            if (new RegExp(stationsArchiveOperators).exec(operator)) {
              data.$stationsArchiveFile = stationsArchiveFile;
            }
            data.properties.dataURLs = data.properties.dataURLs.map(url =>
              url
                .replace(
                  "https://measurement-api.slf.ch/public/api/imis/",
                  "https://api.avalanche.report/measurement-api.slf.ch/public/api/imis/"
                )
                .replace(
                  "https://meteo.arpa.veneto.it/meteo/dati_meteo/",
                  "https://api.avalanche.report/meteo.arpa.veneto.it/meteo/dati_meteo/"
                )
            );

            return data;
          })
          .filter(d => d.properties.dataURLs?.length || d.properties.plot);
        consumer?.(stations);
        return stations;
      } catch (e) {
        console.error("Failed fetching station data from " + dataProviderID, e);
        return [];
      }
    }
  );

  const data = await Promise.all(all);
  return data.flat();
}

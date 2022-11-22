import type {
  Bulletin,
  CustomData,
  ValidTimePeriod
} from "./CaamlBulletin2022";

export * from "./CaamlBulletin2022";
export * from "./MicroRegionElevationProperties";
export * from "./MicroRegionProperties";

export function hasDaytimeDependency(b: Bulletin): boolean {
  return b.dangerRatings?.some(({ validTimePeriod }) => {
    return validTimePeriod === "earlier" || validTimePeriod === "later";
  });
}

export function isAmPm(ampm: "am" | "pm" | "", t: ValidTimePeriod): boolean {
  return (
    !ampm ||
    (ampm == "am" && (!t || t === "all_day" || t === "earlier")) ||
    (ampm == "pm" && (!t || t === "all_day" || t === "later"))
  );
}

export interface DangerPattern {
  type: "dangerPattern";
  id:
    | "DP1"
    | "DP2"
    | "DP3"
    | "DP4"
    | "DP5"
    | "DP6"
    | "DP7"
    | "DP8"
    | "DP9"
    | "DP10";
  name: string;
}

export function isDangerPattern(data: CustomData): data is DangerPattern {
  return (data as DangerPattern).type === "dangerPattern";
}

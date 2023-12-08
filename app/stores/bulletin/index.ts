import type { Bulletin, CustomData, ValidTimePeriod } from "./CAAMLv6";

export * from "./CAAMLv6";
export * from "./MicroRegionElevationProperties";
export * from "./MicroRegionProperties";
export * from "./RegionOutlineProperties";

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

export type DangerPattern =
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

interface AlbinaCustomData extends CustomData {
  ALBINA: {
    mainDate: string;
  };
  LWD_Tyrol: {
    dangerPatterns: DangerPattern[];
  };
}

export function getDangerPatterns(data: CustomData): DangerPattern[] {
  return (data as AlbinaCustomData)?.LWD_Tyrol?.dangerPatterns || [];
}

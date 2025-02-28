import { Bulletin, CustomData, ValidTimePeriod } from "./CAAMLv6";

export * from "./CAAMLv6";
export * from "./bulletinCollection";

export function hasDaytimeDependency(b: Bulletin): boolean {
  return b.dangerRatings?.some(({ validTimePeriod }) => {
    return validTimePeriod === "earlier" || validTimePeriod === "later";
  });
}

export function matchesValidTimePeriod(
  p1: ValidTimePeriod | undefined,
  p2: ValidTimePeriod | undefined
): boolean {
  return (
    !p1 ||
    !p2 ||
    p1 === "all_day" ||
    p2 === "all_day" ||
    (p1 === "earlier" && p2 === "earlier") ||
    (p1 === "later" && p2 === "later")
  );
}

export type ColonAmPm = "" | ":am" | ":pm";

export const toAmPm: Record<ValidTimePeriod, ColonAmPm> = Object.freeze({
  all_day: "",
  earlier: ":am",
  later: ":pm"
});

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

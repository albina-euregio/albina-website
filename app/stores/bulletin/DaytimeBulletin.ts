import { Bulletin, DangerRatingValue } from "./CaamlBulletin";

export interface DaytimeBulletin {
  id: string;
  forenoon: Bulletin;
  afternoon?: Bulletin;
  hasDaytimeDependency: boolean;
  maxWarnlevel: DangerRatingValue;
}

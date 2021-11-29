declare namespace Albina {
  export interface DaytimeBulletin {
    id: string;
    forenoon: Caaml.Bulletin;
    afternoon?: Caaml.Bulletin;
    hasDaytimeDependency: boolean;
    maxWarnlevel: Caaml.DangerRatingValue;
  }
}

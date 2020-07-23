namespace Bulletin {
  export interface Bulletin {
    id: string;
    publicationDate: Date;
    validity: Validity;
    regions: string[];
    treeline: boolean;
    elevation?: number;
    hasElevationDependency: boolean;
    maxWarnlevel: MaxWarnlevel;
    forenoon: DaytimeDescription;
    afternoon?: DaytimeDescription;
    hasDaytimeDependency: boolean;
    dangerPattern1?: DangerPattern;
    dangerPattern2?: DangerPattern;
    highlights?: LocalizedText[];
    avActivityHighlights: LocalizedText[];
    avActivityComment: LocalizedText[];
    snowpackStructureComment: LocalizedText[];
    tendencyComment?: LocalizedText[];
  }

  export interface DaytimeDescription {
    id: string;
    dangerRatingBelow: DangerRating;
    dangerRatingAbove: DangerRating;
    avalancheSituation1: AvalancheSituation;
    avalancheSituation2?: AvalancheSituation;
  }

  export interface AvalancheSituation {
    elevationLow?: number;
    elevationHigh?: number;
    treelineLow?: boolean;
    treelineHigh?: boolean;
    avalancheSituation: AvalancheSituationEnum;
    aspects?: Aspect[];
  }

  export enum Aspect {
    "e",
    "n",
    "ne",
    "nw",
    "s",
    "se",
    "sw",
    "w"
  }

  export enum AvalancheSituationEnum {
    "new_snow",
    "wind_drifted_snow",
    "weak_persistent_layer",
    "wet_snow",
    "gliding_snow",
    "favourable_situation"
  }

  export enum DangerRating {
    "low",
    "moderate",
    "considerable",
    "high",
    "very_high"
  }

  export interface LocalizedText {
    text: string;
    languageCode: string;
  }

  export enum DangerPattern {
    "dp1",
    "dp2",
    "dp3",
    "dp4",
    "dp5",
    "dp6",
    "dp7",
    "dp8",
    "dp9",
    "dp10"
  }

  export interface MaxWarnlevel {
    number: any;
    id: string;
  }

  export interface Validity {
    from: Date;
    until: Date;
  }
}

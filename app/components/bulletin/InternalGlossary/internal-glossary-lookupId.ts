import { en } from "zod/locales";
import {
  type ExpectedSnowpackStability,
  ExpectedSnowpackStabilitySchema,
  type ExpectedAvalancheFrequency,
  type DangerPattern,
  type AvalancheProblemType,
  ExpectedAvalancheFrequencySchema,
  AvalancheProblemTypeSchema
} from "../../../stores/bulletin";

export enum internalGlossaryEnum {
  avalancheStability,
  avalancheSize,
  avalancheFrequency,
  dangerLevel,
  dangerPattern,
  problemType
}

//#region glossary content identifiers
 enum glossaryAvalancheSizeId {
  SMALL = "avalanche-size-small",
  MEDIUM = "avalanche-size-medium",
  LARGE = "avalanche-size-large",
  VERYLARGE = "avalanche-size-very-large",
  EXTREMELYLARGE = "avalanche-size-extremely-large"
}

enum glossaryDangerPatternId {
  DangerPattern1 = "danger-pattern-1",
  DangerPattern2 = "danger-pattern-2",
  DangerPattern3 = "danger-pattern-3",
  DangerPattern4 = "danger-pattern-4",
  DangerPattern5 = "danger-pattern-5",
  DangerPattern6 = "danger-pattern-6",
  DangerPattern7 = "danger-pattern-7",
  DangerPattern8 = "danger-pattern-8",
  DangerPattern9 = "danger-pattern-9",
  DangerPattern10 = "danger-pattern-10"
}

enum glossaryDangerLevelId {
  Low = "danger-scale-low",
  Moderate = "danger-scale-moderate",
  Considerable = "danger-scale-considerable",
  High = "danger-scale-high",
  VeryHigh = "danger-scale-very-high"
}

enum glossarySnowpackStabilityId {
  Fair = "snowpack-stability-fair",
  Good = "snowpack-stability-good",
  Poor = "snowpack-stability-poor",
  VeryPoor = "snowpack-stability-very-poor"
}

enum glossaryAvalancheFrequencyId {
  Few = "avalanche-frequency-few",
  Many = "avalanche-frequency-many",
  None = "avalanche-frequency-none",
  Some = "avalanche-frequency-some"
}

enum glossaryProblemTypeId {
  WindSlab = "problem-wind-slab",
  NewSnow = "problem-new-snow",
  PersistentWeakLayers = "problem-persistent-weak-layer",
  WetSnow = "problem-wet-snow",
  GlidingSnow = "problem-glide",
  Cornices = "problem-cornices"
}
//#endregion

//#region mapping cammlv6 enum values to glossary content identifiers
const snowpackStabilityContentIdMap: Record<
  (typeof ExpectedSnowpackStabilitySchema)["options"][number],
  string
> = {
  fair: glossarySnowpackStabilityId.Fair,
  good: glossarySnowpackStabilityId.Good,
  poor: glossarySnowpackStabilityId.Poor,
  very_poor: glossarySnowpackStabilityId.VeryPoor
};

const avalancheFrequencyContentIdMap: Record<
  (typeof ExpectedAvalancheFrequencySchema)["options"][number],
  string
> = {
  few: glossaryAvalancheFrequencyId.Few,
  many: glossaryAvalancheFrequencyId.Many,
  none: glossaryAvalancheFrequencyId.None,
  some: glossaryAvalancheFrequencyId.Some
};

const avalancheProblemTypeContentIdMap: Record<
  (typeof AvalancheProblemTypeSchema)["options"][number],
  string
  > = {
  wind_slab: glossaryProblemTypeId.WindSlab,
  new_snow: glossaryProblemTypeId.NewSnow,
  persistent_weak_layers: glossaryProblemTypeId.PersistentWeakLayers,
  wet_snow: glossaryProblemTypeId.WetSnow,
  gliding_snow: glossaryProblemTypeId.GlidingSnow,
  cornices: glossaryProblemTypeId.Cornices,
  favourable_situation: "",
  no_distinct_avalanche_problem: ""
};
//#endregion

export function getContentIdentifier(
  enumType: internalGlossaryEnum,
  value: string
): string {
  switch (enumType) {
    case internalGlossaryEnum.avalancheStability:
      return avalancheStabilityToContentId(value as ExpectedSnowpackStability);
    case internalGlossaryEnum.avalancheSize:
      return avalancheSizeToContentId(value);
    case internalGlossaryEnum.avalancheFrequency:
      return avalancheFrequencyToContentId(value as ExpectedAvalancheFrequency);
    case internalGlossaryEnum.dangerLevel:
      return dangerLevelToContentId(value);
    case internalGlossaryEnum.dangerPattern:
      return dangerPatternToContentId(value);
      case internalGlossaryEnum.problemType:
      return problemTypeToContentId(value as AvalancheProblemType);
    default:
      return "";
  }
}

function avalancheStabilityToContentId(
  value: (typeof ExpectedSnowpackStabilitySchema)["options"][number]
): string {
  return snowpackStabilityContentIdMap[value] ?? "";
}



function avalancheFrequencyToContentId(
  value: (typeof ExpectedAvalancheFrequencySchema)["options"][number]
): string {
  return avalancheFrequencyContentIdMap[value] ?? "";
}


function dangerLevelToContentId<T extends string>(value: T): string {
  var level = parseInt(value);
  switch (level) {
    case 1:
      return glossaryDangerLevelId.Low;
    case 2:
      return glossaryDangerLevelId.Moderate;
    case 3:
      return glossaryDangerLevelId.Considerable;
    case 4:
      return glossaryDangerLevelId.High;
    case 5:
      return glossaryDangerLevelId.VeryHigh;
    default:
      return "";
  }
}

function avalancheSizeToContentId<T extends string>(value: T): string {
  var size = parseInt(value);
  switch (size) {
    case 1:
      return glossaryAvalancheSizeId.SMALL;
    case 2:
      return glossaryAvalancheSizeId.MEDIUM;
    case 3:
      return glossaryAvalancheSizeId.LARGE;
    case 4:
      return glossaryAvalancheSizeId.VERYLARGE;
    case 5:
      return glossaryAvalancheSizeId.EXTREMELYLARGE;
    default:
      return "";
  }
}

function dangerPatternToContentId<T extends string>(value: T): string {
  switch (value as DangerPattern) {
    case "DP1":
      return glossaryDangerPatternId.DangerPattern1;
    case "DP2":
      return glossaryDangerPatternId.DangerPattern2;
    case "DP3":
      return glossaryDangerPatternId.DangerPattern3;
    case "DP4":
      return glossaryDangerPatternId.DangerPattern4;
    case "DP5":
      return glossaryDangerPatternId.DangerPattern5;
    case "DP6":
      return glossaryDangerPatternId.DangerPattern6;
    case "DP7":
      return glossaryDangerPatternId.DangerPattern7;
    case "DP8":
      return glossaryDangerPatternId.DangerPattern8 ;
    case "DP9":
      return glossaryDangerPatternId.DangerPattern9;
    case "DP10":
      return glossaryDangerPatternId.DangerPattern10;
    default:
      return "";
  } 
}

function problemTypeToContentId(
  value: (typeof AvalancheProblemTypeSchema)["options"][number]
): string {
  return avalancheProblemTypeContentIdMap[value] ?? "";
}



import {
  type ExpectedSnowpackStability,
  type ExpectedAvalancheFrequency,
  type DangerPattern,
  type AvalancheProblemType
} from "../../../stores/bulletin";

export enum internalGlossaryEnum {
  avalancheStability,
  avalancheSize,
  avalancheFrequency,
  dangerLevel,
  dangerPattern,
  problemType
}

 enum avalancheSizeEnum {
  SMALL = "avalanche-size-small",
  MEDIUM = "avalanche-size-medium",
  LARGE = "avalanche-size-large",
  VERYLARGE = "avalanche-size-very-large",
  EXTREMELYLARGE = "avalanche-size-extremely-large"
}

enum dangerPatternEnum {
  DangerPatter1 = "danger-pattern-1",
  DangerPatter2 = "danger-pattern-2",
  DangerPatter3 = "danger-pattern-3",
  DangerPatter4 = "danger-pattern-4",
  DangerPatter5 = "danger-pattern-5",
  DangerPatter6 = "danger-pattern-6",
  DangerPatter7 = "danger-pattern-7",
  DangerPatter8 = "danger-pattern-8",
  DangerPatter9 = "danger-pattern-9",
  DangerPatter10 = "danger-pattern-10"
}

export function getContentIdentifier(
  enumType: internalGlossaryEnum,
  value: string
): string {
  switch (enumType) {
    case internalGlossaryEnum.avalancheStability:
      return avalancheStabilityToContentId(value);
    case internalGlossaryEnum.avalancheSize:
      return avalancheSizeToContentId(value);
    case internalGlossaryEnum.avalancheFrequency:
      return avalancheFrequencyToContentId(value);
    case internalGlossaryEnum.dangerLevel:
      return dangerLevelToContentId(value);
    case internalGlossaryEnum.dangerPattern:
      return dangerPatternToContentId(value);
      case internalGlossaryEnum.problemType:
      return problemTypeToContentId(value);
    default:
      return "";
  }
}

function avalancheStabilityToContentId<T extends string>(value: T): string {
  switch (value as ExpectedSnowpackStability) {
    case "very_poor":
      return "snowpack-stability-very-poor";
    case "poor":
      return "snowpack-stability-poor";
    case "fair":
      return "snowpack-stability-fair";
    case "good":
      return "snowpack-stability-good";
    default:
      return "";
  }
}

function avalancheFrequencyToContentId<T extends string>(value: T): string {
  switch (value as ExpectedAvalancheFrequency) {
    case "few":
      return "avalanche-frequency-few";
      case "many":
      return "avalanche-frequency-many";
      case "none":
      return "avalanche-frequency-none";
      case "some":
      return "avalanche-frequency-some";
    default:
      return "";
  }
}

function dangerLevelToContentId<T extends string>(value: T): string {
  var level = parseInt(value);
  switch (level) {
    case 1:
      return "danger-scale-low";
    case 2:
      return "danger-scale-moderate";
    case 3:
      return "danger-scale-considerable";
    case 4:
      return "danger-scale-high";
    case 5:
      return "danger-scale-very-high";
    default:
      return "";
  }
}

function avalancheSizeToContentId<T extends string>(value: T): string {
  var size = parseInt(value);
  switch (size) {
    case 1:
      return avalancheSizeEnum.SMALL;
    case 2:
      return avalancheSizeEnum.MEDIUM;
    case 3:
      return avalancheSizeEnum.LARGE;
    case 4:
      return avalancheSizeEnum.VERYLARGE;
    case 5:
      return avalancheSizeEnum.EXTREMELYLARGE;
    default:
      return "";
  }
}

function dangerPatternToContentId<T extends string>(value: T): string {
  console.log("Danger Pattern Value:", value);
  switch (value as DangerPattern) {
    case "DP1":
      return dangerPatternEnum.DangerPatter1;
    case "DP2":
      return dangerPatternEnum.DangerPatter2;
    case "DP3":
      return dangerPatternEnum.DangerPatter3;
    case "DP4":
      return dangerPatternEnum.DangerPatter4;
    case "DP5":
      return dangerPatternEnum.DangerPatter5;
    case "DP6":
      return dangerPatternEnum.DangerPatter6;
    case "DP7":
      return dangerPatternEnum.DangerPatter7;
    case "DP8":
      return dangerPatternEnum.DangerPatter8;
    case "DP9":
      return dangerPatternEnum.DangerPatter9;
    case "DP10":
      return dangerPatternEnum.DangerPatter10;
    default:
      return "";
  } 
}

function problemTypeToContentId<T extends string>(value: T): string {
  switch (value as AvalancheProblemType) {
    case "wind_slab":
      return "problem-wind-slab";
    case "new_snow":
      return "problem-new-snow";
    case "persistent_weak_layers":
      return "problem-persistent-weak-layer";
    case "wet_snow":
      return "problem-wet-snow";
    case "gliding_snow":
      return "problem-glide";
    case "cornices":
      return "problem-cornices";
      default:
      return "";
  }
}

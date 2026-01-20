import {
  type AvalancheProblem,
  type ExpectedSnowpackStability,
  ExpectedSnowpackStabilitySchema
} from "../../../stores/bulletin";

export enum internalGlossaryEnum {
  avalancheStability,
  avalancheSize,
  dangerLevel
}

export enum avalancheSizeEnum {
  SMALL = "avalanche-size-small",
  MEDIUM = "avalanche-size-medium",
  LARGE = "avalanche-size-large",
  VERYLARGE = "avalanche-size-very-large",
  EXTREMELYLARGE = "avalanche-size-extremely-large"
}

export function getContentIdentifier(
  enumType: internalGlossaryEnum,
  value: string
): string {
  switch (enumType) {
    case internalGlossaryEnum.avalancheStability:
      return avalancheStabilityToContentId(value);
    case internalGlossaryEnum.avalancheSize:
      return value;
    case internalGlossaryEnum.dangerLevel:
      return dangerLevelToContentId(value);
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

import * as Enums from "../enums/enums";

export class MatrixInformationObsoleteModel {

  public artificialDangerRating: Enums.DangerRating;
  public artificialAvalancheSize: Enums.AvalancheSize;
  public artificialAvalancheReleaseProbability: Enums.ArtificialAvalancheReleaseProbability;
  public artificialHazardSiteDistribution: Enums.HazardSiteDistribution;

  public naturalDangerRating: Enums.DangerRating;
  public naturalAvalancheReleaseProbability: Enums.NaturalAvalancheReleaseProbability;
  public naturalHazardSiteDistribution: Enums.HazardSiteDistribution;

  static createFromJson(json) {
    const matrixInformation = new MatrixInformationObsoleteModel();

    matrixInformation.artificialDangerRating = json.artificialDangerRating;
    matrixInformation.artificialAvalancheSize = json.artificialAvalancheSize;
    matrixInformation.artificialAvalancheReleaseProbability = json.artificialAvalancheReleaseProbability;
    matrixInformation.artificialHazardSiteDistribution = json.artificialHazardSiteDistribution;
    matrixInformation.naturalDangerRating = json.naturalDangerRating;
    matrixInformation.naturalAvalancheReleaseProbability = json.naturalAvalancheReleaseProbability;
    matrixInformation.naturalHazardSiteDistribution = json.naturalHazardSiteDistribution;

    return matrixInformation;
  }

  constructor(matrixInformation?: MatrixInformationObsoleteModel) {
    if (!matrixInformation) {
      this.setArtificialDangerRating("missing");
      this.artificialAvalancheSize = undefined;
      this.artificialAvalancheReleaseProbability = undefined;
      this.artificialHazardSiteDistribution = undefined;
      this.setNaturalDangerRating("missing");
      this.naturalAvalancheReleaseProbability = undefined;
      this.naturalHazardSiteDistribution = undefined;
    } else {
      this.setArtificialDangerRating(matrixInformation.getArtificialDangerRating());
      this.artificialAvalancheSize = matrixInformation.getArtificialAvalancheSize();
      this.artificialAvalancheReleaseProbability = matrixInformation.getArtificialAvalancheReleaseProbability();
      this.artificialHazardSiteDistribution = matrixInformation.getArtificialHazardSiteDistribution();
      this.setNaturalDangerRating(matrixInformation.getNaturalDangerRating());
      this.naturalAvalancheReleaseProbability = matrixInformation.getNaturalAvalancheReleaseProbability();
      this.naturalHazardSiteDistribution = matrixInformation.getNaturalHazardSiteDistribution();
    }
  }

  getArtificialDangerRating(): Enums.DangerRating {
    return this.artificialDangerRating;
  }

  setArtificialDangerRating(artificialDangerRating) {
    this.artificialDangerRating = artificialDangerRating;
  }

  getArtificialAvalancheSize(): Enums.AvalancheSize {
    return this.artificialAvalancheSize;
  }

  setArtificialAvalancheSize(artificialAvalancheSize) {
    this.artificialAvalancheSize = artificialAvalancheSize;
  }

  getArtificialAvalancheReleaseProbability(): Enums.ArtificialAvalancheReleaseProbability {
    return this.artificialAvalancheReleaseProbability;
  }

  setArtificialAvalancheReleaseProbability(artificialAvalancheReleaseProbability) {
    this.artificialAvalancheReleaseProbability = artificialAvalancheReleaseProbability;
  }

  getArtificialHazardSiteDistribution(): Enums.HazardSiteDistribution {
    return this.artificialHazardSiteDistribution;
  }

  setArtificialHazardSiteDistribution(artificialHazardSiteDistribution) {
    this.artificialHazardSiteDistribution = artificialHazardSiteDistribution;
  }

  getNaturalDangerRating(): Enums.DangerRating {
    return this.naturalDangerRating;
  }

  setNaturalDangerRating(naturalDangerRating) {
    this.naturalDangerRating = naturalDangerRating;
  }

  getNaturalAvalancheReleaseProbability(): Enums.NaturalAvalancheReleaseProbability {
    return this.naturalAvalancheReleaseProbability;
  }

  setNaturalAvalancheReleaseProbability(naturalAvalancheReleaseProbability) {
    this.naturalAvalancheReleaseProbability = naturalAvalancheReleaseProbability;
  }

  getNaturalHazardSiteDistribution(): Enums.HazardSiteDistribution {
    return this.naturalHazardSiteDistribution;
  }

  setNaturalHazardSiteDistribution(naturalHazardSiteDistribution) {
    this.naturalHazardSiteDistribution = naturalHazardSiteDistribution;
  }

  toJson() {
    const json = Object();

    if (this.artificialDangerRating && this.artificialDangerRating !== undefined && this.artificialDangerRating !== Enums.DangerRating.missing) {
      json["artificialDangerRating"] = this.artificialDangerRating;
    }
    if (this.artificialAvalancheSize && this.artificialAvalancheSize !== undefined) {
      json["artificialAvalancheSize"] = this.artificialAvalancheSize;
    }
    if (this.artificialAvalancheReleaseProbability && this.artificialAvalancheReleaseProbability !== undefined) {
      json["artificialAvalancheReleaseProbability"] = this.artificialAvalancheReleaseProbability;
    }
    if (this.artificialHazardSiteDistribution && this.artificialHazardSiteDistribution !== undefined) {
      json["artificialHazardSiteDistribution"] = this.artificialHazardSiteDistribution;
    }
    if (this.naturalDangerRating && this.naturalDangerRating !== undefined && this.naturalDangerRating !== Enums.DangerRating.missing) {
      json["naturalDangerRating"] = this.naturalDangerRating;
    }
    if (this.naturalAvalancheReleaseProbability && this.naturalAvalancheReleaseProbability !== undefined) {
      json["naturalAvalancheReleaseProbability"] = this.naturalAvalancheReleaseProbability;
    }
    if (this.naturalHazardSiteDistribution && this.naturalHazardSiteDistribution !== undefined) {
      json["naturalHazardSiteDistribution"] = this.naturalHazardSiteDistribution;
    }

    return json;
  }
}

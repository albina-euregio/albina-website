import * as Enums from "../enums/enums";

export class MatrixInformationModel {

  public dangerRating: Enums.DangerRating;
  public avalancheSize: Enums.AvalancheSize;
  public snowpackStability: Enums.SnowpackStability;
  public frequency: Enums.Frequency;

  static createFromJson(json) {
    const matrixInformation = new MatrixInformationModel();
    matrixInformation.dangerRating = json.dangerRating;
    matrixInformation.avalancheSize = json.avalancheSize;
    matrixInformation.snowpackStability = json.snowpackStability;
    matrixInformation.frequency = json.frequency;

    return matrixInformation;
  }

  constructor(matrixInformation?: MatrixInformationModel) {
    if (!matrixInformation) {
      this.setDangerRating("missing");
      this.avalancheSize = undefined;
      this.snowpackStability = undefined;
      this.frequency = undefined;
    } else {
      this.setDangerRating(matrixInformation.getDangerRating());
      this.avalancheSize = matrixInformation.getAvalancheSize();
      this.snowpackStability = matrixInformation.getSnowpackStability();
      this.frequency = matrixInformation.getFrequency();
    }
  }

  getDangerRating(): Enums.DangerRating {
    return this.dangerRating;
  }

  setDangerRating(dangerRating) {
    this.dangerRating = dangerRating;
  }

  getAvalancheSize(): Enums.AvalancheSize {
    return this.avalancheSize;
  }

  setAvalancheSize(avalancheSize) {
    this.avalancheSize = avalancheSize;
  }

  getSnowpackStability(): Enums.SnowpackStability {
    return this.snowpackStability;
  }

  setSnowpackStability(snowpackStability) {
    this.snowpackStability = snowpackStability;
  }

  getFrequency(): Enums.Frequency {
    return this.frequency;
  }

  setFrequency(frequency) {
    this.frequency = frequency;
  }

  toJson() {
    const json = Object();

    if (this.dangerRating && this.dangerRating !== undefined && this.dangerRating !== Enums.DangerRating.missing) {
      json["dangerRating"] = this.dangerRating;
    }
    if (this.avalancheSize && this.avalancheSize !== undefined) {
      json["avalancheSize"] = this.avalancheSize;
    }
    if (this.snowpackStability && this.snowpackStability !== undefined) {
      json["snowpackStability"] = this.snowpackStability;
    }
    if (this.frequency && this.frequency !== undefined) {
      json["frequency"] = this.frequency;
    }
    return json;
  }
}

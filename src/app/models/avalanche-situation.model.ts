import * as Enums from "../enums/enums";

export class AvalancheSituationModel {
  public avalancheSituation: Enums.AvalancheSituation;
  public aspects: Enums.Aspect[];
  public elevationHigh: number;
  public treelineHigh: boolean;
  public elevationLow: number;
  public treelineLow: boolean;

  static createFromJson(json) {
    const avalancheSituation = new AvalancheSituationModel();

    avalancheSituation.avalancheSituation = json.avalancheSituation;
    const jsonAspects = json.aspects;
    const aspects = new Array<Enums.Aspect>();
    for (const i in jsonAspects) {
      if (jsonAspects[i] !== null) {
        aspects.push(jsonAspects[i].toUpperCase());
      }
    }
    avalancheSituation.setAspects(aspects);
    avalancheSituation.elevationHigh = json.elevationHigh;
    avalancheSituation.treelineHigh = json.treelineHigh;
    avalancheSituation.elevationLow = json.elevationLow;
    avalancheSituation.treelineLow = json.treelineLow;

    return avalancheSituation;
  }

  constructor(avalancheSituation?: AvalancheSituationModel) {
    this.aspects = new Array<Enums.Aspect>();

    if (!avalancheSituation) {
      this.avalancheSituation = undefined;
      this.treelineHigh = false;
      this.treelineLow = false;
    } else {
      this.avalancheSituation = avalancheSituation.getAvalancheSituation();
      for (const aspect of avalancheSituation.aspects) {
        this.addAspect(aspect);
      }
      this.elevationHigh = avalancheSituation.getElevationHigh();
      this.treelineHigh = avalancheSituation.getTreelineHigh();
      this.elevationLow = avalancheSituation.getElevationLow();
      this.treelineLow = avalancheSituation.getTreelineLow();
    }
  }

  getAvalancheSituation() {
    return this.avalancheSituation;
  }

  setAvalancheSituation(avalancheSituation) {
    this.avalancheSituation = avalancheSituation;
  }

  getAspects() {
    return this.aspects;
  }

  setAspects(aspects) {
    this.aspects = aspects;
  }

  addAspect(aspect) {
    if (this.aspects.indexOf(aspect) === -1) {
      this.aspects.push(aspect);
    }
  }

  removeAspect(aspect) {
    const index = this.aspects.indexOf(aspect);
    if (index > -1) {
      this.aspects.splice(index, 1);
    }
  }

  containsAspect(aspect) {
    if (this.aspects.includes(aspect)) {
      return true;
    } else {
      return false;
    }
  }

  getElevationHigh() {
    return this.elevationHigh;
  }

  setElevationHigh(elevationHigh: number) {
    this.elevationHigh = elevationHigh;
  }

  getTreelineHigh() {
    return this.treelineHigh;
  }

  setTreelineHigh(treeline: boolean) {
    this.treelineHigh = treeline;
  }

  getElevationLow() {
    return this.elevationLow;
  }

  setElevationLow(elevationLow: number) {
    this.elevationLow = elevationLow;
  }

  getTreelineLow() {
    return this.treelineLow;
  }

  setTreelineLow(treeline: boolean) {
    this.treelineLow = treeline;
  }

  toJson() {
    const json = Object();

    if (this.avalancheSituation && this.avalancheSituation !== undefined) {
      json["avalancheSituation"] = this.avalancheSituation;
    }
    if (this.aspects && this.aspects.length > 0) {
      const aspects = [];
      for (let i = 0; i <= this.aspects.length - 1; i++) {
        aspects.push(this.aspects[i]);
      }
      json["aspects"] = aspects;
    }
    if (this.treelineHigh) {
      json["treelineHigh"] = this.treelineHigh;
    } else {
      if (this.elevationHigh && this.elevationHigh !== undefined) {
        json["elevationHigh"] = this.elevationHigh;
      }
    }
    if (this.treelineLow) {
      json["treelineLow"] = this.treelineLow;
    } else {
      if (this.elevationLow && this.elevationLow !== undefined) {
        json["elevationLow"] = this.elevationLow;
      }
    }

    return json;
  }
}

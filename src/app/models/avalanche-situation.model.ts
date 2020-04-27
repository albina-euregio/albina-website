import * as Enums from "../enums/enums";
import { MatrixInformationModel } from "./matrix-information.model";
import { TextModel } from "./text.model";

export class AvalancheSituationModel {
  public avalancheSituation: Enums.AvalancheSituation;
  public aspects: Enums.Aspect[];
  public elevationHigh: number;
  public treelineHigh: boolean;
  public elevationLow: number;
  public treelineLow: boolean;
  public matrixInformation: MatrixInformationModel;
  public terrainFeatureTextcat: string;
  public terrainFeature: TextModel[];

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

    if (json.matrixInformation) {
      avalancheSituation.matrixInformation = MatrixInformationModel.createFromJson(json.matrixInformation);
    }

    if (json.terrainFeatureTextcat) {
      avalancheSituation.setTerrainFeatureTextcat(json.terrainFeatureTextcat);
    }
    const jsonTerrainFeature = json.terrainFeature;
    const terrainFeature = new Array<TextModel>();
    for (const i in jsonTerrainFeature) {
      if (jsonTerrainFeature[i] !== null) {
        terrainFeature.push(TextModel.createFromJson(jsonTerrainFeature[i]));
      }
    }
    avalancheSituation.setTerrainFeature(terrainFeature);

    return avalancheSituation;
  }

  constructor(avalancheSituation?: AvalancheSituationModel) {
    this.aspects = new Array<Enums.Aspect>();

    if (!avalancheSituation) {
      this.avalancheSituation = undefined;
      this.treelineHigh = false;
      this.treelineLow = false;
      this.matrixInformation = new MatrixInformationModel();
      this.terrainFeatureTextcat = undefined;
      this.terrainFeature = new Array<TextModel>();
    } else {
      this.setAvalancheSituation(avalancheSituation.getAvalancheSituation());
      for (const aspect of avalancheSituation.aspects) {
        this.addAspect(aspect);
      }
      this.elevationHigh = avalancheSituation.getElevationHigh();
      this.treelineHigh = avalancheSituation.getTreelineHigh();
      this.elevationLow = avalancheSituation.getElevationLow();
      this.treelineLow = avalancheSituation.getTreelineLow();
      this.matrixInformation = new MatrixInformationModel(avalancheSituation.getMatrixInformation());
      this.terrainFeatureTextcat = avalancheSituation.terrainFeatureTextcat;
      let array = new Array<TextModel>();
      for (const entry of avalancheSituation.terrainFeature) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.terrainFeature = array;
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

  getMatrixInformation() {
    return this.matrixInformation;
  }

  setMatrixInformation(matrixInformation) {
    this.matrixInformation = matrixInformation;
  }

  getTerrainFeatureTextcat(): string {
    return this.terrainFeatureTextcat;
  }

  setTerrainFeatureTextcat(terrainFeatureTextcat: string) {
    this.terrainFeatureTextcat = terrainFeatureTextcat;
  }

  getTerrainFeature(): TextModel[] {
    return this.terrainFeature;
  }

  getTerrainFeatureIn(language: Enums.LanguageCode): string {
    for (let i = this.terrainFeature.length - 1; i >= 0; i--) {
      if (this.terrainFeature[i].getLanguageCode() === language) {
        return this.terrainFeature[i].getText();
      }
    }
  }

  getTerrainFeatureInString(language: string): string {
    return this.getTerrainFeatureIn(Enums.LanguageCode[language]);
  }

  setTerrainFeature(terrainFeature: TextModel[]) {
    this.terrainFeature = terrainFeature;
  }

  setTerrainFeatureIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.terrainFeature.length - 1; i >= 0; i--) {
      if (this.terrainFeature[i].getLanguageCode() === language) {
        this.terrainFeature[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.terrainFeature.push(model);
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
    if (this.matrixInformation && this.matrixInformation !== undefined) {
      json["matrixInformation"] = this.matrixInformation.toJson();
    }
    if (this.terrainFeatureTextcat && this.terrainFeatureTextcat !== undefined) {
      json["terrainFeatureTextcat"] = this.terrainFeatureTextcat;
    }
    if (this.terrainFeature && this.terrainFeature !== undefined && this.terrainFeature.length > 0) {
      const terrainFeature = [];
      for (let i = 0; i <= this.terrainFeature.length - 1; i++) {
        terrainFeature.push(this.terrainFeature[i].toJson());
      }
      json["terrainFeature"] = terrainFeature;
    }

    return json;
  }
}

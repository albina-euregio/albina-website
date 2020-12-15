import * as Enums from "../enums/enums";
import { BehaviorSubject } from "rxjs/Rx";
import { MatrixInformationModel } from "./matrix-information.model";
import { AvalancheSituationModel } from "./avalanche-situation.model";
import { TextModel } from "./text.model";


export class BulletinDaytimeDescriptionModel {
  public dangerRatingAbove: BehaviorSubject<Enums.DangerRating>;
  public matrixInformationAbove: MatrixInformationModel;
  public terrainFeatureAboveTextcat: string;
  public terrainFeatureAbove: TextModel[];

  public dangerRatingBelow: BehaviorSubject<Enums.DangerRating>;
  public matrixInformationBelow: MatrixInformationModel;
  public terrainFeatureBelowTextcat: string;
  public terrainFeatureBelow: TextModel[];

  public complexity: Enums.Complexity;

  public hasElevationDependency: boolean;
  public elevation: number;
  public treeline: boolean;

  public avalancheSituation1: AvalancheSituationModel;
  public avalancheSituation2: AvalancheSituationModel;
  public avalancheSituation3: AvalancheSituationModel;
  public avalancheSituation4: AvalancheSituationModel;
  public avalancheSituation5: AvalancheSituationModel;

  static createFromJson(json) {
    const bulletinDaytimeDescription = new BulletinDaytimeDescriptionModel();

    bulletinDaytimeDescription.dangerRatingAbove.next(json.dangerRatingAbove);
    if (json.matrixInformationAbove) {
      bulletinDaytimeDescription.matrixInformationAbove = MatrixInformationModel.createFromJson(json.matrixInformationAbove);
    }

    if (json.terrainFeatureAboveTextcat) {
      bulletinDaytimeDescription.setTerrainFeatureAboveTextcat(json.terrainFeatureAboveTextcat);
    }
    const jsonTerrainFeatureAbove = json.terrainFeatureAbove;
    const terrainFeatureAbove = new Array<TextModel>();
    for (const i in jsonTerrainFeatureAbove) {
      if (jsonTerrainFeatureAbove[i] !== null) {
        terrainFeatureAbove.push(TextModel.createFromJson(jsonTerrainFeatureAbove[i]));
      }
    }
    bulletinDaytimeDescription.setTerrainFeatureAbove(terrainFeatureAbove);

    bulletinDaytimeDescription.dangerRatingBelow.next(json.dangerRatingBelow);
    if (json.matrixInformationBelow) {
      bulletinDaytimeDescription.matrixInformationBelow = MatrixInformationModel.createFromJson(json.matrixInformationBelow);
    }

    if (json.terrainFeatureBelowTextcat) {
      bulletinDaytimeDescription.setTerrainFeatureBelowTextcat(json.terrainFeatureBelowTextcat);
    }
    const jsonTerrainFeatureBelow = json.terrainFeatureBelow;
    const terrainFeatureBelow = new Array<TextModel>();
    for (const i in jsonTerrainFeatureBelow) {
      if (jsonTerrainFeatureBelow[i] !== null) {
        terrainFeatureBelow.push(TextModel.createFromJson(jsonTerrainFeatureBelow[i]));
      }
    }
    bulletinDaytimeDescription.setTerrainFeatureBelow(terrainFeatureBelow);

    if (json.complexity) {
      bulletinDaytimeDescription.setComplexity(json.complexity);
    }

    if (json.avalancheSituation1) {
      bulletinDaytimeDescription.avalancheSituation1 = AvalancheSituationModel.createFromJson(json.avalancheSituation1);
    }
    if (json.avalancheSituation2) {
      bulletinDaytimeDescription.avalancheSituation2 = AvalancheSituationModel.createFromJson(json.avalancheSituation2);
    }
    if (json.avalancheSituation3) {
      bulletinDaytimeDescription.avalancheSituation3 = AvalancheSituationModel.createFromJson(json.avalancheSituation3);
    }
    if (json.avalancheSituation4) {
      bulletinDaytimeDescription.avalancheSituation4 = AvalancheSituationModel.createFromJson(json.avalancheSituation4);
    }
    if (json.avalancheSituation5) {
      bulletinDaytimeDescription.avalancheSituation5 = AvalancheSituationModel.createFromJson(json.avalancheSituation5);
    }

    bulletinDaytimeDescription.setElevation(json.elevation);
    bulletinDaytimeDescription.setTreeline(json.treeline);
    bulletinDaytimeDescription.setHasElevationDependency(json.hasElevationDependency);

    return bulletinDaytimeDescription;
  }

  constructor(bulletinDaytimeDescription?: BulletinDaytimeDescriptionModel) {
    this.dangerRatingAbove = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.low);
    this.dangerRatingBelow = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.low);

    if (!bulletinDaytimeDescription) {
      this.setDangerRatingAbove("low");
      this.matrixInformationAbove = new MatrixInformationModel();
      this.terrainFeatureAboveTextcat = undefined;
      this.terrainFeatureAbove = new Array<TextModel>();
      this.setDangerRatingBelow("low");
      this.matrixInformationBelow = new MatrixInformationModel();
      this.terrainFeatureBelowTextcat = undefined;
      this.terrainFeatureBelow = new Array<TextModel>();
      this.complexity = undefined;
      this.elevation = undefined;
      this.treeline = false;
      this.hasElevationDependency = false;
    } else {
      this.setDangerRatingAbove(bulletinDaytimeDescription.getDangerRatingAbove());
      this.matrixInformationAbove = new MatrixInformationModel(bulletinDaytimeDescription.getMatrixInformationAbove());
      this.terrainFeatureAboveTextcat = bulletinDaytimeDescription.terrainFeatureAboveTextcat;
      const arrayAbove = new Array<TextModel>();
      for (const entry of bulletinDaytimeDescription.terrainFeatureAbove) {
        arrayAbove.push(TextModel.createFromJson(entry.toJson()));
      }
      this.terrainFeatureAbove = arrayAbove;
      this.setDangerRatingBelow(bulletinDaytimeDescription.getDangerRatingBelow());
      this.matrixInformationBelow = new MatrixInformationModel(bulletinDaytimeDescription.getMatrixInformationBelow());
      this.terrainFeatureBelowTextcat = bulletinDaytimeDescription.terrainFeatureBelowTextcat;
      const arrayBelow = new Array<TextModel>();
      for (const entry of bulletinDaytimeDescription.terrainFeatureBelow) {
        arrayBelow.push(TextModel.createFromJson(entry.toJson()));
      }
      this.complexity = bulletinDaytimeDescription.getComplexity();
      this.terrainFeatureBelow = arrayBelow;
      if (bulletinDaytimeDescription.getAvalancheSituation1() !== undefined) {
        this.avalancheSituation1 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation1());
      }
      if (bulletinDaytimeDescription.getAvalancheSituation2() !== undefined) {
        this.avalancheSituation2 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation2());
      }
      if (bulletinDaytimeDescription.getAvalancheSituation3() !== undefined) {
        this.avalancheSituation3 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation3());
      }
      if (bulletinDaytimeDescription.getAvalancheSituation4() !== undefined) {
        this.avalancheSituation4 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation4());
      }
      if (bulletinDaytimeDescription.getAvalancheSituation5() !== undefined) {
        this.avalancheSituation5 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation5());
      }
      this.elevation = bulletinDaytimeDescription.elevation;
      this.treeline = bulletinDaytimeDescription.treeline;
      this.hasElevationDependency = bulletinDaytimeDescription.hasElevationDependency;
    }
  }

  getDangerRatingAbove() {
    return this.dangerRatingAbove.getValue();
  }

  setDangerRatingAbove(dangerRatingAbove) {
    this.dangerRatingAbove.next(dangerRatingAbove);
  }

  getMatrixInformationAbove() {
    return this.matrixInformationAbove;
  }

  setMatrixInformationAbove(matrixInformationAbove) {
    this.matrixInformationAbove = matrixInformationAbove;
  }

  getTerrainFeatureAboveTextcat(): string {
    return this.terrainFeatureAboveTextcat;
  }

  setTerrainFeatureAboveTextcat(terrainFeatureAboveTextcat: string) {
    this.terrainFeatureAboveTextcat = terrainFeatureAboveTextcat;
  }

  getTerrainFeatureAbove(): TextModel[] {
    return this.terrainFeatureAbove;
  }

  getTerrainFeatureAboveIn(language: Enums.LanguageCode): string {
    for (let i = this.terrainFeatureAbove.length - 1; i >= 0; i--) {
      if (this.terrainFeatureAbove[i].getLanguageCode() === language) {
        return this.terrainFeatureAbove[i].getText();
      }
    }
  }

  getTerrainFeatureAboveInString(language: string): string {
    return this.getTerrainFeatureAboveIn(Enums.LanguageCode[language]);
  }

  setTerrainFeatureAbove(terrainFeatureAbove: TextModel[]) {
    this.terrainFeatureAbove = terrainFeatureAbove;
  }

  setTerrainFeatureAboveIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.terrainFeatureAbove.length - 1; i >= 0; i--) {
      if (this.terrainFeatureAbove[i].getLanguageCode() === language) {
        this.terrainFeatureAbove[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.terrainFeatureAbove.push(model);
  }

  getDangerRatingBelow() {
    return this.dangerRatingBelow.getValue();
  }

  setDangerRatingBelow(dangerRatingBelow) {
    this.dangerRatingBelow.next(dangerRatingBelow);
  }

  getMatrixInformationBelow() {
    return this.matrixInformationBelow;
  }

  setMatrixInformationBelow(matrixInformationBelow) {
    this.matrixInformationBelow = matrixInformationBelow;
  }

  getTerrainFeatureBelowTextcat(): string {
    return this.terrainFeatureBelowTextcat;
  }

  setTerrainFeatureBelowTextcat(terrainFeatureBelowTextcat: string) {
    this.terrainFeatureBelowTextcat = terrainFeatureBelowTextcat;
  }

  getTerrainFeatureBelow(): TextModel[] {
    return this.terrainFeatureBelow;
  }

  getTerrainFeatureBelowIn(language: Enums.LanguageCode): string {
    for (let i = this.terrainFeatureBelow.length - 1; i >= 0; i--) {
      if (this.terrainFeatureBelow[i].getLanguageCode() === language) {
        return this.terrainFeatureBelow[i].getText();
      }
    }
  }

  getTerrainFeatureBelowInString(language: string): string {
    return this.getTerrainFeatureBelowIn(Enums.LanguageCode[language]);
  }

  setTerrainFeatureBelow(terrainFeatureBelow: TextModel[]) {
    this.terrainFeatureBelow = terrainFeatureBelow;
  }

  setTerrainFeatureBelowIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.terrainFeatureBelow.length - 1; i >= 0; i--) {
      if (this.terrainFeatureBelow[i].getLanguageCode() === language) {
        this.terrainFeatureBelow[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.terrainFeatureBelow.push(model);
  }

  getComplexity() {
    return this.complexity;
  }

  setComplexity(complexity: Enums.Complexity) {
    this.complexity = complexity;
  }

  getAvalancheSituation1() {
    return this.avalancheSituation1;
  }

  setAvalancheSituation1(avalancheSituation) {
    this.avalancheSituation1 = avalancheSituation;
  }

  getAvalancheSituation2() {
    return this.avalancheSituation2;
  }

  setAvalancheSituation2(avalancheSituation) {
    this.avalancheSituation2 = avalancheSituation;
  }

  getAvalancheSituation3() {
    return this.avalancheSituation3;
  }

  setAvalancheSituation3(avalancheSituation) {
    this.avalancheSituation3 = avalancheSituation;
  }

  getAvalancheSituation4() {
    return this.avalancheSituation4;
  }

  setAvalancheSituation4(avalancheSituation) {
    this.avalancheSituation4 = avalancheSituation;
  }

  getAvalancheSituation5() {
    return this.avalancheSituation5;
  }

  setAvalancheSituation5(avalancheSituation) {
    this.avalancheSituation5 = avalancheSituation;
  }

  getElevation(): number {
    return this.elevation;
  }

  setElevation(elevation: number) {
    this.elevation = elevation;
  }

  getTreeline(): boolean {
    return this.treeline;
  }

  setTreeline(treeline: boolean) {
    this.treeline = treeline;
  }

  getHasElevationDependency() {
    return this.hasElevationDependency;
  }

  setHasElevationDependency(hasElevationDependency: boolean) {
    this.hasElevationDependency = hasElevationDependency;
  }

  getSecondDangerRating(up: boolean) {
    let dangerRating = Enums.DangerRating[1];

    let tmpDangerRating = this.getDangerRating(this.avalancheSituation2, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }
    tmpDangerRating = this.getDangerRating(this.avalancheSituation3, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }
    tmpDangerRating = this.getDangerRating(this.avalancheSituation4, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }
    tmpDangerRating = this.getDangerRating(this.avalancheSituation5, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }

    return dangerRating;
  }

  getDangerRating(situation: AvalancheSituationModel, up: boolean) {
    let boundaryAvalancheSituation;
    let boundaryBulletin;

    if (situation && situation !== undefined) {
      if (up) {
        if (situation.treelineLow) {
          boundaryAvalancheSituation = 2000;
        } else {
          boundaryAvalancheSituation = situation.elevationLow;
        }
      } else {
        if (situation.treelineHigh) {
          boundaryAvalancheSituation = 1800;
        } else {
          boundaryAvalancheSituation = situation.elevationHigh;
        }
      }

      if (up) {
        if (this.treeline) {
          boundaryBulletin = 2000;
        } else {
          boundaryBulletin = this.elevation;
        }
        if (boundaryAvalancheSituation === undefined || boundaryAvalancheSituation < boundaryBulletin) {
          return situation.getDangerRating();
        }
      } else {
        if (this.treeline) {
          boundaryBulletin = 1800;
        } else {
          boundaryBulletin = this.elevation;
        }
        if (boundaryAvalancheSituation === undefined || boundaryAvalancheSituation > boundaryBulletin) {
          return situation.getDangerRating();
        }
      }
    }
  }

  updateDangerRating() {
    if (this.avalancheSituation1) {
      // ap.1
      if (this.avalancheSituation1.elevationHigh > 0 || this.avalancheSituation1.treelineHigh) {
        if (this.avalancheSituation1.elevationLow > 0 || this.avalancheSituation1.treelineLow) {
          // band
          if (this.avalancheSituation1.getDangerRatingDirection() && this.avalancheSituation1.getDangerRatingDirection().toString() === Enums.Direction[Enums.Direction.down]) {
            if (this.avalancheSituation1.treelineHigh) {
              this.treeline = true;
              this.elevation = undefined;
            } else {
              this.treeline = false;
              this.elevation = this.avalancheSituation1.elevationHigh;
            }
            this.hasElevationDependency = true;
            this.setDangerRatingBelow(this.avalancheSituation1.getDangerRating());
            this.setDangerRatingAbove(this.getSecondDangerRating(false));
          } else if (this.avalancheSituation1.getDangerRatingDirection() && this.avalancheSituation1.getDangerRatingDirection().toString() === Enums.Direction[Enums.Direction.up]) {
            if (this.avalancheSituation1.treelineLow) {
              this.treeline = true;
              this.elevation = undefined;
            } else {
              this.treeline = false;
              this.elevation = this.avalancheSituation1.elevationLow;
            }
            this.hasElevationDependency = true;
            this.setDangerRatingAbove(this.avalancheSituation1.getDangerRating());
            this.setDangerRatingBelow(this.getSecondDangerRating(true));
          } else {
            this.treeline = false;
            this.elevation = undefined;
            this.hasElevationDependency = false;
            this.setDangerRatingAbove(this.avalancheSituation1.getDangerRating());
            this.setDangerRatingBelow(this.avalancheSituation1.getDangerRating());
          }
        } else {
          // only elevation high
          if (this.avalancheSituation1.treelineHigh) {
            this.treeline = true;
            this.elevation = undefined;
          } else {
            this.treeline = false;
            this.elevation = this.avalancheSituation1.elevationHigh;
          }
          this.hasElevationDependency = true;
          this.setDangerRatingBelow(this.avalancheSituation1.getDangerRating());
          this.setDangerRatingAbove(this.getSecondDangerRating(false));
        }
      } else if (this.avalancheSituation1.elevationLow > 0 || this.avalancheSituation1.treelineLow) {
        // only elevation low
        if (this.avalancheSituation1.treelineLow) {
          this.treeline = true;
          this.elevation = undefined;
        } else {
          this.treeline = false;
          this.elevation = this.avalancheSituation1.elevationLow;
        }
        this.hasElevationDependency = true;
        this.setDangerRatingAbove(this.avalancheSituation1.getDangerRating());
        this.setDangerRatingBelow(this.getSecondDangerRating(true));
     } else {
        // no elevation
        this.treeline = false;
        this.elevation = undefined;
        this.hasElevationDependency = false;
        this.setDangerRatingAbove(this.avalancheSituation1.getDangerRating());
        this.setDangerRatingBelow(this.avalancheSituation1.getDangerRating());
      }
    } else {
      this.treeline = false;
      this.elevation = undefined;
      this.hasElevationDependency = false;
      this.setDangerRatingAbove(Enums.DangerRating[1]);
      this.setDangerRatingBelow(Enums.DangerRating[1]);
    }
  }

  toJson() {
    const json = Object();

    if (this.dangerRatingAbove && this.dangerRatingAbove !== undefined) {
      json["dangerRatingAbove"] = this.dangerRatingAbove.getValue();
    }
    if (this.matrixInformationAbove && this.matrixInformationAbove !== undefined) {
      json["matrixInformationAbove"] = this.matrixInformationAbove.toJson();
    }
    if (this.terrainFeatureAboveTextcat && this.terrainFeatureAboveTextcat !== undefined) {
      json["terrainFeatureAboveTextcat"] = this.terrainFeatureAboveTextcat;
    }
    if (this.terrainFeatureAbove && this.terrainFeatureAbove !== undefined && this.terrainFeatureAbove.length > 0) {
      const terrainFeature = [];
      for (let i = 0; i <= this.terrainFeatureAbove.length - 1; i++) {
        terrainFeature.push(this.terrainFeatureAbove[i].toJson());
      }
      json["terrainFeatureAbove"] = terrainFeature;
    }
    if (this.hasElevationDependency && this.dangerRatingBelow && this.dangerRatingBelow !== undefined) {
      json["dangerRatingBelow"] = this.dangerRatingBelow.getValue();
    }
    if (this.hasElevationDependency && this.matrixInformationBelow && this.matrixInformationBelow !== undefined) {
      json["matrixInformationBelow"] = this.matrixInformationBelow.toJson();
    }
    if (this.hasElevationDependency && this.terrainFeatureBelowTextcat && this.terrainFeatureBelowTextcat !== undefined) {
      json["terrainFeatureBelowTextcat"] = this.terrainFeatureBelowTextcat;
    }
    if (this.hasElevationDependency && this.terrainFeatureBelow && this.terrainFeatureBelow !== undefined && this.terrainFeatureBelow.length > 0) {
      const terrainFeature = [];
      for (let i = 0; i <= this.terrainFeatureBelow.length - 1; i++) {
        terrainFeature.push(this.terrainFeatureBelow[i].toJson());
      }
      json["terrainFeatureBelow"] = terrainFeature;
    }
    if (this.complexity && this.complexity !== undefined) {
      json["complexity"] = this.complexity;
    }

    if (this.avalancheSituation1 && this.avalancheSituation1 !== undefined) {
      json["avalancheSituation1"] = this.avalancheSituation1.toJson();
    }
    if (this.avalancheSituation2 && this.avalancheSituation2 !== undefined) {
      json["avalancheSituation2"] = this.avalancheSituation2.toJson();
    }
    if (this.avalancheSituation3 && this.avalancheSituation3 !== undefined) {
      json["avalancheSituation3"] = this.avalancheSituation3.toJson();
    }
    if (this.avalancheSituation4 && this.avalancheSituation4 !== undefined) {
      json["avalancheSituation4"] = this.avalancheSituation4.toJson();
    }
    if (this.avalancheSituation5 && this.avalancheSituation5 !== undefined) {
      json["avalancheSituation5"] = this.avalancheSituation5.toJson();
    }

    if (this.hasElevationDependency) {
      json["hasElevationDependency"] = true;
      if (this.treeline) {
        json["treeline"] = this.treeline;
      } else if (this.elevation && this.elevation !== undefined) {
        json["elevation"] = this.elevation;
      }
    } else {
      json["hasElevationDependency"] = false;
    }

    return json;
  }
}

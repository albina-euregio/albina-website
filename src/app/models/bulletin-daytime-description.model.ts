import * as Enums from "../enums/enums";
import { BehaviorSubject } from "rxjs/Rx";
import { MatrixInformationModel } from "./matrix-information.model";
import { AvalancheProblemModel } from "./avalanche-problem.model";
import { TextModel } from "./text.model";


export class BulletinDaytimeDescriptionModel {
  public dangerRatingAbove: Enums.DangerRating;
  public matrixInformationAbove: MatrixInformationModel;
  public terrainFeatureAboveTextcat: string;
  public terrainFeatureAbove: TextModel[];

  public dangerRatingBelow: Enums.DangerRating;
  public matrixInformationBelow: MatrixInformationModel;
  public terrainFeatureBelowTextcat: string;
  public terrainFeatureBelow: TextModel[];

  public complexity: Enums.Complexity;

  public hasElevationDependency: boolean;
  public elevation: number;
  public treeline: boolean;

  public avalancheProblem1: AvalancheProblemModel;
  public avalancheProblem2: AvalancheProblemModel;
  public avalancheProblem3: AvalancheProblemModel;
  public avalancheProblem4: AvalancheProblemModel;
  public avalancheProblem5: AvalancheProblemModel;

  static createFromJson(json) {
    const bulletinDaytimeDescription = new BulletinDaytimeDescriptionModel();

    bulletinDaytimeDescription.setDangerRatingAbove(json.dangerRatingAbove);
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

    bulletinDaytimeDescription.setDangerRatingBelow(json.dangerRatingBelow);
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

    if (json.avalancheProblem1) {
      bulletinDaytimeDescription.avalancheProblem1 = AvalancheProblemModel.createFromJson(json.avalancheProblem1);
    }
    if (json.avalancheProblem2) {
      bulletinDaytimeDescription.avalancheProblem2 = AvalancheProblemModel.createFromJson(json.avalancheProblem2);
    }
    if (json.avalancheProblem3) {
      bulletinDaytimeDescription.avalancheProblem3 = AvalancheProblemModel.createFromJson(json.avalancheProblem3);
    }
    if (json.avalancheProblem4) {
      bulletinDaytimeDescription.avalancheProblem4 = AvalancheProblemModel.createFromJson(json.avalancheProblem4);
    }
    if (json.avalancheProblem5) {
      bulletinDaytimeDescription.avalancheProblem5 = AvalancheProblemModel.createFromJson(json.avalancheProblem5);
    }

    bulletinDaytimeDescription.setElevation(json.elevation);
    bulletinDaytimeDescription.setTreeline(json.treeline);
    bulletinDaytimeDescription.setHasElevationDependency(json.hasElevationDependency);

    return bulletinDaytimeDescription;
  }

  constructor(bulletinDaytimeDescription?: BulletinDaytimeDescriptionModel) {
    this.dangerRatingAbove = Enums.DangerRating.low;
    this.dangerRatingBelow = Enums.DangerRating.low;

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
      if (bulletinDaytimeDescription.getAvalancheProblem1() !== undefined) {
        this.avalancheProblem1 = new AvalancheProblemModel(bulletinDaytimeDescription.getAvalancheProblem1());
      }
      if (bulletinDaytimeDescription.getAvalancheProblem2() !== undefined) {
        this.avalancheProblem2 = new AvalancheProblemModel(bulletinDaytimeDescription.getAvalancheProblem2());
      }
      if (bulletinDaytimeDescription.getAvalancheProblem3() !== undefined) {
        this.avalancheProblem3 = new AvalancheProblemModel(bulletinDaytimeDescription.getAvalancheProblem3());
      }
      if (bulletinDaytimeDescription.getAvalancheProblem4() !== undefined) {
        this.avalancheProblem4 = new AvalancheProblemModel(bulletinDaytimeDescription.getAvalancheProblem4());
      }
      if (bulletinDaytimeDescription.getAvalancheProblem5() !== undefined) {
        this.avalancheProblem5 = new AvalancheProblemModel(bulletinDaytimeDescription.getAvalancheProblem5());
      }
      this.elevation = bulletinDaytimeDescription.elevation;
      this.treeline = bulletinDaytimeDescription.treeline;
      this.hasElevationDependency = bulletinDaytimeDescription.hasElevationDependency;
    }
  }

  getDangerRatingAbove() {
    return this.dangerRatingAbove;
  }

  setDangerRatingAbove(dangerRatingAbove) {
    this.dangerRatingAbove = dangerRatingAbove;
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
    return this.dangerRatingBelow;
  }

  setDangerRatingBelow(dangerRatingBelow) {
    this.dangerRatingBelow = dangerRatingBelow;
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

  getAvalancheProblem1() {
    return this.avalancheProblem1;
  }

  setAvalancheProblem1(avalancheProblem) {
    this.avalancheProblem1 = avalancheProblem;
  }

  getAvalancheProblem2() {
    return this.avalancheProblem2;
  }

  setAvalancheProblem2(avalancheProblem) {
    this.avalancheProblem2 = avalancheProblem;
  }

  getAvalancheProblem3() {
    return this.avalancheProblem3;
  }

  setAvalancheProblem3(avalancheProblem) {
    this.avalancheProblem3 = avalancheProblem;
  }

  getAvalancheProblem4() {
    return this.avalancheProblem4;
  }

  setAvalancheProblem4(avalancheProblem) {
    this.avalancheProblem4 = avalancheProblem;
  }

  getAvalancheProblem5() {
    return this.avalancheProblem5;
  }

  setAvalancheProblem5(avalancheProblem) {
    this.avalancheProblem5 = avalancheProblem;
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

    let tmpDangerRating = this.getDangerRating(this.avalancheProblem2, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }
    tmpDangerRating = this.getDangerRating(this.avalancheProblem3, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }
    tmpDangerRating = this.getDangerRating(this.avalancheProblem4, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }
    tmpDangerRating = this.getDangerRating(this.avalancheProblem5, up);
    if (Enums.DangerRating[dangerRating] < Enums.DangerRating[tmpDangerRating]) {
      dangerRating = Enums.DangerRating[Enums.DangerRating[tmpDangerRating]];
    }

    return dangerRating;
  }

  getDangerRating(avalancheProblem: AvalancheProblemModel, up: boolean) {
    let boundaryAvalancheProblem;
    let boundaryBulletin;

    if (avalancheProblem && avalancheProblem !== undefined) {
      if (up) {
        if (avalancheProblem.treelineLow) {
          boundaryAvalancheProblem = 2000;
        } else {
          boundaryAvalancheProblem = avalancheProblem.elevationLow;
        }
      } else {
        if (avalancheProblem.treelineHigh) {
          boundaryAvalancheProblem = 1800;
        } else {
          boundaryAvalancheProblem = avalancheProblem.elevationHigh;
        }
      }

      if (up) {
        if (this.treeline) {
          boundaryBulletin = 2000;
        } else {
          boundaryBulletin = this.elevation;
        }
        if (boundaryAvalancheProblem === undefined || boundaryAvalancheProblem < boundaryBulletin) {
          return avalancheProblem.getDangerRating();
        }
      } else {
        if (this.treeline) {
          boundaryBulletin = 1800;
        } else {
          boundaryBulletin = this.elevation;
        }
        if (boundaryAvalancheProblem === undefined || boundaryAvalancheProblem > boundaryBulletin) {
          return avalancheProblem.getDangerRating();
        }
      }
    }
  }

  updateDangerRating() {
    if (this.avalancheProblem1) {
      // ap.1
      if (this.avalancheProblem1.elevationHigh > 0 || this.avalancheProblem1.treelineHigh) {
        if (this.avalancheProblem1.elevationLow > 0 || this.avalancheProblem1.treelineLow) {
          // band
          if (this.avalancheProblem1.getDangerRatingDirection() && this.avalancheProblem1.getDangerRatingDirection().toString() === Enums.Direction[Enums.Direction.down]) {
            if (this.avalancheProblem1.treelineHigh) {
              this.treeline = true;
              this.elevation = undefined;
            } else {
              this.treeline = false;
              this.elevation = this.avalancheProblem1.elevationHigh;
            }
            this.hasElevationDependency = true;
            this.setDangerRatingBelow(this.avalancheProblem1.getDangerRating());
            this.setDangerRatingAbove(this.getSecondDangerRating(false));
          } else if (this.avalancheProblem1.getDangerRatingDirection() && this.avalancheProblem1.getDangerRatingDirection().toString() === Enums.Direction[Enums.Direction.up]) {
            if (this.avalancheProblem1.treelineLow) {
              this.treeline = true;
              this.elevation = undefined;
            } else {
              this.treeline = false;
              this.elevation = this.avalancheProblem1.elevationLow;
            }
            this.hasElevationDependency = true;
            this.setDangerRatingAbove(this.avalancheProblem1.getDangerRating());
            this.setDangerRatingBelow(this.getSecondDangerRating(true));
          } else {
            this.treeline = false;
            this.elevation = undefined;
            this.hasElevationDependency = false;
            this.setDangerRatingAbove(this.avalancheProblem1.getDangerRating());
            this.setDangerRatingBelow(this.avalancheProblem1.getDangerRating());
          }
        } else {
          // only elevation high
          if (this.avalancheProblem1.treelineHigh) {
            this.treeline = true;
            this.elevation = undefined;
          } else {
            this.treeline = false;
            this.elevation = this.avalancheProblem1.elevationHigh;
          }
          this.hasElevationDependency = true;
          this.setDangerRatingBelow(this.avalancheProblem1.getDangerRating());
          this.setDangerRatingAbove(this.getSecondDangerRating(false));
        }
      } else if (this.avalancheProblem1.elevationLow > 0 || this.avalancheProblem1.treelineLow) {
        // only elevation low
        if (this.avalancheProblem1.treelineLow) {
          this.treeline = true;
          this.elevation = undefined;
        } else {
          this.treeline = false;
          this.elevation = this.avalancheProblem1.elevationLow;
        }
        this.hasElevationDependency = true;
        this.setDangerRatingAbove(this.avalancheProblem1.getDangerRating());
        this.setDangerRatingBelow(this.getSecondDangerRating(true));
     } else {
        // no elevation
        this.treeline = false;
        this.elevation = undefined;
        this.hasElevationDependency = false;
        this.setDangerRatingAbove(this.avalancheProblem1.getDangerRating());
        this.setDangerRatingBelow(this.avalancheProblem1.getDangerRating());
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
      json["dangerRatingAbove"] = this.dangerRatingAbove;
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
      json["dangerRatingBelow"] = this.dangerRatingBelow;
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

    if (this.avalancheProblem1 && this.avalancheProblem1 !== undefined) {
      json["avalancheProblem1"] = this.avalancheProblem1.toJson();
    }
    if (this.avalancheProblem2 && this.avalancheProblem2 !== undefined) {
      json["avalancheProblem2"] = this.avalancheProblem2.toJson();
    }
    if (this.avalancheProblem3 && this.avalancheProblem3 !== undefined) {
      json["avalancheProblem3"] = this.avalancheProblem3.toJson();
    }
    if (this.avalancheProblem4 && this.avalancheProblem4 !== undefined) {
      json["avalancheProblem4"] = this.avalancheProblem4.toJson();
    }
    if (this.avalancheProblem5 && this.avalancheProblem5 !== undefined) {
      json["avalancheProblem5"] = this.avalancheProblem5.toJson();
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

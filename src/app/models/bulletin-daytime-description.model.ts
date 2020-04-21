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

  public avalancheSituation1: AvalancheSituationModel;
  public avalancheSituation2: AvalancheSituationModel;

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

    if (json.avalancheSituation1) {
      bulletinDaytimeDescription.avalancheSituation1 = AvalancheSituationModel.createFromJson(json.avalancheSituation1);
    }
    if (json.avalancheSituation2) {
      bulletinDaytimeDescription.avalancheSituation2 = AvalancheSituationModel.createFromJson(json.avalancheSituation2);
    }

    return bulletinDaytimeDescription;
  }

  constructor(bulletinDaytimeDescription?: BulletinDaytimeDescriptionModel) {
    this.dangerRatingAbove = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing);
    this.dangerRatingBelow = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing);

    if (!bulletinDaytimeDescription) {
      this.setDangerRatingAbove("missing");
      this.matrixInformationAbove = new MatrixInformationModel();
      this.terrainFeatureAboveTextcat = undefined;
      this.terrainFeatureAbove = new Array<TextModel>();
      this.setDangerRatingBelow("missing");
      this.matrixInformationBelow = new MatrixInformationModel();
      this.terrainFeatureBelowTextcat = undefined;
      this.terrainFeatureBelow = new Array<TextModel>();
      this.avalancheSituation1 = new AvalancheSituationModel();
      this.avalancheSituation2 = new AvalancheSituationModel();
    } else {
      this.setDangerRatingAbove(bulletinDaytimeDescription.getDangerRatingAbove());
      this.matrixInformationAbove = new MatrixInformationModel(bulletinDaytimeDescription.getMatrixInformationAbove());
      this.terrainFeatureAboveTextcat = bulletinDaytimeDescription.terrainFeatureAboveTextcat;
      let arrayAbove = new Array<TextModel>();
      for (const entry of bulletinDaytimeDescription.terrainFeatureAbove) {
        arrayAbove.push(TextModel.createFromJson(entry.toJson()));
      }
      this.terrainFeatureAbove = arrayAbove;
      this.setDangerRatingBelow(bulletinDaytimeDescription.getDangerRatingBelow());
      this.matrixInformationBelow = new MatrixInformationModel(bulletinDaytimeDescription.getMatrixInformationBelow());
      this.terrainFeatureBelowTextcat = bulletinDaytimeDescription.terrainFeatureBelowTextcat;
      let arrayBelow = new Array<TextModel>();
      for (const entry of bulletinDaytimeDescription.terrainFeatureBelow) {
        arrayBelow.push(TextModel.createFromJson(entry.toJson()));
      }
      this.terrainFeatureBelow = arrayBelow;
      this.avalancheSituation1 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation1());
      this.avalancheSituation2 = new AvalancheSituationModel(bulletinDaytimeDescription.getAvalancheSituation2());
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

  setTerrainFeatureAbove(TerrainFeatureAbove: TextModel[]) {
    this.terrainFeatureAbove = TerrainFeatureAbove;
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

  setTerrainFeatureBelow(TerrainFeatureBelow: TextModel[]) {
    this.terrainFeatureBelow = TerrainFeatureBelow;
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

  toJson(hasElevationDependency: boolean) {
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
    if (hasElevationDependency && this.dangerRatingBelow && this.dangerRatingBelow !== undefined) {
      json["dangerRatingBelow"] = this.dangerRatingBelow.getValue();
    }
    if (hasElevationDependency && this.matrixInformationBelow && this.matrixInformationBelow !== undefined) {
      json["matrixInformationBelow"] = this.matrixInformationBelow.toJson();
    }
    if (hasElevationDependency && this.terrainFeatureBelowTextcat && this.terrainFeatureBelowTextcat !== undefined) {
      json["terrainFeatureBelowTextcat"] = this.terrainFeatureBelowTextcat;
    }
    if (hasElevationDependency && this.terrainFeatureBelow && this.terrainFeatureBelow !== undefined && this.terrainFeatureBelow.length > 0) {
      const terrainFeature = [];
      for (let i = 0; i <= this.terrainFeatureBelow.length - 1; i++) {
        terrainFeature.push(this.terrainFeatureBelow[i].toJson());
      }
      json["terrainFeatureBelow"] = terrainFeature;
    }

    if (this.avalancheSituation1 && this.avalancheSituation1 !== undefined) {
      json["avalancheSituation1"] = this.avalancheSituation1.toJson();
    }
    if (this.avalancheSituation2 && this.avalancheSituation2 !== undefined) {
      json["avalancheSituation2"] = this.avalancheSituation2.toJson();
    }

    return json;
  }
}

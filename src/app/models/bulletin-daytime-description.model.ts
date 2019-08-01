import * as Enums from "../enums/enums";
import { BehaviorSubject } from "rxjs/Rx";
import { MatrixInformationModel } from "./matrix-information.model";
import { AvalancheSituationModel } from "./avalanche-situation.model";

export class BulletinDaytimeDescriptionModel {
  public dangerRatingAbove: BehaviorSubject<Enums.DangerRating>;
  public matrixInformationAbove: MatrixInformationModel;
  public dangerRatingBelow: BehaviorSubject<Enums.DangerRating>;
  public matrixInformationBelow: MatrixInformationModel;

  public avalancheSituation1: AvalancheSituationModel;
  public avalancheSituation2: AvalancheSituationModel;

  static createFromJson(json) {
    const bulletinDaytimeDescription = new BulletinDaytimeDescriptionModel();

    bulletinDaytimeDescription.dangerRatingAbove.next(json.dangerRatingAbove);
    if (json.matrixInformationAbove) {
      bulletinDaytimeDescription.matrixInformationAbove = MatrixInformationModel.createFromJson(json.matrixInformationAbove);
    }

    bulletinDaytimeDescription.dangerRatingBelow.next(json.dangerRatingBelow);
    if (json.matrixInformationBelow) {
      bulletinDaytimeDescription.matrixInformationBelow = MatrixInformationModel.createFromJson(json.matrixInformationBelow);
    }

    if (json.avalancheSituation1) {
      bulletinDaytimeDescription.avalancheSituation1 = AvalancheSituationModel.createFromJson(json.avalancheSituation1);
    }
    if (json.avalancheSituation2) {
      bulletinDaytimeDescription.avalancheSituation2 = AvalancheSituationModel.createFromJson(json.avalancheSituation2);
    }

    return bulletinDaytimeDescription;
  }

  constructor(bulletinElevationDescription?: BulletinDaytimeDescriptionModel) {
    this.dangerRatingAbove = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing);
    this.dangerRatingBelow = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing);

    if (!bulletinElevationDescription) {
      this.setDangerRatingAbove("missing");
      this.matrixInformationAbove = new MatrixInformationModel();
      this.setDangerRatingBelow("missing");
      this.matrixInformationBelow = new MatrixInformationModel();
      this.avalancheSituation1 = new AvalancheSituationModel();
      this.avalancheSituation2 = new AvalancheSituationModel();
    } else {
      this.setDangerRatingAbove(bulletinElevationDescription.getDangerRatingAbove());
      this.matrixInformationAbove = new MatrixInformationModel(bulletinElevationDescription.getMatrixInformationAbove());
      this.setDangerRatingBelow(bulletinElevationDescription.getDangerRatingBelow());
      this.matrixInformationBelow = new MatrixInformationModel(bulletinElevationDescription.getMatrixInformationBelow());
      this.avalancheSituation1 = new AvalancheSituationModel(bulletinElevationDescription.getAvalancheSituation1());
      this.avalancheSituation2 = new AvalancheSituationModel(bulletinElevationDescription.getAvalancheSituation2());
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
    if (hasElevationDependency && this.dangerRatingBelow && this.dangerRatingBelow !== undefined) {
      json["dangerRatingBelow"] = this.dangerRatingBelow.getValue();
    }
    if (hasElevationDependency && this.matrixInformationBelow && this.matrixInformationBelow !== undefined) {
      json["matrixInformationBelow"] = this.matrixInformationBelow.toJson();
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

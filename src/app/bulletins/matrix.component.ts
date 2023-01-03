import { Component, Input, ViewChild, ElementRef, SimpleChange, AfterViewInit, OnChanges } from "@angular/core";
import { BulletinDaytimeDescriptionModel } from "../models/bulletin-daytime-description.model";
import { MatrixInformationModel } from "../models/matrix-information.model";
import { SettingsService } from "../providers/settings-service/settings.service";
import { MapService } from "../providers/map-service/map.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import * as Enums from "../enums/enums";
import { BulletinModel } from "app/models/bulletin.model";

@Component({
  selector: "app-matrix",
  templateUrl: "matrix.component.html"
})
export class MatrixComponent implements AfterViewInit, OnChanges {

  @Input() bulletin: BulletinModel;
  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() matrixInformation: MatrixInformationModel;
  @Input() snowpackStability: Enums.SnowpackStability;
  @Input() frequency: Enums.Frequency;
  @Input() avalancheSize: Enums.AvalancheSize;
  @Input() disabled: boolean;

  @ViewChild("0") cell0: ElementRef;
  @ViewChild("1") cell1: ElementRef;
  @ViewChild("2") cell2: ElementRef;
  @ViewChild("3") cell3: ElementRef;
  @ViewChild("4") cell4: ElementRef;
  @ViewChild("5") cell5: ElementRef;
  @ViewChild("6") cell6: ElementRef;
  @ViewChild("7") cell7: ElementRef;
  @ViewChild("8") cell8: ElementRef;
  @ViewChild("9") cell9: ElementRef;
  @ViewChild("10") cell10: ElementRef;
  @ViewChild("11") cell11: ElementRef;
  @ViewChild("12") cell12: ElementRef;
  @ViewChild("13") cell13: ElementRef;
  @ViewChild("14") cell14: ElementRef;
  @ViewChild("15") cell15: ElementRef;
  @ViewChild("16") cell16: ElementRef;
  @ViewChild("17") cell17: ElementRef;
  @ViewChild("18") cell18: ElementRef;
  @ViewChild("19") cell19: ElementRef;
  @ViewChild("20") cell20: ElementRef;
  @ViewChild("21") cell21: ElementRef;
  @ViewChild("22") cell22: ElementRef;
  @ViewChild("23") cell23: ElementRef;
  @ViewChild("24") cell24: ElementRef;
  @ViewChild("25") cell25: ElementRef;
  @ViewChild("26") cell26: ElementRef;
  @ViewChild("27") cell27: ElementRef;
  @ViewChild("28") cell28: ElementRef;
  @ViewChild("29") cell29: ElementRef;
  @ViewChild("30") cell30: ElementRef;
  @ViewChild("31") cell31: ElementRef;
  @ViewChild("32") cell32: ElementRef;
  @ViewChild("33") cell33: ElementRef;
  @ViewChild("34") cell34: ElementRef;
  @ViewChild("35") cell35: ElementRef;
  @ViewChild("36") cell36: ElementRef;
  @ViewChild("37") cell37: ElementRef;
  @ViewChild("38") cell38: ElementRef;
  @ViewChild("39") cell39: ElementRef;
  @ViewChild("40") cell40: ElementRef;
  @ViewChild("41") cell41: ElementRef;
  @ViewChild("42") cell42: ElementRef;
  @ViewChild("43") cell43: ElementRef;
  @ViewChild("44") cell44: ElementRef;
  @ViewChild("45") cell45: ElementRef;
  @ViewChild("46") cell46: ElementRef;

  languageCode = Enums.LanguageCode;

  constructor(
    public settingsService: SettingsService,
    public mapService: MapService,
    public constantsService: ConstantsService) {
  }

  ngAfterViewInit() {
    this.resetMatrix();
    this.initMatrix();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.resetMatrix();
    this.initMatrix();
  }

  resetMatrix() {
    for (let i = 0; i <= 46; i++) {
      this.setCellStyleInactive("" + i);
    }
  }

  initMatrix() {
    const index = this.getCell(this.matrixInformation);
    if (index != "0")
    this.setCellStyleActive(index);
  }

  private selectCell(cell) {
    this.matrixInformation.setDangerRating(Enums.DangerRating[this.getDangerRating(cell)]);
    this.matrixInformation.setAvalancheSize(Enums.AvalancheSize[this.getAvalancheSize(cell)]);
    this.matrixInformation.setSnowpackStability(Enums.SnowpackStability[this.getSnowpackStability(cell)]);
    this.matrixInformation.setFrequency(Enums.Frequency[this.getFrequency(cell)]);
    this.setCellStyleActive(cell);
  }

  private deselectCell(cell) {
    this.matrixInformation.setDangerRating(Enums.DangerRating[this.getDangerRating(Enums.DangerRating.missing)]);
    this.matrixInformation.setAvalancheSize(undefined);
    this.matrixInformation.setSnowpackStability(undefined);
    this.matrixInformation.setFrequency(undefined);
    this.setCellStyleInactive(cell);
  }

  private setCellStyleActive(cell) {
    if (cell !== undefined && cell !== null) {
      const element = this.getElement(cell);
      if (element && element !== undefined) {
        element.nativeElement.style.fill = this.getColor(cell);
      }
    }
  }

  private setCellStyleInactive(cell) {
    if (cell !== undefined && cell !== null) {
      const element = this.getElement(cell);
      if (element !== undefined && element !== null) {
        element.nativeElement.style.fill = this.getGrayscaleColor(cell);
      }
    }
  }

  public selectDangerRating(event) {
    this.selectDangerRatingById(event.currentTarget.id);
  }

  public selectDangerRatingById(id) {
    if (!this.disabled) {
      const oldCell = this.getCell(this.matrixInformation);
      this.setCellStyleInactive(oldCell);

      if (oldCell !== id) {
        this.selectCell(id);
      } else {
        this.deselectCell(id);
      }

      this.bulletinDaytimeDescription.updateDangerRating();
      this.mapService.updateAggregatedRegion(this.bulletin);
      this.mapService.selectAggregatedRegion(this.bulletin);
    }
  }

  private getElement(id) {
    switch (id) {
      case "0":
        return this.cell0;
      case "1":
        return this.cell1;
      case "2":
        return this.cell2;
      case "3":
        return this.cell3;
      case "4":
        return this.cell4;
      case "5":
        return this.cell5;
      case "6":
        return this.cell6;
      case "7":
        return this.cell7;
      case "8":
        return this.cell8;
      case "9":
        return this.cell9;
      case "10":
        return this.cell10;
      case "11":
        return this.cell11;
      case "12":
        return this.cell12;
      case "13":
        return this.cell13;
      case "14":
        return this.cell14;
      case "15":
        return this.cell15;
      case "16":
        return this.cell16;
      case "17":
        return this.cell17;
      case "18":
        return this.cell18;
      case "19":
        return this.cell19;
      case "20":
        return this.cell20;
      case "21":
        return this.cell21;
      case "22":
        return this.cell22;
      case "23":
        return this.cell23;
      case "24":
        return this.cell24;
      case "25":
        return this.cell25;
      case "26":
        return this.cell26;
      case "27":
        return this.cell27;
      case "28":
        return this.cell28;
      case "29":
        return this.cell29;
      case "30":
        return this.cell30;
      case "31":
        return this.cell31;
      case "32":
        return this.cell32;
      case "33":
        return this.cell33;
      case "34":
        return this.cell34;
      case "35":
        return this.cell35;
      case "36":
        return this.cell36;
      case "37":
        return this.cell37;
      case "38":
        return this.cell38;
      case "39":
        return this.cell39;
      case "40":
        return this.cell40;
      case "41":
        return this.cell41;
      case "42":
        return this.cell42;
      case "43":
        return this.cell43;
      case "44":
        return this.cell44;
      case "45":
        return this.cell45;
      case "46":
        return this.cell46;

      default:
        return undefined;
    }
  }

  private getDangerRating(id) {
    switch (id) {
      case "15":
      case "30":
      case "35":
      case "40":
      case "44":
      case "45":
      case "46":
        return Enums.DangerRating.low;

      case "5":
      case "10":
      case "14":
      case "20":
      case "24":
      case "25":
      case "28":
      case "29":
      case "34":
      case "38":
      case "39":
      case "42":
      case "43":
        return Enums.DangerRating.moderate;

      case "4":
      case "8":
      case "9":
      case "12":
      case "13":
      case "19":
      case "23":
      case "26":
      case "27":
      case "32":
      case "33":
      case "36":
      case "37":
      case "41":
        return Enums.DangerRating.considerable;

      case "3":
      case "7":
      case "11":
      case "17":
      case "18":
      case "21":
      case "22":
      case "31":
        return Enums.DangerRating.high;

      case "1":
      case "2":
      case "6":
      case "16":
        return Enums.DangerRating.very_high;

      default:
        return undefined;
    }
  }

  private getAvalancheSize(id) {
    if (id == 46) {
      return Enums.AvalancheSize.small;
    } else if (id % 5 == 1) {
      return Enums.AvalancheSize.extreme;
    } else if (id % 5 == 2) {
      return Enums.AvalancheSize.very_large;
    } else if (id % 5 == 3) {
      return Enums.AvalancheSize.large;
    } else if (id % 5 == 4) {
      return Enums.AvalancheSize.medium;
    } else if (id % 5 == 0) {
      return Enums.AvalancheSize.small;
    } else {
      return undefined;
    }
  }

  private getSnowpackStability(id) {
    if (id > 0 && id <= 15) {
      return Enums.SnowpackStability.very_poor;
    } else if (id > 15 && id <= 30) {
      return Enums.SnowpackStability.poor;
    } else if (id > 30 && id <= 45) {
      return Enums.SnowpackStability.fair;
    } else if (id == 46) {
      return Enums.SnowpackStability.good;
    } else {
      return undefined;
    }
  }

  private getFrequency(id) {
    if (id == 46) {
      return Enums.Frequency.none;
    } else if (id % 15 > 0 && id % 15 <= 5) {
      return Enums.Frequency.many;
    } else if (id % 15 > 5 && id % 15 <= 10) {
      return Enums.Frequency.some;
    } else if (id % 15 == 0 || (id % 15 > 10 && id % 15 <= 15)) {
      return Enums.Frequency.few;
    } else {
      return undefined;
    }
  }

  private getColor(id) {
    switch (this.getDangerRating(id)) {
      case Enums.DangerRating.low:
        return this.constantsService.colorDangerRatingLow;
      case Enums.DangerRating.moderate:
        return this.constantsService.colorDangerRatingModerate;
      case Enums.DangerRating.considerable:
        return this.constantsService.colorDangerRatingConsiderable;
      case Enums.DangerRating.high:
        return this.constantsService.colorDangerRatingHigh;
      case Enums.DangerRating.very_high:
        return this.constantsService.colorDangerRatingVeryHigh;
      default:
        return "#FFFFFF";
    }
  }

  private getGrayscaleColor(id) {
    // white fields in the matrix
    if (id == 26 || id == 31 || id == 32 || id == 36 || id == 37 || id == 41 || id == 42) {
      return "#FFFFFF";
    }
    switch (this.getDangerRating(id)) {
      case Enums.DangerRating.low:
        return this.constantsService.colorDangerRatingLowBw;
      case Enums.DangerRating.moderate:
        return this.constantsService.colorDangerRatingModerateBw;
      case Enums.DangerRating.considerable:
        return this.constantsService.colorDangerRatingConsiderableBw;
      case Enums.DangerRating.high:
        return this.constantsService.colorDangerRatingHighBw;
      case Enums.DangerRating.very_high:
        return this.constantsService.colorDangerRatingVeryHighBw;
      default:
        return "#FFFFFF";
    }
  }

  private getCell(matrixInformation: MatrixInformationModel) {
    var snowpackStabilityFactor = 0;
    var frequencyFactor = 0;
    var avalancheSizeFactor = 0;

    switch (+Enums.SnowpackStability[matrixInformation.getSnowpackStability()]) {
      case Enums.SnowpackStability.very_poor:
        snowpackStabilityFactor = 0;
        break;
      case Enums.SnowpackStability.poor:
        snowpackStabilityFactor = 1;
        break;
      case Enums.SnowpackStability.fair:
        snowpackStabilityFactor = 2;
        break;
      case Enums.SnowpackStability.good:
        return "0";
      default:
        return "0";
    }

    switch (+Enums.Frequency[matrixInformation.getFrequency()]) {
      case Enums.Frequency.many:
        frequencyFactor = 0;
        break;
      case Enums.Frequency.some:
        frequencyFactor = 1;
        break;
      case Enums.Frequency.few:
        frequencyFactor = 2
        break;
      case Enums.Frequency.none:
        return "0";
      default:
        return "0";
    }

    switch (+Enums.AvalancheSize[matrixInformation.getAvalancheSize()]) {
      case Enums.AvalancheSize.extreme:
        avalancheSizeFactor = 1;
        break;
      case Enums.AvalancheSize.very_large:
        avalancheSizeFactor = 2;
        break;
      case Enums.AvalancheSize.large:
        avalancheSizeFactor = 3;
        break;
      case Enums.AvalancheSize.medium:
        avalancheSizeFactor = 4;
        break;
      case Enums.AvalancheSize.small:
        avalancheSizeFactor = 5;
        break;
      default:
        return "0";
    }

    var result = snowpackStabilityFactor * 15 + frequencyFactor * 5 + avalancheSizeFactor;
    return "" + result;
  }
}

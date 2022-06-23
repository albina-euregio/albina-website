import { AfterViewInit, Component, Input } from "@angular/core";
import { MatrixInformationModel } from "../models/matrix-information.model";
import { BulletinDaytimeDescriptionModel } from "app/models/bulletin-daytime-description.model";
import { SettingsService } from "../providers/settings-service/settings.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { MapService } from "../providers/map-service/map.service";
import * as Enums from "../enums/enums";
import { BulletinModel } from "app/models/bulletin.model";

@Component({
  selector: "app-matrix-parameter",
  templateUrl: "matrix-parameter.component.html"
})
export class MatrixParameterComponent {

  @Input() bulletin: BulletinModel;
  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() matrixInformation: MatrixInformationModel;
  @Input() disabled: boolean;

  dangerRatingEnabled: boolean;

  languageCode = Enums.LanguageCode;

  constructor(
    public settingsService: SettingsService,
    public mapService: MapService,
    public constantsService: ConstantsService) {
      this.dangerRatingEnabled = false;
  }

  isSnowpackStability(snowpackStability) {
    if (this.matrixInformation && this.matrixInformation.snowpackStability === snowpackStability) {
      return true;
    }
    return false;
  }

  setSnowpackStability(event, snowpackStability) {
    event.stopPropagation();
    this.dangerRatingEnabled = false;
    this.matrixInformation.dangerRatingModificator = undefined;
    this.matrixInformation.setSnowpackStability(snowpackStability);
    this.updateDangerRating();
  }

  isFrequency(frequency) {
    if (this.matrixInformation && this.matrixInformation.frequency === frequency) {
      return true;
    }
    return false;
  }

  setFrequency(event, frequency) {
    event.stopPropagation();
    this.dangerRatingEnabled = false;
    this.matrixInformation.dangerRatingModificator = undefined;
    this.matrixInformation.setFrequency(frequency);
    this.updateDangerRating();
  }

  isAvalancheSize(avalancheSize) {
    if (this.matrixInformation && this.matrixInformation.avalancheSize === avalancheSize) {
      return true;
    }
    return false;
  }

  setAvalancheSize(event, avalancheSize) {
    event.stopPropagation();
    this.dangerRatingEnabled = false;
    this.matrixInformation.dangerRatingModificator = undefined;
    this.matrixInformation.setAvalancheSize(avalancheSize);
    this.updateDangerRating();
  }

  isDangerRating(dangerRating) {
    if (this.matrixInformation && this.matrixInformation.dangerRating === dangerRating) {
      return true;
    }
    return false;
  }

  setDangerRating(event, dangerRating) {
    event.stopPropagation();
    this.matrixInformation.setDangerRating(dangerRating);
    this.bulletinDaytimeDescription.updateDangerRating();
    this.mapService.updateAggregatedRegion(this.bulletin);
    this.mapService.selectAggregatedRegion(this.bulletin);
  }

  overrideDangerRating(event, dangerRating) {
    event.stopPropagation();
    if (!this.disabled && this.dangerRatingEnabled) {
      this.setDangerRating(event, dangerRating);
    }
  }

  setDangerRatingEnabled(event) {
    if (!this.dangerRatingEnabled) {
      this.dangerRatingEnabled = true;
      this.matrixInformation.dangerRatingModificator = undefined;
    } else {
      this.dangerRatingEnabled = false;
      this.updateDangerRating();
      this.matrixInformation.dangerRatingModificator = undefined;
    }
  }

  private updateDangerRating() {
    switch (+Enums.SnowpackStability[this.matrixInformation.getSnowpackStability()]) {
      case Enums.SnowpackStability.very_poor:
        switch (+Enums.Frequency[this.matrixInformation.getFrequency()]) {
          case Enums.Frequency.many:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("very_high");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("very_high");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("moderate");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.some:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("very_high");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("moderate");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.few:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("low");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          default:
            this.matrixInformation.setDangerRating("missing");
            break;
        }
        break;
      case Enums.SnowpackStability.poor:
        switch (+Enums.Frequency[this.matrixInformation.getFrequency()]) {
          case Enums.Frequency.many:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("very_high");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("moderate");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.some:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("moderate");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.few:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("low");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          default:
            this.matrixInformation.setDangerRating("missing");
            break;
        }
        break;
      case Enums.SnowpackStability.fair:
        switch (+Enums.Frequency[this.matrixInformation.getFrequency()]) {
          case Enums.Frequency.many:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("high");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("low");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.some:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("low");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.few:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("considerable");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("moderate");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("low");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("low");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          case Enums.Frequency.none:
            switch (+Enums.AvalancheSize[this.matrixInformation.getAvalancheSize()]) {
              case Enums.AvalancheSize.extreme:
                this.matrixInformation.setDangerRating("low");
                break;
              case Enums.AvalancheSize.very_large:
                this.matrixInformation.setDangerRating("low");
                break;
              case Enums.AvalancheSize.large:
                this.matrixInformation.setDangerRating("low");
                break;
              case Enums.AvalancheSize.medium:
                this.matrixInformation.setDangerRating("low");
                break;
              case Enums.AvalancheSize.small:
                this.matrixInformation.setDangerRating("low");
                break;
              default:
                this.matrixInformation.setDangerRating("missing");
                break;
            }
            break;
          default:
            this.matrixInformation.setDangerRating("missing");
            break;
        }
        break;
      case Enums.SnowpackStability.good:
        this.matrixInformation.setDangerRating("low");
        break;
      default:
        this.matrixInformation.setDangerRating("missing");
        break;
    }
    this.bulletinDaytimeDescription.updateDangerRating();
    this.mapService.updateAggregatedRegion(this.bulletin);
    this.mapService.selectAggregatedRegion(this.bulletin);
  }

  isDangerRatingModificator(modificator) {
    if (this.matrixInformation && this.matrixInformation.dangerRatingModificator === modificator) {
      return true;
    }
    return false;
  }

  setDangerRatingModificator(event, modificator) {
    event.stopPropagation();
    this.matrixInformation.setDangerRatingModificator(modificator);
  }
}

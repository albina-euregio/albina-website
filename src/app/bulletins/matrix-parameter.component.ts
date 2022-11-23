import { OnChanges, Component, Input } from "@angular/core";
import { MatrixInformationModel } from "../models/matrix-information.model";
import { BulletinDaytimeDescriptionModel } from "app/models/bulletin-daytime-description.model";
import { SettingsService } from "../providers/settings-service/settings.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { MapService } from "../providers/map-service/map.service";
import * as Enums from "../enums/enums";
import { BulletinModel } from "app/models/bulletin.model";
import type { Options, ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-matrix-parameter",
  templateUrl: "matrix-parameter.component.html"
})
export class MatrixParameterComponent implements OnChanges {

  @Input() bulletin: BulletinModel;
  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() matrixInformation: MatrixInformationModel;
  @Input() disabled: boolean;

  dangerRatingEnabled: boolean;
  languageCode = Enums.LanguageCode;

  snowpackStabilityOptions: Options = {
    floor: 25,
    ceil: 100,
    showTicksValues: false,
    showTicks: true,
    showSelectionBar: true,
    getLegend: (value: number): string => {
      switch (value) {
        case 37: return this.translateService.instant("snowpackStability.fair");
        case 62: return this.translateService.instant("snowpackStability.poor");
        case 87: return this.translateService.instant("snowpackStability.very_poor");
        default: return '';
      }
    },
    getSelectionBarColor: (value: number): string => {
      if (value < 0) {
          return 'lightgrey';
      }
      if (value < 25) {
          return 'green';
      }
      if (value < 50) {
          return 'yellow';
      }
      if (value < 75) {
          return 'orange';
      }
      if (value >= 75) {
          return 'red';
      }
      return 'lightgrey';
    },
    getPointerColor: (value: number): string => {
      if (value < 0) {
          return 'grey';
      }
      if (value < 25) {
          return 'green';
      }
      if (value < 50) {
          return 'yellow';
      }
      if (value < 75) {
          return 'orange';
      }
      if (value >= 75) {
          return 'red';
      }
      return 'grey';
    }
  };

  frequencyOptions: Options = {
    floor: 25,
    ceil: 100,
    showTicksValues: false,
    showTicks: true,
    showSelectionBar: true,
    getLegend: (value: number): string => {
      switch (value) {
        case 37: return this.translateService.instant("frequency.few");
        case 62: return this.translateService.instant("frequency.some");
        case 87: return this.translateService.instant("frequency.many");
        default: return '';
      }
    },
    getSelectionBarColor: (value: number): string => {
      if (value < 0) {
          return 'lightgrey';
      }
      if (value < 25) {
          return 'green';
      }
      if (value < 50) {
          return 'yellow';
      }
      if (value < 75) {
          return 'orange';
      }
      if (value >= 75) {
          return 'red';
      }
      return 'lightgrey';
    },
    getPointerColor: (value: number): string => {
      if (value < 0) {
          return 'grey';
      }
      if (value < 25) {
          return 'green';
      }
      if (value < 50) {
          return 'yellow';
      }
      if (value < 75) {
          return 'orange';
      }
      if (value >= 75) {
          return 'red';
      }
      return 'grey';
    }
  };

  avalancheSizeOptions: Options = {
    floor: 0,
    ceil: 100,
    showTicksValues: false,
    showTicks: true,
    showSelectionBar: true,
    getLegend: (value: number): string => {
      switch (value) {
        case 10: return this.translateService.instant("avalancheSize.small");
        case 30: return this.translateService.instant("avalancheSize.medium");
        case 50: return this.translateService.instant("avalancheSize.large");
        case 70: return this.translateService.instant("avalancheSize.very_large");
        case 90: return this.translateService.instant("avalancheSize.extreme");
        default: return '';
      }
    },
    getSelectionBarColor: (value: number): string => {
      if (value < 0) {
          return 'lightgrey';
      }
      if (value < 20) {
          return 'green';
      }
      if (value < 40) {
          return 'yellow';
      }
      if (value < 60) {
          return 'orange';
      }
      if (value < 80) {
          return 'red';
      }
      if (value >= 80) {
        return 'black';
      }
      return 'lightgrey';
    },
    getPointerColor: (value: number): string => {
      if (value < 0) {
          return 'grey';
      }
      if (value < 20) {
          return 'green';
      }
      if (value < 40) {
          return 'yellow';
      }
      if (value < 60) {
          return 'orange';
      }
      if (value < 80) {
          return 'red';
      }
      if (value >= 80) {
          return 'black';
      }
      return 'grey';
    }
  };

  constructor(
    public settingsService: SettingsService,
    public mapService: MapService,
    public constantsService: ConstantsService,
    public translateService: TranslateService) {
      this.dangerRatingEnabled = false;
  }

  ngOnChanges(): void {
    this.snowpackStabilityOptions = Object.assign({}, this.snowpackStabilityOptions, {disabled: this.disabled});
    this.frequencyOptions = Object.assign({}, this.frequencyOptions, {disabled: this.disabled});
    this.avalancheSizeOptions = Object.assign({}, this.avalancheSizeOptions, {disabled: this.disabled});
  }

  onSnowpackStabilityValueChange(changeContext: ChangeContext): void {
    switch (true) {
      case (changeContext.value < 25):
        this.setSnowpackStability('good');
        break;
      case (changeContext.value < 50):
        this.setSnowpackStability('fair');
        break;
      case (changeContext.value < 75):
        this.setSnowpackStability('poor');
        break;
      default:
        this.setSnowpackStability('very_poor');
        break;
    }
  }

  onFrequencyValueChange(changeContext: ChangeContext): void {
    switch (true) {
      case (changeContext.value < 25):
        this.setFrequency('none');
        break;
      case (changeContext.value < 50):
        this.setFrequency('few');
        break;
      case (changeContext.value < 75):
        this.setFrequency('some');
        break;
      default:
        this.setFrequency('many');
        break;
    }
  }

  onAvalancheSizeValueChange(changeContext: ChangeContext): void {
    switch (true) {
      case (changeContext.value < 20):
        this.setAvalancheSize('small');
        break;
      case (changeContext.value < 40):
        this.setAvalancheSize('medium');
        break;
      case (changeContext.value < 60):
        this.setAvalancheSize('large');
        break;
      case (changeContext.value < 80):
        this.setAvalancheSize('very_large');
        break;
      default:
        this.setAvalancheSize('extreme');
        break;
    }
  }

  isSnowpackStability(snowpackStability) {
    if (this.matrixInformation && this.matrixInformation.snowpackStability === snowpackStability) {
      return true;
    }
    return false;
  }

  setSnowpackStabilityEvent(event, snowpackStability) {
    event.stopPropagation();
    this.setSnowpackStability(snowpackStability);
  }

  setSnowpackStability(snowpackStability) {
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

  setFrequencyEvent(event, frequency) {
    event.stopPropagation();
    this.setFrequency(frequency);
  }

  setFrequency(frequency) {
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

  setAvalancheSizeEvent(event, avalancheSize) {
    event.stopPropagation();
    this.setAvalancheSize(avalancheSize);
  }

  setAvalancheSize(avalancheSize) {
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

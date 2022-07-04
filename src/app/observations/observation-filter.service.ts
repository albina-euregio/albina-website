import { Injectable } from "@angular/core";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import {
  GenericObservation,
  ObservationSource,
  LocalFilterTypes,
  FilterSelectionData
} from "./models/generic-observation.model";
import * as Enums from "../enums/enums";
import {
  ObservationFilterType
} from "./models/generic-observation.model";


@Injectable()
export class ObservationFilterService {
  public dateRange: Date[] = [];
  public readonly elevationRange = [0, 4000];
  public readonly elevationSectionSize = 500;
  public selectedElevations: number[] = [];
  public regions: string[] = [];

  public elevationSelection: FilterSelectionData = {selected: [], highlighted: []};
  public aspectSelection: FilterSelectionData = {selected: [], highlighted: []};

  public filterSelection:  Record<LocalFilterTypes, FilterSelectionData> = {
    Elevation: {selected: [], highlighted: []},
    Aspects: {selected: [], highlighted: []},

  }


  constructor(private constantsService: ConstantsService) {}

  set days(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 0, 0);
    this.dateRange = [startDate, endDate];
  }

  get startDate(): Date {
    return this.dateRange[0];
  }

  get endDate(): Date {
    return this.dateRange[1];
  }

  public test(observation: GenericObservation) {
    return (
      this.inDateRange(observation) &&
      this.inMapBounds(observation) &&
      this.inRegions(observation) &&
      this.inElevationRange(observation) &&
      this.inAspects(observation)
    );
  }

  public getAspectDataset(observations: GenericObservation[]) {
    const dataRaw = {};

    for (const [key, value] of Object.entries(Enums.Aspect)) {
      if (isNaN(Number(key))) dataRaw[key] = {"all": 0, "selected": 0, "highlighted": this.aspectSelection.highlighted.includes(key) ? 1 : 0};
    }

    observations.forEach(observation => {
      if(observation.aspect) {
        dataRaw[observation.aspect].all++;
        if(observation.filterType = ObservationFilterType.Local) dataRaw[observation.aspect].selected++;
        
      }
    });

    const dataset = [['category', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"], values["selected"], values["highlighted"]]);

    return {dataset: {source: dataset}}
  }

  public getElevationDataset(observations: GenericObservation[]) {

    const dataRaw = {};

    for (const [key, value] of Object.entries(Enums.Aspect)) {
      if (isNaN(Number(key))) dataRaw[key] = {"max": 0, "all": 0, "selected": 0, "highlighted": 0};
    }

    observations.forEach(observation => {
      if(observation.elevation) {
        dataRaw[observation.aspect].all++;
        if(observation.filterType = ObservationFilterType.Local) dataRaw[observation.aspect].selected++;
      }
    });

    const dataset = [['category', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"], values["selected"], values["highlighted"]]);

    return {dataset: {source: dataset}}
  }

  inDateRange({ $source, eventDate }: GenericObservation): boolean {
    if ($source === ObservationSource.LwdKipSperre) return true;
    return this.startDate <= eventDate && eventDate <= this.endDate;
  }

  inMapBounds({ latitude, longitude }: GenericObservation): boolean {
    if (!latitude || !longitude) {
      return true;
    }
    const { mapBoundaryS, mapBoundaryN, mapBoundaryW, mapBoundaryE } =
      this.constantsService;
    return (
      mapBoundaryS < latitude &&
      latitude < mapBoundaryN &&
      mapBoundaryW < longitude &&
      longitude < mapBoundaryE
    );
  }

  private inRegions({ region }: GenericObservation) {
    return (
      !this.regions.length ||
      (typeof region === "string" && this.regions.includes(region))
    );
  }

  private inElevationRange({ elevation }: GenericObservation) {
    return (
      elevation === undefined ||
      (this.elevationRange[0] <= elevation &&
        elevation <= this.elevationRange[1])
    );
  }

  private inAspects({ aspect }: GenericObservation) {
    return (
      !this.filterSelection[LocalFilterTypes.Aspects].selected.length ||
      (typeof aspect === "string" &&
        this.filterSelection[LocalFilterTypes.Aspects].selected.includes(aspect.toUpperCase()))
    );
  }
}

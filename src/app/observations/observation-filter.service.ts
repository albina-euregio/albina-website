import { Injectable, Input } from "@angular/core";
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


interface GenericFilterToggleData {
  type: LocalFilterTypes;
  data: {
    value: string;
    altKey: boolean;
  }
}

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

  toggleFilter(filterData: GenericFilterToggleData){
    console.log("toggleFilter ##1", filterData);
    let curFilterType = this.filterSelection[filterData["type"]];
    let curFilterTypeSubset = "selected";
    if(filterData.data.altKey) curFilterTypeSubset = "highlighted";
    var index = curFilterType[curFilterTypeSubset].indexOf(filterData.data.value);
    if (index !== -1) curFilterType[curFilterTypeSubset].splice(index, 1);
    else curFilterType[curFilterTypeSubset].push(filterData.data.value);
    console.log("toggleFilter ##2", curFilterType, index);
    this.filterSelection[filterData["type"]] = curFilterType;
  }

  set days(days: number) {

    if(!this.endDate) {
      const newEndDate = new Date();
      newEndDate.setHours(23, 59, 0, 0)
      this.endDate = newEndDate;
    }
    const newStartDate = new Date(this.endDate);
    newStartDate.setDate(newStartDate.getDate() - days);
    newStartDate.setHours(0, 0, 0, 0);
  
    this.startDate = newStartDate;

    this.dateRange = [this.startDate, this.endDate];
    //console.log("days ##1.2", days, this.dateRange);
  }

  get startDate(): Date {
    return this.dateRange[0];
  }

  set startDate(date: Date) {
    this.dateRange[0] = date;
  }

  get endDate(): Date {
    return this.dateRange[1];
  }

  set endDate(date: Date) {
    this.dateRange[1] = date;
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
    //console.log("getAspectDataset ##1", this);
    for (const [key, value] of Object.entries(Enums.Aspect)) {
      if (isNaN(Number(key))) dataRaw[key] = {"all": 0, "selected": 0, "highlighted": this.aspectSelection.highlighted.includes(key) ? 1 : 0};
    }

    observations.forEach(observation => {
      //console.log("getAspectDataset ##2", observation);
      if(observation.aspect) {
        //console.log("getAspectDataset ##3", observation);
        dataRaw[observation.aspect].all++;
        
        if(observation.filterType = ObservationFilterType.Local) dataRaw[observation.aspect].selected++;
      }
    });
    //console.log("getAspectDataset", dataRaw);
    const dataset = [['category', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"], values["selected"], values["highlighted"]]);
    console.log("getAspectDataset ##4 dataset", dataset);
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
    return (this.startDate <= eventDate && eventDate <= this.endDate);
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

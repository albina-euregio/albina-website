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
    Aspect: {selected: [], highlighted: []},

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
      newEndDate.setDate(newEndDate.getDate() - 150); // set for debugging
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


  public isSelected(observation: GenericObservation) {
    return (
      this.inDateRange(observation) &&
      this.inMapBounds(observation) &&
      this.inRegions(observation) &&
      this.inElevationRange(observation) &&
      this.inAspects(observation)
    );
  }

  public isHighlighted(observation: GenericObservation) {
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
    console.log("getAspectDataset ##1");
    for (const [key, value] of Object.entries(Enums.Aspect)) {
      if (isNaN(Number(key))) dataRaw[key] = {"all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.Aspect].highlighted.includes(key) ? 1 : 0};
    }

    observations.forEach(observation => {
      //console.log("getAspectDataset ##2", observation);
      if(observation.aspect) {
        //console.log("getAspectDataset ##3", observation);
        dataRaw[observation.aspect].all++;
        
        if(observation.filterType === ObservationFilterType.Local) dataRaw[observation.aspect].selected++;
      }
    });
    //console.log("getAspectDataset", dataRaw);
    const dataset = [['category', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"], values["selected"], values["highlighted"] === 1 ? values["all"] : 0]);
    console.log("getAspectDataset ##4 dataset", dataset);
    return {dataset: {source: dataset}}
  }

  public getElevationDataset(observations: GenericObservation[]) {
    console.log("getElevationDataset ##1", observations);
    const dataRaw = {};

    let curElevation = this.elevationRange[0];
    while(curElevation <= this.elevationRange[1]) {
      dataRaw[curElevation] = {"max": 0, "all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.Elevation].highlighted.includes(curElevation + "") ? 1 : 0};
      curElevation += this.elevationSectionSize;
    }
    console.log("getElevationDataset ##2", dataRaw);
    observations.forEach(observation => {
      if(observation.elevation) {
        const elevationIndex = this.getElevationIndex(observation.elevation);
        console.log("getElevationDataset ##3", dataRaw, elevationIndex, observation.elevation);
        dataRaw[elevationIndex].all++;
        if(observation.filterType === ObservationFilterType.Local) dataRaw[elevationIndex].selected++;
      }
    });

    const dataset = [['category', 'max', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"] + values["all"] / 10, values["all"], values["selected"], values["highlighted"] === 1 ? values["all"] : 0] );
    console.log("getElevationDataset ##4 dataset", dataset);
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

  private inElevationRange({ elevation }: GenericObservation, testHighlighted: boolean = false) {

    const elevationIndex = this.getElevationIndex(elevation);
    console.log("inElevationRange ##4 dataset", elevationIndex, this.filterSelection[LocalFilterTypes.Elevation]["selected"].includes(elevationIndex));
    let testField = "selected";
    if(!testHighlighted) {
      return (!this.filterSelection[LocalFilterTypes.Elevation][testField].length ||
      this.filterSelection[LocalFilterTypes.Elevation][testField].includes(elevationIndex))
    } else {
      testField = "highlighted";
      return this.filterSelection[LocalFilterTypes.Elevation][testField].includes(elevationIndex)
    }

  }
  
  private getElevationIndex(elevation: number): string {
    if(!elevation) return "";
    const range =  this.elevationRange[1] - this.elevationRange[0];
    return (Math.floor((elevation - this.elevationRange[0]) / this.elevationSectionSize) * this.elevationSectionSize + this.elevationRange[0]) + "";

  }

  private inAspects({ aspect }: GenericObservation, testHighlighted: boolean = false) {
    //console.log("inAspects ##4", this.filterSelection[LocalFilterTypes.Aspect]);
    let testField = "selected";
    if(!testHighlighted) {
      return (
        !this.filterSelection[LocalFilterTypes.Aspect][testField].length ||
        (typeof aspect === "string" &&
          this.filterSelection[LocalFilterTypes.Aspect][testField].includes(aspect.toUpperCase()))
      );

    } else {
      testField = "highlighted";
      return (
        (typeof aspect === "string" &&
          this.filterSelection[LocalFilterTypes.Aspect][testField].includes(aspect.toUpperCase()))
      );

    }

    
  }
}

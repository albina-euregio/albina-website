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

const DATASET_MAX_FACTOR = 1.1

interface GenericFilterToggleData {
  type: LocalFilterTypes;
  data: {
    value: string;
    altKey: boolean;
    invert: boolean,
    reset: boolean
  }
}

@Injectable()
export class ObservationFilterService {
  public dateRange: Date[] = [];
  public readonly elevationRange = [0, 4000];
  public readonly elevationSectionSize = 500;
  public selectedElevations: number[] = [];
  public regions: string[] = [];

  public elevationSelection: FilterSelectionData = {all: [], selected: [], highlighted: []};
  public aspectSelection: FilterSelectionData = {all: [], selected: [], highlighted: []};

  public filterSelection:  Record<LocalFilterTypes, FilterSelectionData> = {
    Elevation: {all: [], selected: [], highlighted: []},
    Aspect: {all: [], selected: [], highlighted: []},
    AvalancheProblem: {all: [], selected: [], highlighted: []},
    Stability: {all: [], selected: [], highlighted: []},
    DangerPattern: {all: [], selected: [], highlighted: []},
  }


  constructor(private constantsService: ConstantsService) {
    this.seedFilterSelectionsAll();
  }

  toggleFilter(filterData: GenericFilterToggleData){
    console.log("toggleFilter ##1", filterData);
    let curFilterType = this.filterSelection[filterData["type"]];
    let curFilterTypeSubset = "selected";
    if(filterData.data.altKey) curFilterTypeSubset = "highlighted";

    if(filterData.data.reset) {
      curFilterType[curFilterTypeSubset] = [];
    } else if(filterData.data.invert) {
      console.log("toggleFilter ##2.0", curFilterType[curFilterTypeSubset] )
      if(curFilterType[curFilterTypeSubset].length > 0) {
        curFilterType[curFilterTypeSubset] = curFilterType.all.filter(value => {
          console.log("toggleFilter ##2.001", value, curFilterType[curFilterTypeSubset].indexOf(value))
          return curFilterType[curFilterTypeSubset].indexOf(value) === -1 ? true : false;
        });
      }
      

      console.log("toggleFilter ##2.01", curFilterType[curFilterTypeSubset] );
    } else {
      let index = curFilterType[curFilterTypeSubset].indexOf(filterData.data.value);
      if (index !== -1) curFilterType[curFilterTypeSubset].splice(index, 1);
      else curFilterType[curFilterTypeSubset].push(filterData.data.value);
      
    }

    console.log("toggleFilter ##2", curFilterType);
    this.filterSelection[filterData["type"]] = curFilterType;
    console.log("toggleFilter ##3", this.filterSelection);
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
      (
        this.isIncluded(LocalFilterTypes.Elevation, this.getElevationIndex(observation.elevation)) &&
        this.isIncluded(LocalFilterTypes.Aspect, observation.aspect) &&
        this.isIncluded(LocalFilterTypes.Stability, observation.stability)
 
      )
    );
  }

  public isHighlighted(observation: GenericObservation) {
    return (
      this.inDateRange(observation) &&
      this.inMapBounds(observation) &&
      this.inRegions(observation) &&
      (
        this.isIncluded(LocalFilterTypes.Elevation, this.getElevationIndex(observation.elevation), true) ||
        this.isIncluded(LocalFilterTypes.Aspect, observation.aspect, true) ||
        this.isIncluded(LocalFilterTypes.Stability, observation.stability, true)
      )
    );
  }

  private seedFilterSelectionsAll() {

    for (const [key] of Object.entries(Enums.Aspect)) {
      if(isNaN(Number(key))) {
        this.filterSelection.Aspect.all.push(key);
      }
    }

    for (const [key, value] of Object.entries(Enums.Stability)) {
      console.log("seedFilterSelections ##1", key);
      this.filterSelection.Stability.all.unshift(key);
    }

    let curElevation = this.elevationRange[0];
    while(curElevation <= this.elevationRange[1]) {
      this.filterSelection.Elevation.all.push(curElevation + "");
      curElevation += this.elevationSectionSize;
    }

    for (const [key] of Object.entries(Enums.DangerPattern)) {
      if(isNaN(Number(key))) {
        this.filterSelection.DangerPattern.all.push(key);
      }
    }

    for (const [key] of Object.entries(Enums.AvalancheProblem)) {
      if(isNaN(Number(key))) {
        this.filterSelection.AvalancheProblem.all.push(key);
      }
    }

    console.log("seedFilterSelections ##99", this.filterSelection);

  }


  public getAspectDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    console.log("getAspectDataset ##1");

    this.filterSelection[LocalFilterTypes.Aspect]["all"].forEach(key => dataRaw[key] = {"all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.Aspect].highlighted.includes(key) ? 1 : 0})

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

  public getStabilityDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    console.log("getstabilityDataset ##1");

    this.filterSelection[LocalFilterTypes.Stability]["all"].forEach(key => dataRaw[key] = {"max": 0, "all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.Stability].highlighted.includes(key) ? 1 : 0})
    
    observations.forEach(observation => {
      //console.log("getstabilityDataset ##2", observation);
      if(observation.stability) {
        //console.log("getstabilityDataset ##3", observation);
        dataRaw[observation.stability].all++;
        
        if(observation.filterType === ObservationFilterType.Local) dataRaw[observation.stability].selected++;
      }
    });
    //console.log("getstabilityDataset", dataRaw);
    const dataset = [['category', 'max', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"] * DATASET_MAX_FACTOR, values["all"], values["selected"], values["highlighted"] === 1 ? values["all"] : 0]);
    console.log("getstabilityDataset ##4 dataset", dataset);
    return {dataset: {source: dataset}}
  }

  public getElevationDataset(observations: GenericObservation[]) {
    console.log("getElevationDataset ##1", observations);
    const dataRaw = {};

    this.filterSelection[LocalFilterTypes.Elevation]["all"].forEach(key => dataRaw[key] = {"max": 0, "all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.Elevation].highlighted.includes(key) ? 1 : 0})

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

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"] * DATASET_MAX_FACTOR, values["all"], values["selected"], values["highlighted"] === 1 ? values["all"] : 0] );
    console.log("getElevationDataset ##4 dataset", dataset);
    return {dataset: {source: dataset}}
  }

  public getAvalancheProblemDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    console.log("getAvalancheProblemDataset ##1");

    this.filterSelection[LocalFilterTypes.AvalancheProblem]["all"].forEach(key => dataRaw[key] = {"max": 0, "all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.AvalancheProblem].highlighted.includes(key) ? 1 : 0})
    
    observations.forEach(observation => {
      //console.log("getAvalancheProblemDataset ##2", observation);
      if(observation.avalancheProblem) {
        //console.log("getAvalancheProblemDataset ##3", observation);
        dataRaw[observation.avalancheProblem].all++;
        
        if(observation.filterType === ObservationFilterType.Local) dataRaw[observation.avalancheProblem].selected++;
      }
    });
    //console.log("getAvalancheProblemDataset", dataRaw);
    const dataset = [['category', 'max', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"] * DATASET_MAX_FACTOR, values["all"], values["selected"], values["highlighted"] === 1 ? values["all"] : 0]);
    console.log("getAvalancheProblemDataset ##4 dataset", dataset);
    return {dataset: {source: dataset}}
  }

  public getDangerPatternDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    console.log("getDangerPatternDataset ##1");

    this.filterSelection[LocalFilterTypes.DangerPattern]["all"].forEach(key => dataRaw[key] = {"max": 0, "all": 0, "selected": 0, "highlighted": this.filterSelection[LocalFilterTypes.DangerPattern].highlighted.includes(key) ? 1 : 0})
    
    observations.forEach(observation => {
      console.log("getDangerPatternDataset ##2", observation.dangerPattern);
      if(observation.dangerPattern) {
        console.log("getDangerPatternDataset ##3", observation);
        dataRaw[observation.dangerPattern].all++;
        
        if(observation.filterType === ObservationFilterType.Local) dataRaw[observation.dangerPattern].selected++;
      }
    });
    //console.log("getDangerPatternDataset", dataRaw);
    const dataset = [['category', 'max', 'all','selected', 'highlighted']];

    for (const [key, values] of Object.entries(dataRaw)) dataset.push([key, values["all"] * DATASET_MAX_FACTOR, values["all"], values["selected"], values["highlighted"] === 1 ? values["all"] : 0]);
    console.log("getDangerPatternDataset ##4 dataset", dataset);
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

  isIncluded(filter: LocalFilterTypes, testData: any, testHighlighted: boolean = false): boolean {

    //console.log("isIncluded ##1", filter, testData, testHighlighted);
    let testField = "selected";
    if(!testHighlighted) {
      return (
        !this.filterSelection[filter][testField].length ||
        (typeof testData === "string" &&
          this.filterSelection[filter][testField].includes(testData))
      );

    } else {
      testField = "highlighted";
      return (
        (typeof testData === "string" &&
          this.filterSelection[filter][testField].includes(testData))
      );

    }
  }
  
  private getElevationIndex(elevation: number): string {
    if(!elevation) return "";
    const range =  this.elevationRange[1] - this.elevationRange[0];
    return (Math.floor((elevation - this.elevationRange[0]) / this.elevationSectionSize) * this.elevationSectionSize + this.elevationRange[0]) + "";

  }


  // inStability({ stability }: GenericObservation, testHighlighted: boolean = false): boolean {

  //   //console.log("inAspects ##4", this.filterSelection[LocalFilterTypes.Aspect]);
  //   let testField = "selected";
  //   if(!testHighlighted) {
  //     return (
  //       !this.filterSelection[LocalFilterTypes.Stability][testField].length ||
  //       (typeof stability === "string" &&
  //         this.filterSelection[LocalFilterTypes.Stability][testField].includes(stability))
  //     );

  //   } else {
  //     testField = "highlighted";
  //     return (
  //       (typeof stability === "string" &&
  //         this.filterSelection[LocalFilterTypes.Stability][testField].includes(stability))
  //     );

  //   }
  // }


  // private inElevationRange({ elevation }: GenericObservation, testHighlighted: boolean = false): boolean {

  //   const elevationIndex = this.getElevationIndex(elevation);
  //   console.log("inElevationRange ##4 dataset", elevationIndex, this.filterSelection[LocalFilterTypes.Elevation]["selected"].includes(elevationIndex));
  //   let testField = "selected";
  //   if(!testHighlighted) {
  //     return (!this.filterSelection[LocalFilterTypes.Elevation][testField].length ||
  //     this.filterSelection[LocalFilterTypes.Elevation][testField].includes(elevationIndex))
  //   } else {
  //     testField = "highlighted";
  //     return this.filterSelection[LocalFilterTypes.Elevation][testField].includes(elevationIndex)
  //   }

  // }



  // private inAspects({ aspect }: GenericObservation, testHighlighted: boolean = false): boolean {
  //   //console.log("inAspects ##4", this.filterSelection[LocalFilterTypes.Aspect]);
  //   let testField = "selected";
  //   if(!testHighlighted) {
  //     return (
  //       !this.filterSelection[LocalFilterTypes.Aspect][testField].length ||
  //       (typeof aspect === "string" &&
  //         this.filterSelection[LocalFilterTypes.Aspect][testField].includes(aspect.toUpperCase()))
  //     );

  //   } else {
  //     testField = "highlighted";
  //     return (
  //       (typeof aspect === "string" &&
  //         this.filterSelection[LocalFilterTypes.Aspect][testField].includes(aspect.toUpperCase()))
  //     );

  //   }
  // }

  // inAvalancheProblem({ avalancheProblem }: GenericObservation, testHighlighted: boolean = false): boolean {

  //   //console.log("inAspects ##4", this.filterSelection[LocalFilterTypes.Aspect]);
  //   let testField = "selected";
  //   if(!testHighlighted) {
  //     return (
  //       !this.filterSelection[LocalFilterTypes.Stability][testField].length ||
  //       (typeof avalancheProblem === "string" &&
  //         this.filterSelection[LocalFilterTypes.Stability][testField].includes(avalancheProblem))
  //     );

  //   } else {
  //     testField = "highlighted";
  //     return (
  //       (typeof avalancheProblem === "string" &&
  //         this.filterSelection[LocalFilterTypes.Stability][testField].includes(avalancheProblem))
  //     );

  //   }
  // }

  // inDangerPattern({ dangerPattern }: GenericObservation, testHighlighted: boolean = false): boolean {

  //   //console.log("inAspects ##4", this.filterSelection[LocalFilterTypes.Aspect]);
  //   const testData = dangerPattern;
  //   const filter = LocalFilterTypes.Stability
  //   let testField = "selected";
  //   if(!testHighlighted) {
  //     return typeof testData === "string" &&
  //         this.filterSelection[filter][testField].includes(testData);

  //   } else {
  //     testField = "highlighted";
  //     return (
  //       (typeof testData === "string" &&
  //         this.filterSelection[filter][testField].includes(testData))
  //     );

  //   }
  // }


}

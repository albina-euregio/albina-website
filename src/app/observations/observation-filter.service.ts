import { Injectable, Input } from "@angular/core";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import {
  GenericObservation,
  ObservationSource,
  LocalFilterTypes,
  FilterSelectionData,
  AvalancheProblem
} from "./models/generic-observation.model";
import * as Enums from "../enums/enums";
import { ObservationFilterType } from "./models/generic-observation.model";
import { LatLng } from "leaflet";
import { RegionsService } from "../providers/regions-service/regions.service";

const DATASET_MAX_FACTOR = 1;

interface GenericFilterToggleData {
  type: LocalFilterTypes;
  data: {
    value: string;
    altKey: boolean;
    invert: boolean;
    reset: boolean;
  };
}

@Injectable()
export class ObservationFilterService {
  public dateRange: Date[] = [];
  public readonly elevationRange = [0, 4000];
  public readonly elevationSectionSize = 500;
  public selectedElevations: number[] = [];
  public regions: string[] = [];
  public observationSources: string[] = [];

  public filterSelection: Record<LocalFilterTypes, FilterSelectionData> = {
    Elevation: { all: [], selected: [], highlighted: [] },
    Aspect: { all: [], selected: [], highlighted: [] },
    AvalancheProblem: { all: [], selected: [], highlighted: [] },
    Stability: { all: [], selected: [], highlighted: [] },
    ObservationType: { all: [], selected: [], highlighted: [] },
    ImportantObservation: { all: [], selected: [], highlighted: [] },
    DangerPattern: { all: [], selected: [], highlighted: [] },
    Days: { all: [], selected: [], highlighted: [] }
  };

  constructor(private constantsService: ConstantsService) {
    this.seedFilterSelectionsAll();
  }

  toggleFilter(filterData: GenericFilterToggleData) {
    let curFilterType = this.filterSelection[filterData["type"]];
    let curFilterTypeSubset = "selected";
    if (filterData.data.altKey) curFilterTypeSubset = "highlighted";

    if (filterData.data.reset) {
      curFilterType["selected"] = [];
      curFilterType["highlighted"] = [];
    } else if (filterData.data.invert) {
      if (curFilterType[curFilterTypeSubset].length > 0) {
        curFilterType[curFilterTypeSubset] = curFilterType.all.filter((value) => {
          return curFilterType[curFilterTypeSubset].indexOf(value) === -1 ? true : false;
        });
      }
    } else {
      let index = curFilterType[curFilterTypeSubset].indexOf(filterData.data.value);
      if (index !== -1) curFilterType[curFilterTypeSubset].splice(index, 1);
      else curFilterType[curFilterTypeSubset].push(filterData.data.value);
    }

    this.filterSelection[filterData["type"]] = curFilterType;
  }

  set days(days: number) {
    if (!this.endDate) {
      const newEndDate = new Date();
      this.endDate = newEndDate;
    }
    const newStartDate = new Date(this.endDate);
    newStartDate.setDate(newStartDate.getDate() - (days - 1));
    newStartDate.setHours(0, 0, 0, 0);

    this.startDate = newStartDate;
    this.setDateRange();
  }

  setDateRange() {
    if (this.startDate) this.startDate.setHours(0, 0, 0, 0);
    if (this.endDate) this.endDate.setHours(23, 59, 59, 999);

    if (this.startDate && this.endDate) {
      let newDates = [];
      for (var i = new Date(this.startDate); i <= this.endDate; i.setDate(i.getDate() + 1)) {
        newDates.push(i.toISOString());
      }
      this.filterSelection.Days.all = newDates;
    }
    this.dateRange = [this.startDate, this.endDate];
  }

  get startDate(): Date {
    return this.dateRange[0];
  }

  set startDate(date: Date) {
    this.dateRange[0] = date;
    this.setDateRange();
  }

  get endDate(): Date {
    return this.dateRange[1];
  }

  set endDate(date: Date) {
    this.dateRange[1] = date;
    this.setDateRange();
  }

  public isSelected(observation: GenericObservation) {
    return (
      this.inMapBounds(observation) &&
      this.inRegions(observation.region) &&
      this.isIncluded(LocalFilterTypes.Elevation, this.getElevationIndex(observation.elevation)) &&
      this.isIncluded(LocalFilterTypes.Aspect, observation.aspect) &&
      this.isIncluded(LocalFilterTypes.AvalancheProblem, observation.avalancheProblems) &&
      this.isIncluded(LocalFilterTypes.Stability, observation.stability) &&
      this.isIncluded(LocalFilterTypes.ObservationType, observation.$type) &&
      this.isIncluded(LocalFilterTypes.DangerPattern, observation.dangerPatterns) &&
      this.isIncluded(LocalFilterTypes.Days, this._normedDateString(observation.eventDate))
    );
  }

  public isHighlighted(observation: GenericObservation) {
    if (!this.inMapBounds(observation)) {
      return false;
    }
    return (
      this.isIncluded(LocalFilterTypes.Elevation, this.getElevationIndex(observation.elevation), true) ||
      this.isIncluded(LocalFilterTypes.Aspect, observation.aspect, true) ||
      this.isIncluded(LocalFilterTypes.AvalancheProblem, observation.avalancheProblems, true) ||
      this.isIncluded(LocalFilterTypes.Stability, observation.stability, true) ||
      this.isIncluded(LocalFilterTypes.ObservationType, observation.$type, true) ||
      this.isIncluded(LocalFilterTypes.DangerPattern, observation.dangerPatterns, true) ||
      this.isIncluded(LocalFilterTypes.Days, this._normedDateString(observation.eventDate), true)
    );
  }

  private seedFilterSelectionsAll() {
    for (const [key] of Object.entries(Enums.Aspect)) {
      if (isNaN(Number(key))) {
        this.filterSelection.Aspect.all.push(key);
      }
    }

    for (const [key, value] of Object.entries(Enums.Stability)) {
      this.filterSelection.Stability.all.unshift(key);
    }

    for (const [key, value] of Object.entries(Enums.ObservationType)) {
      this.filterSelection.ObservationType.all.unshift(key);
    }

    for (const [key, value] of Object.entries(Enums.ImportantObservation)) {
      this.filterSelection.ImportantObservation.all.unshift(key);
    }

    let curElevation = this.elevationRange[0];
    while (curElevation <= this.elevationRange[1]) {
      this.filterSelection.Elevation.all.push(curElevation + "");
      curElevation += this.elevationSectionSize;
    }

    for (const [key] of Object.entries(Enums.DangerPattern)) {
      if (isNaN(Number(key))) {
        this.filterSelection.DangerPattern.all.push(key);
      }
    }

    for (const [key] of Object.entries(AvalancheProblem)) {
      if (isNaN(Number(key))) {
        this.filterSelection.AvalancheProblem.all.push(key);
      }
    }
  }

  public getAspectDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.Aspect]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          all: 0,
          available: 0,
          selected: this.filterSelection[LocalFilterTypes.Aspect].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.Aspect].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (observation.aspect) {
        dataRaw[observation.aspect].all++;

        if (observation.filterType === ObservationFilterType.Local) dataRaw[observation.aspect].available++;
      } else nan++;
    });
    const dataset = [["category", "all", "highlighted", "available", "selected"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"],
        values["highlighted"] === 1 ? values["all"] * DATASET_MAX_FACTOR * DATASET_MAX_FACTOR : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  public getStabilityDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.Stability]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          all: 0,
          available: 0,
          selected: this.filterSelection[LocalFilterTypes.Stability].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.Stability].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (observation.stability) {
        dataRaw[observation.stability].all++;

        if (observation.filterType === ObservationFilterType.Local) dataRaw[observation.stability].available++;
      } else nan++;
    });
    const dataset = [["category", "max", "all", "highlighted", "available", "selected"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  public getObservationTypeDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.ObservationType]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          all: 0,
          available: 0,
          selected: this.filterSelection[LocalFilterTypes.ObservationType].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.ObservationType].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (observation.$type) {
        dataRaw[observation.$type].all++;

        if (observation.filterType === ObservationFilterType.Local) dataRaw[observation.$type].available++;
      } else nan++;
    });
    const dataset = [["category", "max", "all", "highlighted", "available", "selected"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  public getImportantObservationDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.ImportantObservation]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          all: 0,
          available: 0,
          selected: this.filterSelection[LocalFilterTypes.ImportantObservation].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.ImportantObservation].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (observation.snowLine) {
        dataRaw[Enums.ImportantObservation.SnowLine].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[Enums.ImportantObservation.SnowLine].available++;
      }
      if (observation.surfaceHoar) {
        dataRaw[Enums.ImportantObservation.SurfaceHoar].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[Enums.ImportantObservation.SurfaceHoar].available++;
      }
      if (observation.graupel) {
        dataRaw[Enums.ImportantObservation.Graupel].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[Enums.ImportantObservation.Graupel].available++;
      }
      if (observation.stabilityTest) {
        dataRaw[Enums.ImportantObservation.StabilityTest].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[Enums.ImportantObservation.StabilityTest].available++;
      }
      if (observation.iceFormation) {
        dataRaw[Enums.ImportantObservation.IceFormation].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[Enums.ImportantObservation.IceFormation].available++;
      }
      if (observation.veryLightNewSnow) {
        dataRaw[Enums.ImportantObservation.VeryLightNewSnow].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[Enums.ImportantObservation.VeryLightNewSnow].available++;
      }
    });
    const dataset = [["category", "max", "all", "highlighted", "available", "selected"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  public getElevationDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.Elevation]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          all: 0,
          available: 0,
          selected: this.filterSelection[LocalFilterTypes.Elevation].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.Elevation].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (observation.elevation) {
        const elevationIndex = this.getElevationIndex(observation.elevation);
        dataRaw[elevationIndex].all++;
        if (observation.filterType === ObservationFilterType.Local) dataRaw[elevationIndex].available++;
      } else nan++;
    });

    const dataset = [];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.unshift([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    dataset.unshift(["category", "max", "all", "highlighted", "available", "selected"]);

    return { dataset: { source: dataset }, nan };
  }

  public getAvalancheProblemDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.AvalancheProblem]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          available: 0,
          all: 0,
          selected: this.filterSelection[LocalFilterTypes.AvalancheProblem].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.AvalancheProblem].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (Array.isArray(observation.avalancheProblems)) {
        observation.avalancheProblems.forEach((avalancheProblem) => {
          if (!dataRaw[avalancheProblem]) {
            console.warn("Unsupported avalanche problem:", avalancheProblem);
            return;
          }
          dataRaw[avalancheProblem].all++;

          if (observation.filterType === ObservationFilterType.Local) dataRaw[avalancheProblem].available++;
        });
      } else nan++;
    });
    const dataset = [["category", "max", "all", "highlighted", "available", "selected"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  public getDangerPatternDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.DangerPattern]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          available: 0,
          all: 0,
          selected: this.filterSelection[LocalFilterTypes.DangerPattern].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.DangerPattern].highlighted.includes(key) ? 1 : 0
        })
    );

    observations.forEach((observation) => {
      if (Array.isArray(observation.dangerPatterns)) {
        observation.dangerPatterns.forEach((dangerPattern) => {
          if (!dangerPattern) return;
          dataRaw[dangerPattern].all++;

          if (observation.filterType === ObservationFilterType.Local) dataRaw[dangerPattern].available++;
        });
      } else nan++;
    });
    const dataset = [["category", "max", "all", "available", "selected", "highlighted"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  _normedDateString(date: Date): string {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  getDaysDataset(observations: GenericObservation[]) {
    const dataRaw = {};
    let nan = 0;

    this.filterSelection[LocalFilterTypes.Days]["all"].forEach(
      (key) =>
        (dataRaw[key] = {
          max: 0,
          all: 0,
          available: 0,
          selected: this.filterSelection[LocalFilterTypes.Days].selected.includes(key) ? 1 : 0,
          highlighted: this.filterSelection[LocalFilterTypes.Days].highlighted.includes(key) ? 1 : 0
        })
    );
    observations.forEach((observation) => {
      if (observation.eventDate) {
        const dateId = this._normedDateString(observation.eventDate);
        if (dataRaw[dateId]) {
          dataRaw[dateId].all++;
          if (observation.filterType === ObservationFilterType.Local) dataRaw[dateId].available++;
        } else console.error("observations-filter.service->getDayDataset Date not found ##4", dateId, observation);
      } else nan++;
    });
    const dataset = [["category", "max", "all", "highlighted", "available", "selected"]];

    for (const [key, values] of Object.entries(dataRaw))
      dataset.push([
        key,
        values["all"] * DATASET_MAX_FACTOR,
        values["all"],
        values["highlighted"] === 1 ? values["all"] : 0,
        values["selected"] === 0 ? values["available"] : 0,
        values["selected"] === 1 ? values["available"] : 0
      ]);
    return { dataset: { source: dataset }, nan };
  }

  inDateRange({ $source, eventDate }: GenericObservation): boolean {
    return this.startDate <= eventDate && eventDate <= this.endDate;
  }

  inMapBounds({ latitude, longitude }: GenericObservation): boolean {
    if (!latitude || !longitude) {
      return true;
    }
    const { mapBoundaryS, mapBoundaryN, mapBoundaryW, mapBoundaryE } = this.constantsService;
    return mapBoundaryS < latitude && latitude < mapBoundaryN && mapBoundaryW < longitude && longitude < mapBoundaryE;
  }

  inRegions(region: string) {
    return !this.regions.length || (typeof region === "string" && this.regions.includes(region));
  }

  inObservationSources({ $source }: GenericObservation) {
    return !this.observationSources.length || (typeof $source === "string" && this.observationSources.includes($source));
  }

  isIncluded(filter: LocalFilterTypes, testData: string | string[], testHighlighted: boolean = false): boolean {
    let testField = "selected";

    if (!testHighlighted) {
      return (
        (this.filterSelection[filter][testField].includes("nan") && !testData) ||
        !this.filterSelection[filter][testField].length ||
        (Array.isArray(testData) && testData.some((d) => this.filterSelection[filter][testField].includes(d))) ||
        (typeof testData === "string" && this.filterSelection[filter][testField].includes(testData))
      );
    } else {
      testField = "highlighted";
      return (
        (this.filterSelection[filter][testField].includes("nan") && !testData) ||
        (Array.isArray(testData) && testData.some((d) => this.filterSelection[filter][testField].includes(d))) ||
        (typeof testData === "string" && this.filterSelection[filter][testField].includes(testData))
      );
    }
  }

  private getElevationIndex(elevation: number): string {
    if (!elevation) return "";
    const range = this.elevationRange[1] - this.elevationRange[0];
    return (
      Math.floor((elevation - this.elevationRange[0]) / this.elevationSectionSize) * this.elevationSectionSize + this.elevationRange[0] + ""
    );
  }
}

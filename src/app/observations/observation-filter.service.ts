import { Injectable } from "@angular/core";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import {
  GenericObservation,
  ObservationSource,
} from "./models/generic-observation.model";

@Injectable()
export class ObservationFilterService {
  public dateRange: Date[] = [];
  public readonly elevationRange = [0, 4000];
  public readonly elevationSectionSize = 500;
  public selectedElevations: number[] = [];
  public regions: string[] = [];
  public aspects: string[] = [];

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
      !this.aspects.length ||
      (typeof aspect === "string" &&
        this.aspects.includes(aspect.toUpperCase()))
    );
  }
}

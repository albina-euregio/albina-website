import { Injectable } from "@angular/core";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { ObservationFilterService } from "../observation-filter.service";

@Injectable()
export class ObservationLocalFilterService {

  private globalFilter: ObservationFilterService;

  constructor(private constantsService: ConstantsService) {
    

  }

  public setGlobalFilter(globalFilter: ObservationFilterService): any {
    console.log("ObservationLocalFilterService->setGlobalFilter", globalFilter.dateRange);
    this.globalFilter = globalFilter;
    
  }

  public getBarData(): Object {
    return {'dataset': 
      {'source': [
        ['category', 'max', 'all', 'selected', 'highlighted'],
        ['1000', 100, 90, 20, 0],
        ['1500', 100, 90, 20, 0],
        ['2000', 100, 90, 20, 0],
        ['2500', 100, 80, 0, 60],
        ['3000', 100, 80, 0, 70],
        ['3500', 100, 50, 30, 0],
        ]
      }
    }
  };

  public getRoseData(): Object {
    return {dataset: {
      // Provide a set of data.
      source: [
            ['category', 'all','selected', 'highlighted'],
            ['N', 100, 20, 0],
            ['NE', 70, 0, 60],
            ['E', 30, 0, 20],
            ['SE', 80, 80, 0],
            ['S', 90, 80, 0],
            ['SW', 100, 0, 30],
            ['W', 80, 80, 0],
            ['NW', 90, 80, 0],
        ]
      }
    }
  };

}

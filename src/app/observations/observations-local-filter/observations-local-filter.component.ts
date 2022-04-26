import { Component, Input, OnInit } from '@angular/core';
import { ObservationLocalFilterService } from "./observation-local-filter.service";

@Component({
  selector: 'app-observations-local-filter',
  templateUrl: './observations-local-filter.component.html',
})
export class ObservationsLocalFilterComponent implements OnInit {

  @Input() filter: ObservationLocalFilterService;

  public barChartData: Object = {};
  public roseChartData: Object = {};

  constructor(public localFilter: ObservationLocalFilterService) { 
    this.barChartData = {'dataset': 
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
    };
    this.roseChartData = {dataset: {
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
    };

  }

  ngOnInit(): void {
  }

}

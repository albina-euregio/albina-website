import { Component, Input, OnInit } from '@angular/core';
import { ObservationLocalFilterService } from "./observation-local-filter.service";
import { ObservationFilterService } from "../observation-filter.service";

@Component({
  selector: 'app-observations-local-filter',
  templateUrl: './observations-local-filter.component.html',
})
export class ObservationsLocalFilterComponent implements OnInit {


  public barChartData: Object = {};
  public roseChartData: Object = {};

  //@Input() filter: ObservationFilterService;

  @Input() 
  set filter(filter: ObservationFilterService) {
    //if(filter) this.localFilter.setGlobalFilter(filter);
    this._filter = filter;
    this.localFilterService.setGlobalFilter(filter);
    this.barChartData = this.localFilterService.getBarData();
    this.roseChartData = this.localFilterService.getRoseData();
    
  }
  @Input() 
  set observations(observations: Array<Object>) {
    console.log("ObservationsLocalFilterComponent->set observations", observations);
    this._observations = observations;  
  }
  private _filter = {};
  private _observations = {};

  constructor(public localFilterService: ObservationLocalFilterService) { 
    

  }

  ngOnInit(): void {
  }

}

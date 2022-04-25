import { Component, Input, OnInit } from '@angular/core';
import { ObservationFilterService } from "../observation-filter.service";

@Component({
  selector: 'app-observations-lokal-filter',
  templateUrl: './observations-lokal-filter.component.html',
})
export class ObservationsLokalFilterComponent implements OnInit {

  @Input() filter: ObservationFilterService;

  constructor(

  ) { }

  ngOnInit(): void {
  }

}

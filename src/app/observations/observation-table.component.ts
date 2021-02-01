import { Component, Input } from "@angular/core";
import { Observation } from "app/models/observation.model";

@Component({
  selector: "app-observation-table",
  templateUrl: "observation-table.component.html"
})
export class ObservationTableComponent {
  @Input() observations: Observation[];
  observation: Observation;

  setObservation(observation: Observation) {
    this.observation = observation ? {...observation} : undefined;
  }
}

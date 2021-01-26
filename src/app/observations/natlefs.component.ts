import { Component, Input } from "@angular/core";
import { Natlefs } from "app/models/natlefs.model";

@Component({
  selector: "app-natlefs",
  templateUrl: "natlefs.component.html"
})
export class NatlefsComponent {
  @Input() natlefs: Natlefs;
}

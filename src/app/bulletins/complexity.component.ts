import { Component, Input } from "@angular/core";
import { BulletinDaytimeDescriptionModel } from "../models/bulletin-daytime-description.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-complexity",
  templateUrl: "complexity.component.html"
})
export class ComplexityComponent {

  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() disabled: boolean;

  constructor() {
  }

  setComplexity(event, complexity) {
    event.stopPropagation();
    this.bulletinDaytimeDescription.complexity = complexity;
  }

  isComplexity(complexity) {
    if (this.bulletinDaytimeDescription.getComplexity() === complexity)
      return true;
    else
      return false;
  }
}

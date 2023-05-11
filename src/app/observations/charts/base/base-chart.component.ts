import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { LocalFilterTypes } from "app/observations/models/generic-observation.model";
import { dataTool } from "echarts";

@Component({
  selector: "app-base-chart",
  template: `<div class="zippy">Base Chart Template</div>`
})
export class BaseComponent {
  longClickDur = 200;

  @Input() caption: string;
  @Input() translationBase: string;
  @Input() formatter: string;
  @Input() type: LocalFilterTypes;
  @Input() data: { dataset: object; nan: number };
  @Output() handleChange: EventEmitter<any> = new EventEmitter();
  @Input() nanStatus: { selected: Boolean; highlighted: Boolean };
  @Input() isActive: Boolean;

  constructor() {}

  submitChange(data) {
    //    console.log("BaseComponent->submitChange", data);
    this.handleChange.emit(data);
  }

  // ngOnInit(): void {
  // }
}

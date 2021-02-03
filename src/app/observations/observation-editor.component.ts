import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observation, EventType } from "app/models/observation.model";
import { SelectItem } from "primeng/api";

@Component({
  selector: "app-observation-editor",
  templateUrl: "observation-editor.component.html"
})
export class ObservationEditorComponent {
  constructor(private translate: TranslateService) {}

  @Input() observation: Observation;
  eventTypes: SelectItem[] = Object.values(EventType).map((value) => ({
    label: this.translate.instant(`observations.eventTypes.${value}`),
    value
  }));
}

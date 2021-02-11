import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observation, EventType } from "app/models/observation.model";
import { Feature, Point } from "geojson";
import { SelectItem } from "primeng/api";
import { GeocodingProperties, ObservationsService } from "./observations.service";

@Component({
  selector: "app-observation-editor",
  templateUrl: "observation-editor.component.html"
})
export class ObservationEditorComponent {
  constructor(private translate: TranslateService, private observationsService: ObservationsService) {}

  @Input() observation: Observation;
  eventTypes: SelectItem[] = Object.values(EventType).map((value) => ({
    label: this.translate.instant(`observations.eventTypes.${value}`),
    value
  }));
  locationResults: Feature<Point, GeocodingProperties>[] = [];

  async searchLocation($event: { originalEvent: Event; query: string }) {
    const result = await this.observationsService.searchLocation($event.query);
    this.locationResults = result?.features ?? [];
  }

  selectLocation(feature: Feature<Point, GeocodingProperties>): void {
    setTimeout(() => {
      // display_name	"Zischgeles, Gemeinde Sankt Sigmund im Sellrain, Bezirk Innsbruck-Land, Tirol, Österreich" -> "Zischgeles"
      this.observation.locationName = feature.properties.display_name.replace(/,.*/, "");
      this.observation.latitude = feature.geometry.coordinates[1];
      this.observation.longitude = feature.geometry.coordinates[0];
    }, 0);
  }
}

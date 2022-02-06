import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observation, EventType } from "./models/observation.model";
import { Feature, Point } from "geojson";
import { SelectItem } from "primeng/api";
import { GeocodingProperties, ObservationsService } from "./observations.service";
import { geocoders } from 'leaflet-control-geocoder'

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

  searchLocation($event: { originalEvent: Event; query: string }) {
    this.observationsService.searchLocation($event.query).subscribe((collection) => (this.locationResults = collection.features));
  }

  selectLocation(feature: Feature<Point, GeocodingProperties>): void {
    setTimeout(() => {
      // display_name	"Zischgeles, Gemeinde Sankt Sigmund im Sellrain, Bezirk Innsbruck-Land, Tirol, Österreich" -> "Zischgeles"
      this.observation.locationName = feature.properties.display_name.replace(/,.*/, "");
      this.observation.latitude = feature.geometry.coordinates[1];
      this.observation.longitude = feature.geometry.coordinates[0];
    }, 0);
  }

  parseContent($event: { clipboardData: DataTransfer }): void {
    setTimeout(() => {
      const content = this.observation.content;
      if (!this.observation.authorName && /Einsatzcode/.test(content) && /beschickte Einsatzmittel/.test(content)) {
        this.observation.authorName = "Leitstelle Tirol";
      }
      if (!this.observation.locationName && /Einsatzort/.test(content)) {
        const match = content.match(/Einsatzort:.*\n\s+.*\s+(.*)/);
        if (match) {
          this.observation.locationName = match[1];
        }
      }
      if (!this.observation.latitude && !this.observation.longitude && /Koordinaten: WGS84/.test(content)) {
        const match = content.match(/Koordinaten: WGS84(.*)/);
        const latlng = match && match[1] ? geocoders.parseLatLng(match[1].trim()) : "";
        if (latlng) {
          this.observation.latitude = latlng.lat;
          this.observation.longitude = latlng.lng;
        }
      }
    });
  }
}

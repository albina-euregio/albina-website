import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input, NgZone } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EventType, Observation } from "app/models/observation.model";
import { ObservationsService } from "app/providers/observations-service/observations.service";
import { Message } from "primeng/api";

@Component({
  selector: "app-observation-table",
  templateUrl: "observation-table.component.html"
})
export class ObservationTableComponent {
  @Input() observations: Observation[];
  observation: Observation;
  saving = false;
  messages: Message[] = [];

  constructor(private ngZone: NgZone, private observationsService: ObservationsService, private translate: TranslateService) {}

  newObservation() {
    this.observation = {
      eventType: EventType.Normal
    } as Observation;
  }

  async editObservation({ id }: Observation) {
    const observation = await this.observationsService.getObservation(id);
    if (typeof observation?.eventDate === "string") {
      observation.eventDate = new Date(observation.eventDate);
    }
    if (typeof observation?.reportDate === "string") {
      observation.reportDate = new Date(observation.reportDate);
    }
    this.ngZone.run(() => (this.observation = observation));
  }

  get showDialog(): boolean {
    return this.observation !== undefined;
  }

  set showDialog(value: boolean) {
    if (value) {
      throw Error("Cannot set boolean observation");
    } else {
      this.observation = undefined;
    }
  }

  async saveObservation(observation: Observation) {
    try {
      this.saving = true;
      if (observation.id) {
        observation = await this.observationsService.putObservation(observation);
        Object.assign(
          this.observations.find((o) => o.id === observation.id),
          observation
        );
      } else {
        observation = await this.observationsService.postObservation(observation);
        this.observations.splice(0, 0, observation);
      }
      this.showDialog = false;
    } catch (error) {
      this.reportError(error);
    } finally {
      this.saving = false;
    }
  }

  async deleteObservation(observation: Observation) {
    if (!window.confirm(this.translate.instant("observations.button.deleteConfirm"))) {
      return;
    }
    try {
      this.saving = true;
      await this.observationsService.deleteObservation(observation);
      const index = this.observations.findIndex((o) => o.id === observation.id);
      this.observations.splice(index, 1);
      this.showDialog = false;
    } catch (error) {
      this.reportError(error);
    } finally {
      this.saving = false;
    }
  }

  private reportError(error: HttpErrorResponse) {
    this.messages.push({
      severity: "error",
      summary: error.statusText,
      detail: error.message
    });
  }
}

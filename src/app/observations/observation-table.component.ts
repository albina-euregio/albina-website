import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EventType, Observation } from "app/models/observation.model";
import { ObservationsService } from "./observations.service";
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

  constructor(private observationsService: ObservationsService, private translate: TranslateService) {}

  newObservation() {
    this.observation = {
      eventType: EventType.Normal
    } as Observation;
  }

  async editObservation(observation: Observation) {
    this.observation = await this.observationsService.getObservation(observation.id);
    if (typeof this.observation?.eventDate === "string") {
      this.observation.eventDate = new Date(this.observation.eventDate);
    }
    if (typeof this.observation?.reportDate === "string") {
      this.observation.reportDate = new Date(this.observation.reportDate);
    }
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

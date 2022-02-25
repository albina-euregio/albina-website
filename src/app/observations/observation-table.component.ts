import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EventType, isAlbinaObservation, Observation } from "./models/observation.model";
import { ObservationsService } from "./observations.service";
import { Message } from "primeng/api";
import { GenericObservation } from "./models/generic-observation.model";

@Component({
  selector: "app-observation-table",
  templateUrl: "observation-table.component.html"
})
export class ObservationTableComponent {
  @Input() observations: GenericObservation[];
  @Output() observationClick: EventEmitter<GenericObservation> = new EventEmitter<GenericObservation>();
  observation: Observation;
  saving = false;
  messages: Message[] = [];
  showObservationsWithoutCoordinates: boolean = false;

  constructor(private observationsService: ObservationsService, private translate: TranslateService) {}

  newObservation() {
    this.observation = {
      eventType: EventType.Normal
    } as Observation;
  }

  hasNoCoordinates(element, index, array) {
    return (!element.latitude || !element.longitude);
  }

  onClick(observation: GenericObservation) {
    if (isAlbinaObservation(observation)) {
      this.editObservation(observation.$data);
    } else {
      this.observationClick.emit(observation);
    }
  }

  async editObservation(observation: Observation) {
    this.observation = (await this.observationsService.getObservation(observation.id).toPromise()).$data;
    if (typeof this.observation?.eventDate === "object") {
      this.observation.eventDate = this.observation.eventDate.toISOString();
    }
    if (typeof this.observation?.eventDate === "string") {
      this.observation.eventDate = this.observation.eventDate.slice(0, "2006-01-02T15:04".length);
    }
    if (typeof this.observation?.reportDate === "object") {
      this.observation.reportDate = this.observation.reportDate.toISOString();
    }
    if (typeof this.observation?.reportDate === "string") {
      this.observation.reportDate = this.observation.reportDate.slice(0, "2006-01-02T15:04".length);
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

  async saveObservation() {
    const { observation } = this;
    try {
      this.saving = true;
      if (observation.id) {
        const newObservation = await this.observationsService.putObservation(observation).toPromise();
        Object.assign(
          this.observations.find((o) => isAlbinaObservation(o) && o.$data.id === observation.id),
          newObservation
        );
      } else {
        const newObservation = await this.observationsService.postObservation(observation).toPromise();
        this.observations.splice(0, 0, newObservation);
      }
      this.showDialog = false;
    } catch (error) {
      this.reportError(error);
    } finally {
      this.saving = false;
    }
  }

  async deleteObservation() {
    const { observation } = this;
    if (!window.confirm(this.translate.instant("observations.button.deleteConfirm"))) {
      return;
    }
    try {
      this.saving = true;
      await this.observationsService.deleteObservation(observation);
      const index = this.observations.findIndex((o) => isAlbinaObservation(o) && o.$data.id === observation.id);
      this.observations.splice(index, 1);
      this.showDialog = false;
    } catch (error) {
      this.reportError(error);
    } finally {
      this.saving = false;
    }
  }

  discardObservation() {
    this.observation = undefined;
  }

  private reportError(error: HttpErrorResponse) {
    this.messages.push({
      severity: "error",
      summary: error.statusText,
      detail: error.message
    });
  }

  getTableRowStyle(observation: GenericObservation): Partial<CSSStyleDeclaration> {
    if (!isAlbinaObservation(observation)) {
      return;
    }
    switch (observation.$data.eventType) {
      case EventType.Important:
        return { color: "red" };
      case EventType.PersonNo:
        return { background: "linear-gradient(90deg, cyan 0%, white 50%)" };
      case EventType.PersonUninjured:
        return { background: "linear-gradient(90deg, limegreen 0%, white 50%)" };
      case EventType.PersonInjured:
        return { background: "linear-gradient(90deg, yellow 0%, white 50%)" };
      case EventType.PersonDead:
        return { background: "linear-gradient(90deg, red 0%, white 50%)" };
      case EventType.PersonUnknown:
        return { background: "linear-gradient(90deg, gray 0%, white 50%)" };
      case EventType.NeighborRegion:
        return { background: "linear-gradient(90deg, darkviolet 0%, white 50%)" };
    }
  }
}

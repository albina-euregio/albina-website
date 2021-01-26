import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-aspects",
  templateUrl: "aspects.component.html"
})
export class AspectsComponent {

  @Input() aspects: string[];
  @Output() aspectsChange = new EventEmitter<string[]>();
  @Input() disabled: boolean;
  @Input() size: string;

  aspect = Enums.Aspect;

  constructor() {
  }

  getSize() {
    return this.size + "px";
  }

  getColor(aspect: Enums.Aspect) {
    if (this.aspects.includes(Enums.Aspect[aspect])) {
      return "#000000";
    }
    return "#FFFFFF";
  }

  selectAspect(aspect: Enums.Aspect) {
    if (!this.disabled) {
      if (this.aspects?.length === 1) {
        let a: Enums.Aspect = Enums.Aspect[this.aspects[0]];
        if (a === aspect) {
          this.aspects = []
        } else {
          let end = (aspect + 1) % 9;
          if (end === 0) {
            end = 1;
          }
          do {
            this.aspects.push(Enums.Aspect[a]);
            a = (a + 1) % 9;
            if (a === 0) {
              a = a + 1;
            }
          } while (a !== end);
        }
      } else {
        this.aspects = [];
        this.aspects.push(Enums.Aspect[aspect]);
      }
      this.aspectsChange.emit(this.aspects);
    }
  }
}

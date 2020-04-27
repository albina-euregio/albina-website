import { Component, Input } from "@angular/core";
import { AvalancheSituationModel } from "../models/avalanche-situation.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-aspects",
  templateUrl: "aspects.component.html"
})
export class AspectsComponent {

  @Input() avalancheSituation: AvalancheSituationModel;
  @Input() disabled: boolean;
  @Input() size: string;

  aspect = Enums.Aspect;

  constructor() {
  }

  getSize() {
    return this.size + "px";
  }

  getColor(aspect) {
    for (const a of this.avalancheSituation.getAspects()) {
      const tmpAspect = "" + a;
      if (+Enums.Aspect[tmpAspect.toUpperCase()] === aspect) {
        return "#000000";
      }
    }
    return "#FFFFFF";
  }

  selectAspect(aspect) {
    if (!this.disabled) {
      if (this.avalancheSituation.getAspects().length === 1) {
        let a: any = Enums.Aspect[this.avalancheSituation.getAspects()[0]];
        if (a === aspect) {
          this.avalancheSituation.setAspects(new Array<Enums.Aspect>());
        } else {
          let end = (aspect + 1) % 9;
          if (end === 0) {
            end = 1;
          }
          do {
            this.avalancheSituation.addAspect(Enums.Aspect[a]);
            a = (a + 1) % 9;
            if (a === 0) {
              a = a + 1;
            }
          } while (a !== end);
        }
      } else {
        this.avalancheSituation.setAspects(new Array<Enums.Aspect>());
        this.avalancheSituation.addAspect(Enums.Aspect[aspect]);
      }
    }
  }
}

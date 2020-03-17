import { Component, Input, ViewChild, ElementRef, SimpleChange, AfterViewInit, OnChanges } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AvalancheSituationModel } from "../models/avalanche-situation.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-aspects",
  templateUrl: "aspects.component.html"
})
export class AspectsComponent implements AfterViewInit, OnChanges {

  @Input() avalancheSituation: AvalancheSituationModel;
  @Input() disabled: boolean;

  @ViewChild("N") aspectN: ElementRef;
  @ViewChild("NE") aspectNE: ElementRef;
  @ViewChild("E") aspectE: ElementRef;
  @ViewChild("SE") aspectSE: ElementRef;
  @ViewChild("S") aspectS: ElementRef;
  @ViewChild("SW") aspectSW: ElementRef;
  @ViewChild("W") aspectW: ElementRef;
  @ViewChild("NW") aspectNW: ElementRef;

  aspect = Enums.Aspect;

  constructor(
    private translate: TranslateService) {
  }

  ngAfterViewInit() {
    this.resetAspects();
    this.initAspects();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.resetAspects();
    this.initAspects();
  }

  private resetAspects() {
    this.aspectN.nativeElement.style.fill = "#FFFFFF";
    this.aspectN.nativeElement.focus();
    this.aspectNE.nativeElement.style.fill = "#FFFFFF";
    this.aspectNE.nativeElement.focus();
    this.aspectE.nativeElement.style.fill = "#FFFFFF";
    this.aspectE.nativeElement.focus();
    this.aspectSE.nativeElement.style.fill = "#FFFFFF";
    this.aspectSE.nativeElement.focus();
    this.aspectS.nativeElement.style.fill = "#FFFFFF";
    this.aspectS.nativeElement.focus();
    this.aspectSW.nativeElement.style.fill = "#FFFFFF";
    this.aspectSW.nativeElement.focus();
    this.aspectW.nativeElement.style.fill = "#FFFFFF";
    this.aspectW.nativeElement.focus();
    this.aspectNW.nativeElement.style.fill = "#FFFFFF";
    this.aspectNW.nativeElement.focus();
  }

  private initAspects() {
    for (const a of this.avalancheSituation.getAspects()) {
      const aspect = "" + a;
      switch (+Enums.Aspect[aspect.toUpperCase()]) {
        case Enums.Aspect.N:
          this.aspectN.nativeElement.style.fill = "#000000";
          this.aspectN.nativeElement.focus();
          break;
        case Enums.Aspect.NE:
          this.aspectNE.nativeElement.style.fill = "#000000";
          this.aspectNE.nativeElement.focus();
          break;
        case Enums.Aspect.E:
          this.aspectE.nativeElement.style.fill = "#000000";
          this.aspectE.nativeElement.focus();
          break;
        case Enums.Aspect.SE:
          this.aspectSE.nativeElement.style.fill = "#000000";
          this.aspectSE.nativeElement.focus();
          break;
        case Enums.Aspect.S:
          this.aspectS.nativeElement.style.fill = "#000000";
          this.aspectS.nativeElement.focus();
          break;
        case Enums.Aspect.SW:
          this.aspectSW.nativeElement.style.fill = "#000000";
          this.aspectSW.nativeElement.focus();
          break;
        case Enums.Aspect.W:
          this.aspectW.nativeElement.style.fill = "#000000";
          this.aspectW.nativeElement.focus();
          break;
        case Enums.Aspect.NW:
          this.aspectNW.nativeElement.style.fill = "#000000";
          this.aspectNW.nativeElement.focus();
          break;

        default:
          break;
      }
    }
  }

  selectAspect(aspect) {
    if (!this.disabled) {
      if (this.avalancheSituation.getAspects().length === 1) {
        let a: any = Enums.Aspect[this.avalancheSituation.getAspects()[0]];
        if (a === aspect) {
          this.avalancheSituation.setAspects(new Array<Enums.Aspect>());
          this.resetAspects();
        } else {
          let end = (aspect + 1) % 9;
          if (end === 0) {
            end = 1;
          }
          do {
            this.avalancheSituation.addAspect(Enums.Aspect[a]);
            switch (+a) {
              case Enums.Aspect.N:
                this.aspectN.nativeElement.style.fill = "#000000";
                this.aspectN.nativeElement.focus();
                break;
              case Enums.Aspect.NE:
                this.aspectNE.nativeElement.style.fill = "#000000";
                this.aspectNE.nativeElement.focus();
                break;
              case Enums.Aspect.E:
                this.aspectE.nativeElement.style.fill = "#000000";
                this.aspectE.nativeElement.focus();
                break;
              case Enums.Aspect.SE:
                this.aspectSE.nativeElement.style.fill = "#000000";
                this.aspectSE.nativeElement.focus();
                break;
              case Enums.Aspect.S:
                this.aspectS.nativeElement.style.fill = "#000000";
                this.aspectS.nativeElement.focus();
                break;
              case Enums.Aspect.SW:
                this.aspectSW.nativeElement.style.fill = "#000000";
                this.aspectSW.nativeElement.focus();
                break;
              case Enums.Aspect.W:
                this.aspectW.nativeElement.style.fill = "#000000";
                this.aspectW.nativeElement.focus();
                break;
              case Enums.Aspect.NW:
                this.aspectNW.nativeElement.style.fill = "#000000";
                this.aspectNW.nativeElement.focus();
                break;

              default:
                break;
            }
            a = (a + 1) % 9;
            if (a === 0) {
              a = a + 1;
            }
          } while (a !== end);
        }
      } else {
        this.avalancheSituation.setAspects(new Array<Enums.Aspect>());
        this.aspectN.nativeElement.style.fill = "#FFFFFF";
        this.aspectN.nativeElement.focus();
        this.aspectNE.nativeElement.style.fill = "#FFFFFF";
        this.aspectNE.nativeElement.focus();
        this.aspectE.nativeElement.style.fill = "#FFFFFF";
        this.aspectE.nativeElement.focus();
        this.aspectSE.nativeElement.style.fill = "#FFFFFF";
        this.aspectSE.nativeElement.focus();
        this.aspectS.nativeElement.style.fill = "#FFFFFF";
        this.aspectS.nativeElement.focus();
        this.aspectSW.nativeElement.style.fill = "#FFFFFF";
        this.aspectSW.nativeElement.focus();
        this.aspectW.nativeElement.style.fill = "#FFFFFF";
        this.aspectW.nativeElement.focus();
        this.aspectNW.nativeElement.style.fill = "#FFFFFF";
        this.aspectNW.nativeElement.focus();

        this.avalancheSituation.addAspect(Enums.Aspect[aspect]);
        switch (+aspect) {
          case Enums.Aspect.N:
            this.aspectN.nativeElement.style.fill = "#000000";
            this.aspectN.nativeElement.focus();
            break;
          case Enums.Aspect.NE:
            this.aspectNE.nativeElement.style.fill = "#000000";
            this.aspectNE.nativeElement.focus();
            break;
          case Enums.Aspect.E:
            this.aspectE.nativeElement.style.fill = "#000000";
            this.aspectE.nativeElement.focus();
            break;
          case Enums.Aspect.SE:
            this.aspectSE.nativeElement.style.fill = "#000000";
            this.aspectSE.nativeElement.focus();
            break;
          case Enums.Aspect.S:
            this.aspectS.nativeElement.style.fill = "#000000";
            this.aspectS.nativeElement.focus();
            break;
          case Enums.Aspect.SW:
            this.aspectSW.nativeElement.style.fill = "#000000";
            this.aspectSW.nativeElement.focus();
            break;
          case Enums.Aspect.W:
            this.aspectW.nativeElement.style.fill = "#000000";
            this.aspectW.nativeElement.focus();
            break;
          case Enums.Aspect.NW:
            this.aspectNW.nativeElement.style.fill = "#000000";
            this.aspectNW.nativeElement.focus();
            break;

          default:
            break;
        }
      }
    }
  }
}

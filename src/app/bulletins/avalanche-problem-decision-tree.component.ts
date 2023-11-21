import { Component, AfterContentInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-avalanche-problem-decision-tree",
  templateUrl: "avalanche-problem-decision-tree.component.html",
  styleUrls: ["avalanche-problem-decision-tree.component.scss"]
})
export class AvalancheProblemDecisionTreeComponent implements AfterContentInit {
  private resultIcons: HTMLCollection;
  private resultLabels: HTMLCollection;
  private resultIconLabelMap = ["9", "10", "8", "7", "6", "5", "4", "3", "2", "1", "0", "11"];
  private resultProblemMap = [
    Enums.AvalancheProblem.wet_snow,
    Enums.AvalancheProblem.no_distinct_problem,
    Enums.AvalancheProblem.new_snow,
    Enums.AvalancheProblem.wet_snow,
    Enums.AvalancheProblem.persistent_weak_layers,
    Enums.AvalancheProblem.wet_snow,
    Enums.AvalancheProblem.wind_slab,
    Enums.AvalancheProblem.new_snow,
    Enums.AvalancheProblem.wind_slab,
    Enums.AvalancheProblem.persistent_weak_layers,
    Enums.AvalancheProblem.gliding_snow,
    Enums.AvalancheProblem.cornices
  ];

  private problem: Enums.AvalancheProblem;

  public constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private translateService: TranslateService
  ) {}

  public ngAfterContentInit() {
    document.getElementById("picker-result")["data"] = this.translateService.instant("bulletins.create.decisionTree.filepath");
    setTimeout(() => {
      this.resultsInit();
    }, 250);
  }

  resultsInit() {
    // check if layer names are still correct when modifying the decision tree's svgs, also make sure the layers are the same for each language
    this.resultIcons = (document.getElementById("picker-result") as HTMLObjectElement).contentDocument.getElementById("layer11").children;
    this.resultLabels = (document.getElementById("picker-result") as HTMLObjectElement).contentDocument.getElementById("layer12").children;
    
    let resultsTransparent = () => {
      let opacity = 0.2;
      for (let i = 0; i < this.resultIcons.length; i++) {
        (this.resultIcons[i] as HTMLElement).style["opacity"] = opacity.toString();
      }
      for (let i = 0; i < this.resultLabels.length; i++) {
        (this.resultLabels[i] as HTMLElement).style["opacity"] = opacity.toString();
      }
    };

    resultsTransparent();
    for (let i = 0; i < this.resultIcons.length; i++) {
      this.resultIcons[i].addEventListener("click", () => {
        resultsTransparent();
        (this.resultIcons[i] as HTMLElement).style["opacity"] = "1";
        (this.resultLabels[this.resultIconLabelMap[i]] as HTMLElement).style["opacity"] = "1";
        this.problem = this.resultProblemMap[i];
      });
    }
    for (let i = 0; i < this.resultLabels.length; i++) {
      this.resultLabels[i].addEventListener("click", () => {
        resultsTransparent();
        (this.resultLabels[i] as HTMLElement).style["opacity"] = "1";
        (this.resultIcons[this.resultIconLabelMap.indexOf(i.toString())] as HTMLElement).style["opacity"] = "1";
        this.problem = this.resultProblemMap[this.resultIconLabelMap.indexOf(i.toString())];
        console.log(i);
        console.log(Enums.AvalancheProblem[this.problem]);
      });
    }
  }

  discard() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({"problem": this.problem});
  }
}
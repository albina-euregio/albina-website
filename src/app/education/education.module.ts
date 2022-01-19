import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { EducationComponent } from "./education.component";

import { EducationRoutingModule } from "./education-routing.module";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    EducationRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [
    EducationComponent
  ]
})
export class EducationModule { }

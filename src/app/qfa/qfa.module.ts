import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { QfaComponent } from "./qfa.component";

import { QfaRoutingModule } from "./qfa-routing.module";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    QfaRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [
    QfaComponent
  ]
})
export class QfaModule { }

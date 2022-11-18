import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";

import { QfaComponent } from "./qfa.component";

import { QfaRoutingModule } from "./qfa-routing.module";
import { TranslateModule } from "@ngx-translate/core";

import { QfaService } from "../providers/qfa-service/qfa.service";
import { QfaMarkerService } from "../providers/qfa-service/markers.service";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";

@NgModule({
  imports: [
    QfaRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    DialogModule,
  ],
  declarations: [
    QfaComponent
  ],
  providers: [
    QfaService,
    QfaMarkerService,
    GetQfaFilesService
  ]
})
export class QfaModule { }

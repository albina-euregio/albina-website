import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";

import { QfaComponent } from "./qfa.component";

import { QfaRoutingModule } from "./qfa-routing.module";
import { TranslateModule } from "@ngx-translate/core";

import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
import { QfaMapService } from '../providers/map-service/qfa-map.service';

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
    GetQfaFilesService,
    QfaMapService
  ]
})
export class QfaModule { }

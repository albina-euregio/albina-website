import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";

import { QfaComponent } from "./qfa.component";

import { QfaRoutingModule } from "./qfa-routing.module";
import { TranslateModule } from "@ngx-translate/core";

import { GetFilenamesService } from "../providers/qfa-service/filenames.service";
import { GetDustParamService } from "../providers/qfa-service/dust.service";
import { ParamService } from "../providers/qfa-service/param.service";
import { BaseMapService } from '../providers/map-service/base-map.service';

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
    GetFilenamesService,
    GetDustParamService,
    ParamService,
    BaseMapService
  ]
})
export class QfaModule { }

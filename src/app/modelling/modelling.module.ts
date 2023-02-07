import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModellingRoutingModule } from "./modelling-routing.module";
import { IndexComponent } from "./index.component";
import { SnowpackComponent } from "./snowpack.component";
import { SnowpackMeteoComponent } from "./snowpack.meteo.component";
import { ModellingService } from "./modelling.service";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { ForecastComponent } from "./forecast/forecast.component";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule } from "primeng/button";
import { RegionsService } from "../providers/regions-service/regions.service";

@NgModule({
  imports: [CommonModule, FormsModule, ModellingRoutingModule, TranslateModule, DialogModule, MultiSelectModule, ButtonModule],
  providers: [ModellingService, RegionsService],
  declarations: [IndexComponent, SnowpackComponent, SnowpackMeteoComponent, ForecastComponent]
})
export class ModellingModule {}

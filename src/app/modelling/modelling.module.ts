import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModellingRoutingModule } from "./modelling-routing.module";
import { IndexComponent } from './index.component';
import { SnowpackComponent } from "./snowpack.component";
import { SnowpackMeteoComponent } from "./snowpack.meteo.component";
import { ModellingService } from "./modelling.service";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { ForecastComponent } from "./forecast/forecast.component";
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModellingRoutingModule,
    TranslateModule,
    MultiSelectModule
  ],
  providers: [ModellingService],
  declarations: [IndexComponent, SnowpackComponent, SnowpackMeteoComponent, ForecastComponent]
})
export class ModellingModule {}

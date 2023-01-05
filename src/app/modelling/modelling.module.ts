import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModellingRoutingModule } from "./modelling-routing.module";
import { IndexComponent } from './index.component';
import { ZamgModelsComponent } from "./zamg-models.component";
import { SnowpackComponent } from "./snowpack.component";
import { SnowpackMeteoComponent } from "./snowpack.meteo.component";
import { ModellingService } from "./modelling.service";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { ModellingComponent } from "./modelling/modelling.component";

@NgModule({
  imports: [CommonModule, FormsModule, ModellingRoutingModule, TranslateModule],
  providers: [ModellingService],
  declarations: [IndexComponent, ZamgModelsComponent, SnowpackComponent, SnowpackMeteoComponent, ModellingComponent]
})
export class ModellingModule {}

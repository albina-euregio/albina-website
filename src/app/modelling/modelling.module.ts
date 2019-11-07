import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModellingRoutingModule } from "./modelling-routing.module";
import { ZamgModelsComponent } from "./zamg-models.component";
import { ModellingService } from "./modelling.service";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule, ModellingRoutingModule, TranslateModule],
  providers: [ModellingService],
  declarations: [ZamgModelsComponent]
})
export class ModellingModule {}

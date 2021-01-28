import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { ObservationsComponent } from "./observations.component";
import { ObservationTableComponent } from "./observation-table.component";
import { NatlefsComponent } from "./natlefs.component";

import { BulletinsModule } from "../bulletins/bulletins.module";
// Bulletins Routing
import { ObservationsRoutingModule } from "./observations-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToggleButtonModule } from "primeng/togglebutton";

// Pipes
import { PipeModule } from "../pipes/pipes.module";


@NgModule({
  imports: [
    ObservationsRoutingModule,
    BulletinsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    CalendarModule,
    ConfirmDialogModule,
    ToggleButtonModule,
    PipeModule.forRoot()
  ],
  declarations: [
    ObservationsComponent,
    ObservationTableComponent,
    NatlefsComponent
  ]
})
export class ObservationsModule { }

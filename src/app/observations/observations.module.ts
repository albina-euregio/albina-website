import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { ObservationsComponent } from "./observations.component";
import { ObservationEditorComponent } from "./observation-editor.component";
import { ObservationTableComponent } from "./observation-table.component";

import { BulletinsModule } from "../bulletins/bulletins.module";
// Bulletins Routing
import { ObservationsRoutingModule } from "./observations-routing.module";

import { TranslateModule } from "@ngx-translate/core";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";

// Pipes
import { PipeModule } from "../pipes/pipes.module";
import { ObservationsService } from "./observations.service";


@NgModule({
  imports: [
    ObservationsRoutingModule,
    BulletinsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    ToggleButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    PipeModule.forRoot()
  ],
  declarations: [
    ObservationsComponent,
    ObservationEditorComponent,
    ObservationTableComponent
  ],
  providers: [
    ObservationsService
  ]
})
export class ObservationsModule { }

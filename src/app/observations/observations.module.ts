import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { ObservationsComponent } from "./observations.component";
import { ObservationEditorComponent } from "./observation-editor.component";
import { ObservationTableComponent } from "./observation-table.component";

import { BulletinsModule } from "../bulletins/bulletins.module";
// Bulletins Routing
import { ObservationsRoutingModule } from "./observations-routing.module";

import { TranslateModule } from "@ngx-translate/core";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TableModule } from "primeng/table";

import { MenubarModule } from "primeng/menubar";
// Pipes
import { PipeModule } from "../pipes/pipes.module";

import { GeocodingService } from "./geocoding.service";
import { ObservationFilterService } from "./observation-filter.service";
import { ObservationsService } from "./observations.service";
import { NgxEchartsModule } from "ngx-echarts";
import { BarChartComponent } from "./charts/bar-chart/bar-chart.component";
import { RoseChartComponent } from "./charts/rose-chart/rose-chart.component";
import { BaseComponent } from "./charts/base/base-chart.component";
import { MapService } from "../providers/map-service/map.service";
import { ElevationService } from "./../providers/map-service/elevation.service";
import { CoordinateDataService } from "./../providers/map-service/coordinate-data.service";

@NgModule({
  imports: [
    ObservationsRoutingModule,
    BulletinsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    CalendarModule,
    MultiSelectModule,
    MenubarModule,
    ConfirmDialogModule,
    DialogModule,
    ToggleButtonModule,
    InputTextModule,
    InputTextareaModule,
    LeafletModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    AutoCompleteModule,
    TableModule,
    PipeModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
  ],
  declarations: [
    ObservationsComponent,
    ObservationEditorComponent,
    ObservationTableComponent,
    BarChartComponent,
    RoseChartComponent,
  ],
  providers: [
    GeocodingService,
    ObservationFilterService,
    ObservationsService,
    MapService,
    ElevationService,
    CoordinateDataService,
  ],
})
export class ObservationsModule {}
